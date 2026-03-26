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
  Badge,
  Box,
  Button,
  Card,
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
}

interface List {
  id: string;
  title: string;
  cards: Card[];
}

const initialData: List[] = [
  {
    id: 'list-1',
    title: 'To Do',
    cards: [
      {
        id: 'card-1',
        title: 'Design landing page',
        description: 'Create a beautiful landing page design',
      },
      {
        id: 'card-2',
        title: 'Set up project structure',
        description: 'Initialize the project with proper structure',
      },
    ],
  },
  {
    id: 'list-2',
    title: 'In Progress',
    cards: [
      {
        id: 'card-3',
        title: 'Implement authentication',
        description: 'Add login and signup functionality',
      },
    ],
  },
  {
    id: 'list-3',
    title: 'Done',
    cards: [
      { id: 'card-4', title: 'Project setup', description: 'Initialize the Next.js project' },
    ],
  },
];

function SortableCard({ card }: { card: Card }) {
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
}: {
  list: List;
  onAddCardClick: (listId: string) => void;
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
            <SortableCard key={card.id} card={card} />
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
  const [isAddingList, setIsAddingList] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

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
      cards: [],
    };
    setLists([...lists, newList]);
    setNewListTitle('');
    setIsAddingList(false);
  };

  const handleOpenDrawer = (listId: string) => {
    setSelectedListId(listId);
    setNewCardTitle('');
    setNewCardDescription('');
    setDrawerOpen(true);
  };

  const handleAddCard = () => {
    if (!newCardTitle.trim() || !selectedListId) {
      return;
    }
    const newCard: Card = {
      id: `card-${Date.now()}`,
      title: newCardTitle.trim(),
      description: newCardDescription.trim() || undefined,
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
                <SortableList key={list.id} list={list} onAddCardClick={handleOpenDrawer} />
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
      </Box>
    </BasicAppShell>
  );
}
