'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { AuthGuard } from '@/components/Auth';
import { useBoardCards } from '@/hooks/query/useCards';
import { useBoard } from '@/hooks/query/useBoard';
import { useBoardMembers } from '@/hooks/query/useBoardMembers';
import { useAuthContext } from '@/context/AuthContext';
import { useCreateList, useReorderLists, useDeleteList } from '@/hooks/mutation/useListMutations';
import { useCreateCard, useMoveCard, useUpdateCard, useDeleteCard } from '@/hooks/mutation/useCardMutations';
import { useSocket } from '@/context/SocketContext';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconDotsVertical, IconGripVertical, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  ColorSwatch,
  Divider,
  Drawer,
  Group,
  Menu,
  Modal,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { BasicAppShell } from '@/components/Layout';
import classes from './KanbanBoard.module.css';
import type { Card as CardType, List as ListType } from '@/types/board';

const LIST_COLORS = [
  '#868e96', '#fa5252', '#fd7e14', '#fcc419', '#51cf66',
  '#20c997', '#339af0', '#748ffc', '#845ef7', '#f783ac',
];

interface ListWithCards extends ListType {
  color: string;
  cards: CardType[];
}

function SortableCard({ card, onClick }: { card: CardType; onClick: (card: CardType) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={classes.card}
      padding="sm"
      radius="md"
      withBorder
      onClick={() => onClick(card)}
      {...attributes}
      {...listeners}
    >
      <Group justify="space-between" align="flex-start">
        <Box>
          <Text size="sm" fw={500}>{card.title}</Text>
          {card.description && (
            <Text size="xs" c="dimmed" mt={4} lineClamp={2}>{card.description}</Text>
          )}
        </Box>
        <IconGripVertical size={16} className={classes.dragHandle} />
      </Group>
    </Card>
  );
}

function SortableList({
  list,
  onAddCardClick,
  onCardClick,
  onDeleteList,
  canEdit,
}: {
  list: ListWithCards;
  onAddCardClick: (listId: string) => void;
  onCardClick: (card: CardType) => void;
  onDeleteList: (listId: string) => void;
  canEdit: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card padding="md" radius="md" withBorder ref={setNodeRef} style={style} className={classes.list} {...attributes}>
      <Group justify="space-between" className={classes.listHeader} {...listeners}>
        <Group gap="xs">
          <ColorSwatch color={list.color} size={12} />
          <Text fw={600} size="sm">{list.title}</Text>
          <Badge size="sm" variant="light">{list.cards.length}</Badge>
        </Group>
        {canEdit && (
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={() => onDeleteList(list._id)}>
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <SortableContext items={list.cards.map((c) => c._id)} strategy={verticalListSortingStrategy}>
        <Box className={classes.cardsContainer}>
          {list.cards.map((card) => (
            <SortableCard key={card._id} card={card} onClick={onCardClick} />
          ))}
        </Box>
      </SortableContext>
      {canEdit && (
        <Button variant="subtle" size="xs" fullWidth mt="xs" leftSection={<IconPlus size={14} />} className={classes.addCardBtn} onClick={() => onAddCardClick(list._id)}>
          Add card
        </Button>
      )}
    </Card>
  );
}

export default function KanbanBoardPage() {
  const params = useParams();
  const boardId = params.workspaceId as string;

  const { data: boardData } = useBoard(boardId);
  const { data: membersData } = useBoardMembers(boardId);
  const { data, isLoading } = useBoardCards(boardId);
  const { user } = useAuthContext();
  const createList = useCreateList();
  const deleteList = useDeleteList();
  const reorderLists = useReorderLists();
  const createCard = useCreateCard();
  const moveCard = useMoveCard();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (socket && isConnected && boardId) {
      socket.emit('join-board', boardId);
    }
    return () => {
      if (socket && boardId) {
        socket.emit('leave-board', boardId);
      }
    };
  }, [socket, isConnected, boardId]);

  const [lists, setLists] = useState<ListWithCards[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'list' | null>(null);
  const [lastOverId, setLastOverId] = useState<string | null>(null);
  const sourceListRef = useRef<string | null>(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListColor, setNewListColor] = useState(LIST_COLORS[0]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [cardDrawerOpen, setCardDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [deleteCardConfirmOpen, setDeleteCardConfirmOpen] = useState(false);

  const userRole = useMemo(() => {
    if (!membersData || !user) return 'viewer';
    const members = membersData as Array<{ userId: { _id: string }; role: string }> | undefined;
    if (!members || !Array.isArray(members)) return 'viewer';
    const member = members.find((m) => m.userId._id === user?.id);
    return member?.role || 'viewer';
  }, [membersData, user]);

  const canEdit = userRole === 'owner' || userRole === 'editor';
  const isReadOnly = userRole === 'viewer';

  useEffect(() => {
    if (data?.lists && data?.cards) {
      const listMap = new Map<string, ListWithCards>();
      data.lists.forEach((list) => {
        listMap.set(list._id, {
          _id: list._id,
          title: list.title,
          boardId: list.boardId,
          position: list.position,
          createdAt: list.createdAt,
          updatedAt: list.updatedAt,
          color: list.color || LIST_COLORS[list.position % LIST_COLORS.length],
          cards: [],
        });
      });
      data.cards.forEach((card) => {
        const list = listMap.get(card.listId);
        if (list) list.cards.push(card);
      });
      const sortedLists = Array.from(listMap.values()).sort((a, b) => a.position - b.position);
      sortedLists.forEach((list) => list.cards.sort((a, b) => a.position - b.position));
      setLists(sortedLists);
    }
  }, [data]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findListByCardId = (cardId: string) => lists.find((l) => l.cards.some((c) => c._id === cardId));

  const handleDragStart = (event: DragStartEvent) => {
    console.log('DragStart:', event.active.id, 'lists.length:', lists.length);
    const { id } = event.active;
    setActiveId(id as string);
    const isCard = lists.some((l) => l.cards.some((c) => c._id === id));
    setActiveType(isCard ? 'card' : 'list');
    if (isCard) {
      const list = lists.find((l) => l.cards.some((c) => c._id === id));
      sourceListRef.current = list?._id || null;
      console.log('Source list captured:', list?._id);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    console.log('DragOver:', event.active.id, event.over?.id);
    const { active, over } = event;
    if (!over || activeType !== 'card') return;

    const overId = String(over.id);
    const isOverList = lists.some((l) => l._id === overId);
    if (isOverList) {
      setLastOverId(overId);
    } else {
      const overListCard = findListByCardId(overId);
      if (overListCard) {
        setLastOverId(overListCard._id);
      }
    }

    const activeId = active.id as string;
    const activeList = findListByCardId(activeId);
    const overList = lists.find((l) => l._id === overId) || findListByCardId(overId);

    if (!activeList || !overList) return;

    setLists((prev) => {
      const activeListIndex = prev.findIndex((l) => l._id === activeList._id);
      const overListIndex = prev.findIndex((l) => l._id === overList._id);

      if (activeListIndex === -1 || overListIndex === -1) return prev;

      const activeCardIndex = prev[activeListIndex].cards.findIndex((c) => c._id === activeId);
      const overCardIndex = prev[overListIndex].cards.findIndex((c) => c._id === overId);

      if (activeCardIndex === -1) return prev;

      const newLists = [...prev];
      const [movedCard] = newLists[activeListIndex].cards.splice(activeCardIndex, 1);

      if (overCardIndex >= 0) {
        newLists[overListIndex].cards.splice(overCardIndex, 0, movedCard);
      } else {
        newLists[overListIndex].cards.push(movedCard);
      }

      return newLists;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('DragEnd:', event.active.id, event.over?.id, 'activeType:', activeType, 'lastOverId:', lastOverId);
    const { active, over } = event;
    
    const type = activeType;
    const overId = lastOverId;
    const originalSourceListId = sourceListRef.current;
    
    setActiveId(null);
    setActiveType(null);
    setLastOverId(null);
    sourceListRef.current = null;

    if (!over || !overId) return;

    const activeId = String(active.id);

    console.log('Checking:', { activeId, overId, type, originalSourceListId });

    if (type === 'list') {
      const oldIndex = lists.findIndex((l) => l._id === activeId);
      const newIndex = lists.findIndex((l) => l._id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const newLists = arrayMove(lists, oldIndex, newIndex);
        setLists(newLists);
        reorderLists.mutate({ boardId, listIds: newLists.map((l) => l._id) });
      }
      return;
    }

    if (type === 'card') {
      const targetList = lists.find((l) => l._id === overId);
      console.log('Target list:', targetList?._id, 'source:', originalSourceListId);
      
      if (!targetList) return;

      if (originalSourceListId && targetList._id !== originalSourceListId) {
        console.log('CROSS LIST MOVE - calling API');
        moveCard.mutate({ cardId: activeId, newListId: targetList._id, position: targetList.cards.length });
        const sourceListIdx = lists.findIndex((l) => l._id === originalSourceListId);
        if (sourceListIdx !== -1) {
          setLists((prev) => {
            const newLists = [...prev];
            const cardIdx = newLists[sourceListIdx].cards.findIndex((c) => c._id === activeId);
            if (cardIdx !== -1) {
              const [card] = newLists[sourceListIdx].cards.splice(cardIdx, 1);
              newLists.find((l) => l._id === targetList._id)?.cards.push(card);
            }
            return newLists;
          });
        }
        return;
      }

      const sourceListFinal = lists.find((l) => l._id === originalSourceListId) || findListByCardId(activeId);
      if (!sourceListFinal) return;

      const listIndex = lists.findIndex((l) => l._id === sourceListFinal._id);
      const newIndexIndex = lists[listIndex].cards.findIndex((c) => c._id === overId);
      const oldIndex = lists[listIndex].cards.findIndex((c) => c._id === activeId);

      console.log('Same list reorder:', { oldIndex, newIndexIndex });

      if (oldIndex === -1 || newIndexIndex === -1) return;

      if (oldIndex !== newIndexIndex) {
        const updatedCards = arrayMove(lists[listIndex].cards, oldIndex, newIndexIndex);
        const newLists = [...lists];
        newLists[listIndex] = { ...newLists[listIndex], cards: updatedCards };
        setLists(newLists);
        console.log('SAME LIST REORDER - calling API');
        moveCard.mutate({ cardId: activeId, newListId: sourceListFinal._id, position: newIndexIndex });
      }
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    const result = await createList.mutateAsync({ boardId, title: newListTitle.trim(), color: newListColor });
    setLists((prev) => [
      ...prev,
      { _id: result._id, title: result.title, boardId: result.boardId, position: result.position, createdAt: result.createdAt, updatedAt: result.updatedAt, color: result.color || newListColor, cards: [] },
    ]);
    setNewListTitle('');
    setNewListColor(LIST_COLORS[0]);
    setIsAddingList(false);
  };

  const handleDeleteList = async (listId: string) => {
    await deleteList.mutateAsync(listId);
    setLists((prev) => prev.filter((l) => l._id !== listId));
  };

  const handleOpenDrawer = (listId: string) => {
    setSelectedListId(listId);
    setNewCardTitle('');
    setNewCardDescription('');
    setDrawerOpen(true);
  };

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    setEditCardTitle(card.title);
    setEditCardDescription(card.description || '');
    setIsEditingCard(false);
    setCardDrawerOpen(true);
  };

  const handleUpdateCard = async () => {
    if (!selectedCard || !editCardTitle.trim()) return;
    await updateCard.mutateAsync({ cardId: selectedCard._id, data: { title: editCardTitle.trim(), description: editCardDescription.trim() || undefined } });
    setLists((prev) => prev.map((list) => ({
      ...list,
      cards: list.cards.map((c) => c._id === selectedCard._id ? { ...c, title: editCardTitle.trim(), description: editCardDescription.trim() || undefined } : c),
    })));
    setSelectedCard({ ...selectedCard, title: editCardTitle.trim(), description: editCardDescription.trim() || undefined });
    setIsEditingCard(false);
  };

  const handleDeleteCard = async () => {
    if (!selectedCard) return;
    await deleteCard.mutateAsync(selectedCard._id);
    setLists((prev) => prev.map((list) => ({ ...list, cards: list.cards.filter((c) => c._id !== selectedCard._id) })));
    setCardDrawerOpen(false);
    setSelectedCard(null);
    setDeleteCardConfirmOpen(false);
  };

  const handleAddCard = async () => {
    if (!newCardTitle.trim() || !selectedListId) return;
    const result = await createCard.mutateAsync({ listId: selectedListId, title: newCardTitle.trim(), description: newCardDescription.trim() || undefined });
    setLists((prev) => prev.map((list) => list._id === selectedListId ? { ...list, cards: [...list.cards, { ...result, listId: selectedListId }] } : list));
    setDrawerOpen(false);
    setNewCardTitle('');
    setNewCardDescription('');
    setSelectedListId(null);
  };

  const getActiveItem = () => {
    if (!activeId) return null;
    if (activeType === 'list') return lists.find((l) => l._id === activeId);
    const list = findListByCardId(activeId);
    return list?.cards.find((c) => c._id === activeId);
  };

  const activeItem = getActiveItem();

  if (isLoading) {
    return (
      <AuthGuard>
        <BasicAppShell>
          <Box p="xl">Loading...</Box>
        </BasicAppShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <BasicAppShell>
        <Box className={classes.wrapper}>
          <Group justify="space-between" className={classes.boardHeader}>
            <Title order={3}>{boardData?.title || 'Board'}</Title>
            <Button size="xs" variant="light">Settings</Button>
          </Group>

          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
            <Box className={classes.board}>
              <SortableContext items={lists.map((l) => l._id)} strategy={horizontalListSortingStrategy}>
                {lists.map((list) => (
                  <SortableList key={list._id} list={list} onAddCardClick={handleOpenDrawer} onCardClick={handleCardClick} onDeleteList={handleDeleteList} canEdit={canEdit} />
                ))}
              </SortableContext>

              <Box className={classes.addListContainer}>
                {isAddingList ? (
                  <Box className={classes.addListForm}>
                    <TextInput placeholder="Enter list title" size="xs" value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} autoFocus onKeyDown={(e) => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') setIsAddingList(false); }} />
                    <Box mt="xs">
                      <Text size="xs" c="dimmed" mb={4}>Color</Text>
                      <Group gap={4}>
                        {LIST_COLORS.map((color) => (
                          <ColorSwatch
                            key={color}
                            color={color}
                            size={20}
                            onClick={() => setNewListColor(color)}
                            style={{ cursor: 'pointer', border: newListColor === color ? '2px solid var(--mantine-color-dark-5)' : '2px solid transparent', borderRadius: '4px' }}
                          />
                        ))}
                      </Group>
                    </Box>
                    <Group gap="xs" mt="xs">
                      <Button size="xs" onClick={handleAddList}>Add</Button>
                      <Button size="xs" variant="subtle" onClick={() => setIsAddingList(false)}>Cancel</Button>
                    </Group>
                  </Box>
                ) : canEdit && (
                  <Button variant="subtle" fullWidth leftSection={<IconPlus size={16} />} onClick={() => setIsAddingList(true)} className={classes.addListBtn}>Add another list</Button>
                )}
              </Box>
            </Box>

            <DragOverlay>
              {activeId && activeType === 'card' && activeItem && (
                <Box className={classes.dragOverlayCard}>
                  <Text size="sm" fw={500}>{(activeItem as CardType).title}</Text>
                </Box>
              )}
              {activeId && activeType === 'list' && activeItem && (
                <Box className={classes.dragOverlayList}>
                  <Text fw={600} size="sm">{(activeItem as ListWithCards).title}</Text>
                </Box>
              )}
            </DragOverlay>
          </DndContext>

          <Drawer opened={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add New Card" position="right" size="md" withCloseButton={false}>
            <Box style={{ padding: '16px' }}>
              <TextInput label="Title" placeholder="Enter card title" value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} required mb="md" styles={{ input: { height: '48px' } }} />
              <Textarea label="Description" placeholder="Enter card description (optional)" value={newCardDescription} onChange={(e) => setNewCardDescription(e.target.value)} minRows={4} mb="xl" />
              <Group justify="flex-end">
                <Button variant="subtle" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCard} disabled={!newCardTitle.trim()}>Add Card</Button>
              </Group>
            </Box>
          </Drawer>

          <Drawer opened={cardDrawerOpen} onClose={() => { setCardDrawerOpen(false); setIsEditingCard(false); }} title="Card Details" position="right" size="md" withCloseButton={false}>
            {selectedCard && (
              <Box style={{ padding: '16px' }}>
                {isEditingCard ? (
                  <>
                    <TextInput label="Title" value={editCardTitle} onChange={(e) => setEditCardTitle(e.target.value)} mb="md" />
                    <Textarea label="Description" value={editCardDescription} onChange={(e) => setEditCardDescription(e.target.value)} minRows={4} mb="xl" />
                    <Group justify="flex-end">
                      <Button variant="subtle" onClick={() => { setIsEditingCard(false); setEditCardTitle(selectedCard.title); setEditCardDescription(selectedCard.description || ''); }}>Cancel</Button>
                      <Button onClick={handleUpdateCard} disabled={!editCardTitle.trim()}>Save</Button>
                    </Group>
                  </>
                ) : (
                  <>
                    <Group justify="space-between" mb="md">
                      <Title order={4}>{selectedCard.title}</Title>
                      {canEdit && (
                        <Group gap="xs">
                          <Button size="xs" variant="light" onClick={() => setIsEditingCard(true)}>Edit</Button>
                          <Button size="xs" variant="light" color="red" onClick={() => setDeleteCardConfirmOpen(true)}>Delete</Button>
                        </Group>
                      )}
                    </Group>
                    {selectedCard.description && (<><Text size="sm" fw={500} c="dimmed" mb="xs">Description</Text><Text size="sm" mb="lg">{selectedCard.description}</Text></>)}
                    <Divider my="md" />
                    <Text size="sm" fw={500} c="dimmed" mb="xs">Details</Text>
                    <Group gap="md">
                      <Box>
                        <Text size="xs" c="dimmed">Created at</Text>
                        <Text size="sm">{selectedCard.createdAt ? new Date(selectedCard.createdAt).toLocaleDateString() : 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text size="xs" c="dimmed">Updated at</Text>
                        <Text size="sm">{selectedCard.updatedAt ? new Date(selectedCard.updatedAt).toLocaleDateString() : 'N/A'}</Text>
                      </Box>
                    </Group>
                  </>
                )}
              </Box>
            )}
          </Drawer>

          <Modal opened={deleteCardConfirmOpen} onClose={() => setDeleteCardConfirmOpen(false)} title="Delete Card" centered size="sm">
            <Text mb="lg">Are you sure you want to delete this card? This action cannot be undone.</Text>
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setDeleteCardConfirmOpen(false)}>Cancel</Button>
              <Button color="red" onClick={handleDeleteCard}>Delete</Button>
            </Group>
          </Modal>
        </Box>
      </BasicAppShell>
    </AuthGuard>
  );
}