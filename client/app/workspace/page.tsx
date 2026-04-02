'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { IconDotsVertical, IconPlus, IconTrash, IconEdit, IconUserPlus, IconSearch } from '@tabler/icons-react';
import {
  ActionIcon,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Drawer,
  Group,
  Menu,
  Modal,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Combobox,
  useCombobox,
  useMantineTheme,
  useComputedColorScheme,
} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { BasicAppShell } from '@/components/Layout';
import { AuthGuard } from '@/components/Auth';
import { RoleSelector } from '@/components/RoleSelector/RoleSelector';
import { useBoards } from '@/hooks/query/useBoards';
import { useCreateBoard, useDeleteBoard, useUpdateBoard, useAddMember, useUpdateMemberRole, useRemoveMember } from '@/hooks/mutation/useBoardMutations';
import { useSearchUsers } from '@/hooks/query/useSearchUsers';
import { useAuthContext } from '@/context/AuthContext';
import classes from './Workspace.module.css';

export default function WorkspacePage() {
  const theme = useMantineTheme();
  const computedColorScheme = useComputedColorScheme('light');
  const { user } = useAuthContext();

  const [modalOpened, setModalOpened] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [boardToEdit, setBoardToEdit] = useState<{ id: string; title: string; description: string } | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [addMemberModalOpened, setAddMemberModalOpened] = useState(false);
  const [membersDrawerOpened, setMembersDrawerOpened] = useState(false);
  const [boardForMembers, setBoardForMembers] = useState<string | null>(null);
  const [boardMembersList, setBoardMembersList] = useState<any[]>([]);
  const [boardCreatorId, setBoardCreatorId] = useState<string>('');
  const [boardForMember, setBoardForMember] = useState<string | null>(null);
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState<{ id: string; name: string; email: string } | null>(null);
  const [memberRole, setMemberRole] = useState<'editor' | 'viewer'>('viewer');

  const { data: boards, isLoading, error } = useBoards();
  const createBoard = useCreateBoard();
  const deleteBoard = useDeleteBoard();
  const updateBoard = useUpdateBoard();
  const addMember = useAddMember();
  const updateMemberRole = useUpdateMemberRole();
  const removeMember = useRemoveMember();

  const refreshMembersList = () => {
    if (boardForMembers && boards) {
      const board = boards.find(b => b._id === boardForMembers);
      if (board) {
        setBoardMembersList(board.members || []);
      }
    }
  };

  useEffect(() => {
    if (updateMemberRole.isSuccess || removeMember.isSuccess) {
      refreshMembersList();
    }
  }, [updateMemberRole.isSuccess, removeMember.isSuccess, boards]);

  const { data: searchResults } = useSearchUsers(memberSearch);

  const combobox = useCombobox();

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    try {
      await createBoard.mutateAsync({
        title: newBoardTitle,
        description: newBoardDescription || undefined
      });
      setModalOpened(false);
      setNewBoardTitle('');
      setNewBoardDescription('');
    } catch (err) {
      console.error('Failed to create board:', err);
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;
    try {
      await deleteBoard.mutateAsync(boardToDelete);
      setDeleteModalOpened(false);
      setBoardToDelete(null);
    } catch (err) {
      console.error('Failed to delete board:', err);
    }
  };

  const openDeleteModal = (boardId: string) => {
    setBoardToDelete(boardId);
    setDeleteModalOpened(true);
  };

  const openEditModal = (board: { _id: string; title: string; description?: string }) => {
    setBoardToEdit({ id: board._id, title: board.title, description: board.description || '' });
    setEditTitle(board.title);
    setEditDescription(board.description || '');
    setEditModalOpened(true);
  };

  const handleUpdateBoard = async () => {
    if (!boardToEdit || !editTitle.trim()) return;
    try {
      await updateBoard.mutateAsync({
        boardId: boardToEdit.id,
        data: { title: editTitle, description: editDescription || undefined }
      });
      setEditModalOpened(false);
      setBoardToEdit(null);
      setEditTitle('');
      setEditDescription('');
    } catch (err) {
      console.error('Failed to update board:', err);
    }
  };

  const openMembersDrawer = (boardId: string, members: any[], createdBy: string) => {
    setBoardForMembers(boardId);
    setBoardMembersList(members);
    setBoardCreatorId(createdBy);
    setMembersDrawerOpened(true);
  };

  const openAddMemberModal = (boardId: string) => {
    setBoardForMember(boardId);
    setAddMemberModalOpened(true);
    setMemberSearch('');
    setSelectedMember(null);
    setMemberRole('viewer');
  };

  const [addMemberError, setAddMemberError] = useState('');

  const handleAddMember = async () => {
    setAddMemberError('');
    if (!boardForMember || !selectedMember) return;
    try {
      await addMember.mutateAsync({
        boardId: boardForMember,
        userId: selectedMember.id,
        role: memberRole
      });
      setAddMemberModalOpened(false);
      setBoardForMember(null);
      setSelectedMember(null);
      setMemberRole('viewer');
    } catch (err) {
      setAddMemberError(err instanceof Error ? err.message : 'Failed to add member');
    }
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
                  Your Workspace
                </Title>
                <Text c="dimmed" size="sm">
                  Organize your projects with boards
                </Text>
              </div>
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setModalOpened(true)}
              >
                New Board
              </Button>
            </Group>

            <Title order={4} className={classes.sectionTitle}>
              Recent Boards
            </Title>

            {isLoading ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing="md">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Card key={i} className={classes.boardCard} padding="md" radius="md" withBorder>
                    <Skeleton height={20} width="30%" mb="md" />
                    <Skeleton height={28} width="70%" />
                  </Card>
                ))}
              </SimpleGrid>
            ) : error ? (
              <Text c="red" size="sm">Failed to load boards</Text>
            ) : boards && boards.length === 0 ? (
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
                  <Button mt="lg" size="md" onClick={() => setModalOpened(true)}>
                    Create First Board
                  </Button>
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
                    component={Link}
                    href={`/workspace/${board._id}`}
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
                            leftSection={<IconEdit size={14} />}
                            onClick={(e) => {
                              e.preventDefault();
                              openEditModal(board);
                            }}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconUserPlus size={14} />}
                            onClick={(e) => {
                              e.preventDefault();
                              openAddMemberModal(board._id);
                            }}
                          >
                            Add Member
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={14} />}
                            onClick={(e) => {
                              e.preventDefault();
                              openDeleteModal(board._id);
                            }}
                          >
                            Delete
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
                        {new Date(board.createdAt).toLocaleDateString()}
                      </Text>
                      {/* {board.updatedAt && board.updatedAt !== board.createdAt && (
                        <Text size="xs" c="dimmed">
                          Updated: {new Date(board.updatedAt).toLocaleDateString()}
                        </Text>
                      )} */}

                      {board.members && board.members.length > 0 && (
                        <Avatar.Group style={{ marginLeft: "auto" }}>
                          {board.members?.slice(0, 3).map((member) => (
                            <Avatar
                              key={member._id}
                              size="sm"
                              radius="xl"
                              color="violet"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openMembersDrawer(board._id, board.members || [], typeof board.createdBy === 'string' ? board.createdBy : (board.createdBy as any)?._id);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              {member.userId?.name?.[0] || '?'}
                            </Avatar>
                          ))}
                          {board.members && board.members.length > 3 && (
                            <Avatar
                              size="sm"
                              radius="xl"
                              color="gray"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openMembersDrawer(board._id, board.members || [], typeof board.createdBy === 'string' ? board.createdBy : (board.createdBy as any)?._id);
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              +{board.members.length - 3}
                            </Avatar>
                          )}
                        </Avatar.Group>
                      )}
                    </Group>
                  </Card>
                ))}
                <Card
                  className={classes.newBoardCard}
                  padding="md"
                  radius="md"
                  withBorder
                  onClick={() => setModalOpened(true)}
                  style={{ cursor: 'pointer' }}
                >
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

        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Create New Board"
          centered
        >
          <TextInput
            label="Board Title"
            placeholder="Enter board title"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter board description (optional)"
            value={newBoardDescription}
            onChange={(e) => setNewBoardDescription(e.target.value)}
            mt="md"
            minRows={3}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setModalOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBoard}
              loading={createBoard.isPending}
              disabled={!newBoardTitle.trim()}
            >
              Create
            </Button>
          </Group>
        </Modal>

        <Modal
          opened={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          title="Delete Board"
          centered
          size="sm"
        >
          <Text mb="lg">Are you sure you want to delete this board? This action cannot be undone.</Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
              Cancel
            </Button>
            <Button color="red" onClick={handleDeleteBoard} loading={deleteBoard.isPending}>
              Delete
            </Button>
          </Group>
        </Modal>

        <Modal
          opened={editModalOpened}
          onClose={() => setEditModalOpened(false)}
          title="Edit Board"
          centered
        >
          <TextInput
            label="Board Title"
            placeholder="Enter board title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            required
          />
          <Textarea
            label="Description"
            placeholder="Enter board description (optional)"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            mt="md"
            minRows={3}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setEditModalOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBoard}
              loading={updateBoard.isPending}
              disabled={!editTitle.trim()}
            >
              Save
            </Button>
          </Group>
        </Modal>

        <Modal
          opened={addMemberModalOpened}
          onClose={() => setAddMemberModalOpened(false)}
          title="Add Member"
          centered
        >
          <Combobox
            store={combobox}
            onOptionSubmit={(value) => {
              const user = searchResults?.find((u) => u._id === value);
              if (user) {
                setSelectedMember({ id: user._id, name: `${user.name} ${user.lastname}`, email: user.email });
              }
              setMemberSearch('');
              combobox.closeDropdown();
            }}
          >
            <Combobox.Target>
              <TextInput
                label="Search User"
                placeholder="Search by name or email"
                leftSection={<IconSearch size={16} />}
                value={memberSearch}
                onChange={(e) => {
                  setMemberSearch(e.target.value);
                  combobox.openDropdown();
                }}
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
              />
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                {memberSearch.length < 2 && (
                  <Combobox.Empty c="dimmed">Search a user</Combobox.Empty>
                )}
                {searchResults?.map((user) => (
                  <Combobox.Option key={user._id} value={user._id}>
                    <Group gap="sm">
                      <Avatar size="sm" radius="xl">
                        {user.name[0]}
                      </Avatar>
                      <div>
                        <Text size="sm">{user.name} {user.lastname}</Text>
                        <Text size="xs" c="dimmed">{user.email}</Text>
                      </div>
                    </Group>
                  </Combobox.Option>
                ))}
                {memberSearch.length >= 2 && (!searchResults || searchResults.length === 0) && (
                  <Combobox.Empty>No users found</Combobox.Empty>
                )}
              </Combobox.Options>
            </Combobox.Dropdown>
          </Combobox>

          {addMemberError && (
            <Alert withCloseButton closeButtonLabel="Dismiss" color="red" variant="light" mt="md" icon={<IconX />} onClose={() => setAddMemberError('')}>
              {addMemberError}
            </Alert>
          )}

          {selectedMember && (
            <Box mt="md" p="md" style={{ background: computedColorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1], borderRadius: 8 }}>
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>{selectedMember.name}</Text>
                  <Text size="xs" c="dimmed">{selectedMember.email}</Text>
                </div>
                <Button variant="subtle" size="xs" onClick={() => setSelectedMember(null)}>Change</Button>
              </Group>
            </Box>
          )}

          <Box mt="md">
            <Text size="sm" fw={500} mb="xs">Role</Text>
            <RoleSelector value={memberRole} onChange={setMemberRole} />
          </Box>

          <Group justify="flex-end" mt="lg">
            <Button variant="default" onClick={() => setAddMemberModalOpened(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              loading={addMember.isPending}
              disabled={!selectedMember}
            >
              Add Member
            </Button>
          </Group>
        </Modal>

        <Drawer
          opened={membersDrawerOpened}
          onClose={() => setMembersDrawerOpened(false)}
          title="Board Members"
          position="right"
          size="sm"
        >
          <Stack gap="sm">
            {boardMembersList?.map((member) => {
              const isOwner = boardCreatorId === member.userId?._id;
              const isCurrentUser = user?.id === member.userId?._id;
              const canEdit = boardCreatorId === user?.id && !isOwner;

              const roleColors: Record<string, string> = {
                owner: 'violet',
                editor: 'blue',
                viewer: 'gray',
              };

              const roleLabels: Record<string, string> = {
                owner: 'Owner',
                editor: 'Editor',
                viewer: 'Viewer',
              };

              const memberRole = member.role || 'viewer';
              const badgeColor = roleColors[memberRole] || 'gray';
              const badgeLabel = isCurrentUser ? 'You' : (roleLabels[memberRole] || memberRole);

              return (
                <Paper key={member._id} p="sm" withBorder>
                  <Group justify="space-between" wrap="nowrap">
                    <Group gap="sm" wrap="nowrap">
                      <Avatar color="violet" radius="xl">
                        {member.userId?.name?.[0] || '?'}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {member.userId?.name} {member.userId?.lastname}
                        </Text>
                        <Badge color={badgeColor} variant="light">
                          {badgeLabel}
                        </Badge>
                      </div>
                    </Group>
                    {isOwner ? (
                      <Badge color="violet" variant="light">Owner</Badge>
                    ) : canEdit ? (
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray" size="sm">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Label>Role</Menu.Label>
                          <Menu.Item
                            onClick={() => updateMemberRole.mutate({
                              boardId: boardForMembers!,
                              userId: member.userId._id,
                              role: 'editor'
                            })}
                          >
                            Editor
                          </Menu.Item>
                          <Menu.Item
                            onClick={() => updateMemberRole.mutate({
                              boardId: boardForMembers!,
                              userId: member.userId._id,
                              role: 'viewer'
                            })}
                          >
                            Viewer
                          </Menu.Item>
                          <Menu.Divider />
                          <Menu.Item
                            color="red"
                            onClick={() => removeMember.mutate({
                              boardId: boardForMembers!,
                              userId: member.userId._id
                            })}
                          >
                            Remove
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    ) : (
                      <Badge color={badgeColor} variant="light">
                        {badgeLabel}
                      </Badge>
                    )}
                  </Group>
                </Paper>
              );
            })}
          </Stack>
        </Drawer>
      </BasicAppShell>
    </AuthGuard>
  );
}