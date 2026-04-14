import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import type { Card, List } from '@/types/board';

interface CardWithList extends Card {
  listTitle?: string;
}

async function fetchCards(listId: string): Promise<Card[]> {
  return apiFetch<Card[]>(`/cards?listId=${listId}`);
}

export function useCards(listId: string) {
  return useQuery({
    queryKey: ['cards', listId],
    queryFn: () => fetchCards(listId),
    enabled: !!listId,
  });
}

async function fetchAllCardsByBoard(boardId: string): Promise<{ cards: Card[]; lists: List[] }> {
  const [lists, cards] = await Promise.all([
    apiFetch<List[]>(`/lists?boardId=${boardId}`),
    apiFetch<Card[]>(`/cards?boardId=${boardId}`),
  ]);
  return { cards, lists };
}

export function useBoardCards(boardId: string) {
  return useQuery({
    queryKey: ['board-cards', boardId],
    queryFn: () => fetchAllCardsByBoard(boardId),
    enabled: !!boardId,
  });
}