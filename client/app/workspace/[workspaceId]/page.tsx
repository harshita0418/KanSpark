'use client';

import { useState } from 'react';
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
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { BasicAppShell } from '@/components/Layout';
import classes from './KanbanBoard.module.css';

interface Card {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  createdBy?: string;
}

interface List {
  id: string;
  title: string;
  color: string;
  cards: Card[];
}

const LIST_COLORS = [
  '#868e96', // gray
  '#fa5252', // red
  '#fd7e14', // orange
  '#fcc419', // yellow
  '#51cf66', // green
  '#20c997', // teal
  '#339af0', // blue
  '#748ffc', // indigo
  '#845ef7', // violet
  '#f783ac', // pink
];

const initialData: List[] = [
  {
    id: 'list-1',
    title: 'To Do',
    color: '#fa5252',
    cards: [
      {
        id: 'card-1',
        title: 'Design landing page',
        description: 'Create a beautiful landing page design',
        createdAt: '2024-01-15',
        createdBy: 'John Doe',
      },
      {
        id: 'card-2',
        title: 'Set up project structure',
        description: 'Initialize the project with proper structure',
        createdAt: '2024-01-14',
        createdBy: 'Jane Smith',
      },
    ],
  },
  {
    id: 'list-2',
    title: 'In Progress',
    color: '#339af0',
    cards: [
      {
        id: 'card-3',
        title: 'Implement authentication',
        description: 'Add login and signup functionality',
        createdAt: '2024-01-13',
        createdBy: 'John Doe',
      },
    ],
  },
  {
    id: 'list-3',
    title: 'Done',
    color: '#51cf66',
    cards: [
      {
        id: 'card-4',
        title: 'Project setup',
        description: 'Initialize the Next.js project',
        createdAt: '2024-01-10',
        createdBy: 'Jane Smith',
      },
    ],
  },
];

function SortableCard({ card, onClick }: { card: Card; onClick: (card: Card) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
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
          <Text size="sm" fw={500}>
            {card.title}
          </Text>
          {card.description && (
            <Text size="xs" c="dimmed" mt={4} lineClamp={2}>
              {card.description}
            </Text>
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
}: {
  list: List;
  onAddCardClick: (listId: string) => void;
  onCardClick: (card: Card) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      padding="md"
      radius="md"
      withBorder
      ref={setNodeRef}
      style={style}
      className={classes.list}
      {...attributes}
    >
      <Group justify="space-between" className={classes.listHeader} {...listeners}>
        <Group gap="xs">
          <ColorSwatch color={list.color} size={12} />
          <div className={classes.boardColor} style={{ backgroundColor: `${list.color}` }} />
          <Text fw={600} size="sm">
            {list.title}
          </Text>
          <Badge size="sm" variant="light">
            {list.cards.length}
          </Badge>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm" onClick={(e) => e.stopPropagation()}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconTrash size={14} />} color="red">
              Delete list
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <Box className={classes.cardsContainer}>
          {list.cards.map((card) => (
            <SortableCard key={card.id} card={card} onClick={onCardClick} />
          ))}
        </Box>
      </SortableContext>
      <Button
        variant="subtle"
        size="xs"
        fullWidth
        mt="xs"
        leftSection={<IconPlus size={14} />}
        className={classes.addCardBtn}
        onClick={() => onAddCardClick(list.id)}
      >
        Add card
      </Button>
    </Card>
  );
}

export default function KanbanBoardPage() {
  const [lists, setLists] = useState(initialData);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'list' | null>(null);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListColor, setNewListColor] = useState(LIST_COLORS[0]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [cardDrawerOpen, setCardDrawerOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const findListByCardId = (cardId: string) =>
    lists.find((l) => l.cards.some((c) => c.id === cardId));

  const handleDragStart = (event: DragStartEvent) => {
    const { id } = event.active;
    setActiveId(id as string);
    if (id.toString().startsWith('card-')) {
      setActiveType('card');
    } else {
      setActiveType('list');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || activeType !== 'card') {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeList = findListByCardId(activeId);
    const overList = lists.find((l) => l.id === overId) || findListByCardId(overId);

    if (!activeList || !overList || activeList.id === overList.id) {
      return;
    }

    setLists((prev) => {
      const activeListIndex = prev.findIndex((l) => l.id === activeList.id);
      const overListIndex = prev.findIndex((l) => l.id === overList.id);

      const activeCardIndex = prev[activeListIndex].cards.findIndex((c) => c.id === activeId);
      const overCardIndex = prev[overListIndex].cards.findIndex((c) => c.id === overId);

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
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) {
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) {
      return;
    }

    if (activeType === 'list') {
      const oldIndex = lists.findIndex((l) => l.id === activeId);
      const newIndex = lists.findIndex((l) => l.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setLists((prev) => arrayMove(prev, oldIndex, newIndex));
      }
    } else {
      const activeList = findListByCardId(activeId);
      const overList = lists.find((l) => l.id === overId) || findListByCardId(overId);

      if (!activeList || !overList) {
        return;
      }

      if (activeList.id === overList.id) {
        const listIndex = lists.findIndex((l) => l.id === activeList.id);
        const oldIndex = lists[listIndex].cards.findIndex((c) => c.id === activeId);
        const newIndex = lists[listIndex].cards.findIndex((c) => c.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setLists((prev) => {
            const newLists = [...prev];
            newLists[listIndex].cards = arrayMove(newLists[listIndex].cards, oldIndex, newIndex);
            return newLists;
          });
        }
      }
    }
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) {
      return;
    }
    const newList: List = {
      id: `list-${Date.now()}`,
      title: newListTitle,
      color: newListColor,
      cards: [],
    };
    setLists([...lists, newList]);
    setNewListTitle('');
    setNewListColor(LIST_COLORS[0]);
    setIsAddingList(false);
  };

  const handleOpenDrawer = (listId: string) => {
    setSelectedListId(listId);
    setNewCardTitle('');
    setNewCardDescription('');
    setDrawerOpen(true);
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setCardDrawerOpen(true);
  };

  const handleAddCard = () => {
    if (!newCardTitle.trim() || !selectedListId) {
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: newCardTitle.trim(),
      description: newCardDescription.trim() || undefined,
      createdAt: today,
      createdBy: 'Current User',
    };
    setLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId ? { ...list, cards: [...list.cards, newCard] } : list
      )
    );
    setDrawerOpen(false);
    setNewCardTitle('');
    setNewCardDescription('');
    setSelectedListId(null);
  };

  const getActiveItem = () => {
    if (!activeId) {
      return null;
    }
    if (activeType === 'list') {
      return lists.find((l) => l.id === activeId);
    }
    const list = findListByCardId(activeId);
    return list?.cards.find((c) => c.id === activeId);
  };

  const activeItem = getActiveItem();

  return (
    <BasicAppShell>
      <Box className={classes.wrapper}>
        <Group justify="space-between" className={classes.boardHeader}>
          <Title order={3}>Product Roadmap</Title>
          <Button size="xs" variant="light">
            Settings
          </Button>
        </Group>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <Box className={classes.board}>
            <SortableContext
              items={lists.map((l) => l.id)}
              strategy={horizontalListSortingStrategy}
            >
              {lists.map((list) => (
                <SortableList
                  key={list.id}
                  list={list}
                  onAddCardClick={handleOpenDrawer}
                  onCardClick={handleCardClick}
                />
              ))}
            </SortableContext>

            <Box className={classes.addListContainer}>
              {isAddingList ? (
                <Box className={classes.addListForm}>
                  <TextInput
                    placeholder="Enter list title"
                    size="xs"
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddList();
                      }
                      if (e.key === 'Escape') {
                        setIsAddingList(false);
                      }
                    }}
                  />
                  <Box mt="xs">
                    <Text size="xs" c="dimmed" mb={4}>
                      Status color
                    </Text>
                    <Group gap={4}>
                      {LIST_COLORS.map((color) => (
                        <ColorSwatch
                          key={color}
                          color={color}
                          size={20}
                          style={{
                            cursor: 'pointer',
                            border:
                              newListColor === color
                                ? '2px solid var(--mantine-color-dark-5)'
                                : '2px solid transparent',
                            borderRadius: '4px',
                          }}
                          onClick={() => setNewListColor(color)}
                        />
                      ))}
                    </Group>
                  </Box>
                  <Group gap="xs" mt="xs">
                    <Button size="xs" onClick={handleAddList}>
                      Add
                    </Button>
                    <Button size="xs" variant="subtle" onClick={() => setIsAddingList(false)}>
                      Cancel
                    </Button>
                  </Group>
                </Box>
              ) : (
                <Button
                  variant="subtle"
                  fullWidth
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setIsAddingList(true)}
                  className={classes.addListBtn}
                >
                  Add another list
                </Button>
              )}
            </Box>
          </Box>

          <DragOverlay>
            {activeId && activeType === 'card' && activeItem && (
              <Box className={classes.dragOverlayCard}>
                <Text size="sm" fw={500}>
                  {(activeItem as Card).title}
                </Text>
              </Box>
            )}
            {activeId && activeType === 'list' && activeItem && (
              <Box className={classes.dragOverlayList}>
                <Text fw={600} size="sm">
                  {(activeItem as List).title}
                </Text>
              </Box>
            )}
          </DragOverlay>
        </DndContext>

        <Drawer
          opened={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title="Add New Card"
          position="right"
          size="md"
          withCloseButton={false}
        >
          <Box style={{ padding: '16px' }}>
            <TextInput
              label="Title"
              placeholder="Enter card title"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              required
              mb="md"
              styles={{ input: { height: '48px' } }}
            />
            <Textarea
              label="Description"
              placeholder="Enter card description (optional)"
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              minRows={4}
              mb="xl"
            />
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setDrawerOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCard} disabled={!newCardTitle.trim()}>
                Add Card
              </Button>
            </Group>
          </Box>
        </Drawer>

        <Drawer
          opened={cardDrawerOpen}
          onClose={() => setCardDrawerOpen(false)}
          title="Card Details"
          position="right"
          size="md"
          withCloseButton={false}
        >
          {selectedCard && (
            <Box style={{ padding: '16px' }}>
              <Title order={4} mb="md">
                {selectedCard.title}
              </Title>
              {selectedCard.description && (
                <>
                  <Text size="sm" fw={500} c="dimmed" mb="xs">
                    Description
                  </Text>
                  <Text size="sm" mb="lg">
                    {selectedCard.description}
                  </Text>
                </>
              )}
              <Divider my="md" />
              <Text size="sm" fw={500} c="dimmed" mb="xs">
                Details
              </Text>
              <Group gap="md">
                <Box>
                  <Text size="xs" c="dimmed">
                    Created at
                  </Text>
                  <Text size="sm">{selectedCard.createdAt || 'N/A'}</Text>
                </Box>
                <Box>
                  <Text size="xs" c="dimmed">
                    Created by
                  </Text>
                  <Group gap="xs">
                    <Avatar size="sm" radius="xl">
                      {selectedCard.createdBy?.charAt(0) || '?'}
                    </Avatar>
                    <Text size="sm">{selectedCard.createdBy || 'Unknown'}</Text>
                  </Group>
                </Box>
              </Group>
            </Box>
          )}
        </Drawer>
      </Box>
    </BasicAppShell>
  );
}
