'use client';

import Link from 'next/link';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { BasicAppShell } from '@/components/Layout';
import classes from './Workspace.module.css';

const mockBoards = [
  { id: '1', name: 'Product Roadmap', color: 'violet', tasks: 12 },
  { id: '2', name: 'Marketing Campaign', color: 'blue', tasks: 8 },
  { id: '3', name: 'Bug Tracking', color: 'red', tasks: 24 },
  { id: '4', name: 'Team Tasks', color: 'green', tasks: 15 },
];

export default function WorkspacePage() {
  return (
    <BasicAppShell>
      <Box className={classes.wrapper}>
        <Container size="xl" py="xl">
          <Group justify="space-between" align="center" mb="xl">
            <div>
              <Title order={2} className={classes.title}>
                Your Workspace
              </Title>
              <Text c="dimmed" size="sm">
                Organize your projects with boards
              </Text>
            </div>
            <Button leftSection={<IconPlus size={16} />}>New Board</Button>
          </Group>

          <Title order={4} className={classes.sectionTitle}>
            Recent Boards
          </Title>

          {mockBoards.length === 0 ? (
            <Card className={classes.emptyState} padding="xl" radius="md">
              <div className={classes.emptyContent}>
                <img src="/empty.svg" alt="No boards" className={classes.emptyImage} />
                <Title order={4} mt="md">
                  Create your first board
                </Title>
                <Text c="dimmed" size="sm" mt="xs" maw={400} ta="center">
                  Start organizing your ideas, tasks, or projects in one place. You can also join an
                  existing board to collaborate with others.
                </Text>
                <Button mt="lg" size="md">
                  Create First Board
                </Button>
              </div>
            </Card>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
              {mockBoards.map((board) => (
                <Card
                  key={board.id}
                  className={classes.boardCard}
                  padding="md"
                  radius="md"
                  withBorder
                  component={Link}
                  href={`/workspace/${board.id}`}
                >
                  <Group justify="space-between" align="flex-start">
                    <div
                      className={classes.boardColor}
                      style={{ backgroundColor: `var(--mantine-color-${board.color}-6)` }}
                    />
                    <ActionIcon variant="subtle" color="gray" size="sm">
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  </Group>
                  <Text fw={600} size="lg" mt="md">
                    {board.name}
                  </Text>
                  <Group justify="space-between" mt="xs">
                    <Badge size="sm" variant="light" color={board.color}>
                      {board.tasks} tasks
                    </Badge>
                  </Group>
                </Card>
              ))}
              <Card className={classes.newBoardCard} padding="md" radius="md" withBorder>
                <Group justify="center" align="center" h="100%">
                  <div className={classes.newBoardContent}>
                    <IconPlus size={32} stroke={1.5} />
                    <Text size="sm" fw={500} mt="xs">
                      Create new board
                    </Text>
                  </div>
                </Group>
              </Card>
            </SimpleGrid>
          )}
        </Container>
      </Box>
    </BasicAppShell>
  );
}
