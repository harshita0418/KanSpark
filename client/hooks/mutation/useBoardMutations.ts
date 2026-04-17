import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Board, CreateBoardInput } from '@/types/board';

async function createBoard(data: CreateBoardInput): Promise<Board> {
  return apiFetch<Board>('/boards', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async function updateBoard(boardId: string, data: Partial<CreateBoardInput>): Promise<Board> {
  return apiFetch<Board>(`/boards/${boardId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async function deleteBoard(boardId: string): Promise<void> {
  return apiFetch<void>(`/boards/${boardId}`, {
    method: 'DELETE',
  });
}

async function restoreBoard(boardId: string): Promise<Board> {
  return apiFetch<Board>(`/boards/${boardId}/restore`, {
    method: 'POST',
  });
}

async function permanentDeleteBoard(boardId: string): Promise<void> {
  return apiFetch<void>(`/boards/${boardId}/permanent`, {
    method: 'DELETE',
  });
}

async function addMember(boardId: string, userId: string, role: string): Promise<unknown> {
  return apiFetch(`/members/${boardId}/members`, {
    method: 'POST',
    body: JSON.stringify({ userId, role }),
  });
}

async function removeMember(boardId: string, userId: string): Promise<void> {
  return apiFetch<void>(`/members/${boardId}/members/${userId}`, {
    method: 'DELETE',
  });
}

async function updateMemberRole(boardId: string, userId: string, role: string): Promise<unknown> {
  return apiFetch(`/members/${boardId}/members/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: string; data: Partial<CreateBoardInput> }) =>
      updateBoard(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useRestoreBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['boards', 'archived'] });
    },
  });
}

export function usePermanentDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: permanentDeleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', 'archived'] });
    },
  });
}

export function useAddMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, userId, role }: { boardId: string; userId: string; role: string }) =>
      addMember(boardId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, userId }: { boardId: string; userId: string }) =>
      removeMember(boardId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, userId, role }: { boardId: string; userId: string; role: string }) =>
      updateMemberRole(boardId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board-members'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
}