import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { List } from '@/types/board';

async function createList(boardId: string, title: string): Promise<List> {
  return apiFetch<List>('/lists', {
    method: 'POST',
    body: JSON.stringify({ title, boardId }),
  });
}

async function updateList(listId: string, data: { title?: string; position?: number }): Promise<List> {
  return apiFetch<List>(`/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

async function deleteList(listId: string): Promise<void> {
  return apiFetch<void>(`/lists/${listId}`, {
    method: 'DELETE',
  });
}

async function reorderLists(boardId: string, listIds: string[]): Promise<void> {
  return apiFetch<void>('/lists/reorder', {
    method: 'POST',
    body: JSON.stringify({ boardId, listIds }),
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, title }: { boardId: string; title: string }) => createList(boardId, title),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.boardId] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, data }: { listId: string; data: { title?: number; position?: number } }) =>
      updateList(listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (listId: string) => deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] });
    },
  });
}

export function useReorderLists() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ boardId, listIds }: { boardId: string; listIds: string[] }) =>
      reorderLists(boardId, listIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lists', variables.boardId] });
    },
  });
}