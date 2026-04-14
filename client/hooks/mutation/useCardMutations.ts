import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Card } from '@/types/board';

async function createCard(listId: string, title: string, description?: string): Promise<Card> {
  return apiFetch<Card>('/cards', {
    method: 'POST',
    body: JSON.stringify({ title, description, listId }),
  });
}

async function updateCard(cardId: string, data: { title?: string; description?: string; assigneeId?: string }): Promise<Card> {
  return apiFetch<Card>(`/cards/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

async function deleteCard(cardId: string): Promise<void> {
  return apiFetch<void>(`/cards/${cardId}`, {
    method: 'DELETE',
  });
}

async function moveCard(cardId: string, newListId: string, position: number): Promise<Card> {
  return apiFetch<Card>(`/cards/${cardId}/move`, {
    method: 'PATCH',
    body: JSON.stringify({ newListId, position }),
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ listId, title, description }: { listId: string; title: string; description?: string }) =>
      createCard(listId, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: string; data: { title?: string; description?: string; assigneeId?: string } }) =>
      updateCard(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}

export function useMoveCard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cardId, newListId, position }: { cardId: string; newListId: string; position: number }) =>
      moveCard(cardId, newListId, position),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
    },
  });
}