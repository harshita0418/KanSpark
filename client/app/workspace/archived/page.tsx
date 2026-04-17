'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconDotsVertical, IconPlus, IconTrash, IconArchive, IconRestore } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Card,
  Container,
  Group,
  Menu,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
  Button,
  Modal,
} from '@mantine/core';
import { BasicAppShell } from '@/components/Layout';
import { AuthGuard } from '@/components/Auth';
import { useArchivedBoards } from '@/hooks/query/useBoards';
import { useRestoreBoard, usePermanentDeleteBoard } from '@/hooks/mutation/useBoardMutations';
import classes from '../Workspace.module.css';

export default function ArchivedBoardsPage() {
  const { data: boards, isLoading, error } = useArchivedBoards();
  const restoreBoard = useRestoreBoard();
  const permanentDeleteBoard = usePermanentDeleteBoard();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  const handleRestore = async (boardId: string) => {
    try {
      await restoreBoard.mutateAsync(boardId);
    } catch (err) {
      console.error('Failed to restore board:', err);
    }
  };

  const handlePermanentDelete = async () => {
    if (!boardToDelete) return;
    try {
      await permanentDeleteBoard.mutateAsync(boardToDelete);
      setConfirmDeleteOpen(false);
      setBoardToDelete(null);
    } catch (err) {
      console.error('Failed to permanently delete board:', err);
    }
  };

  const openDeleteConfirm = (boardId: string) => {
    setBoardToDelete(boardId);
    setConfirmDeleteOpen(true);
  };

  const boardColors = ['violet', 'blue', 'green', 'orange', 'red', 'grape', 'pink', 'teal'];

  return (
    <AuthGuard>
      <BasicAppShell>
        <Box className={classes.wrapper}>
          <Container size="xl" py="xl">
            <Group justify="space-between" align="center" mb="xl">
              <div>
                <Title order={2} className={classes.title}>
                  Archived Boards
                </Title>
                <Text c="dimmed" size="sm">
                  View and restore deleted boards
                </Text>
              </div>
              <Button
                component={Link}
                href="/workspace"
                variant="light"
                leftSection={<IconArchive size={16} />}
              >
                Back to Workspace
              </Button>
            </Group>

            {isLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className={classes.boardCard} padding="md" radius="md" withBorder>
                    <Skeleton height={20} width="30%" mb="md" />
                    <Skeleton height={28} width="70%" />
                  </Card>
                ))}
              </SimpleGrid>
            ) : error ? (
              <Text c="red" size="sm">Failed to load archived boards</Text>
            ) : boards && boards.length === 0 ? (
              <Card className={classes.emptyState} padding="xl" radius="md">
                <div className={classes.emptyContent}>
                  <IconArchive size={48} stroke={1.5} style={{ opacity: 0.5 }} />
                  <Title order={4} mt="md">
                    No archived boards
                  </Title>
                  <Text c="dimmed" size="sm" mt="xs" maw={400} ta="center">
                    Deleted boards will appear here. You can restore them or permanently delete them.
                  </Text>
                </div>
              </Card>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
                {boards?.map((board, index) => (
                  <Card
                    key={board._id}
                    className={classes.boardCard}
                    padding="md"
                    radius="md"
                    withBorder
                  >
                    <Group justify="space-between" align="flex-end">
                      <div
                        className={classes.boardColor}
                        style={{ backgroundColor: `var(--mantine-color-${boardColors[index % boardColors.length]}-6)` }}
                      />

                      <Menu shadow="md" width={200} position="bottom-end">
                        <Menu.Target>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            size="sm"
                            onClick={(e) => e.preventDefault()}
                          >
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Actions</Menu.Label>
                          <Menu.Item
                            leftSection={<IconRestore size={14} />}
                            onClick={() => handleRestore(board._id)}
                          >
                            Restore
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={() => openDeleteConfirm(board._id)}
                          >
                            Delete Permanently
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                    <Text fw={600} size="lg" mt="md">
                      {board.title}
                    </Text>
                    {board.description && (
                      <Text size="sm" c="dimmed" mt="xs" lineClamp={2}>
                        {board.description}
                      </Text>
                    )}
                    <Group gap="xs" mt="sm">
                      <Text size="xs" c="dimmed">
                        Deleted: {new Date(board.deletedAt || board.updatedAt).toLocaleDateString()}
                      </Text>
                    </Group>
                    <Button
                      variant="light"
                      size="xs"
                      mt="md"
                      fullWidth
                      leftSection={<IconRestore size={14} />}
                      onClick={() => handleRestore(board._id)}
                      loading={restoreBoard.isPending}
                    >
                      Restore Board
                    </Button>
                  </Card>
                ))}
              </SimpleGrid>
            )}
          </Container>
        </Box>

        <Modal
          opened={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
          title="Permanently Delete Board"
          centered
          size="sm"
        >
          <Text mb="lg">
            Are you sure you want to permanently delete this board? This action cannot be undone and all data will be lost.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handlePermanentDelete} loading={permanentDeleteBoard.isPending}>
              Delete Permanently
            </Button>
          </Group>
        </Modal>
      </BasicAppShell>
    </AuthGuard>
  );
}