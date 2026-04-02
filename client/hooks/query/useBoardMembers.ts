import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

interface BoardMember {
  _id: string;
  userId: {
    _id: string;
    name: string;
    lastname: string;
    email: string;
  };
  role: 'owner' | 'editor' | 'viewer';
  createdAt?: string;
  updatedAt?: string;
}

async function fetchBoardMembers(boardId: string): Promise<BoardMember[]> {
  return apiFetch<BoardMember[]>(`/members/${boardId}/members`);
}

export function useBoardMembers(boardId: string) {
  return useQuery({
    queryKey: ['board-members', boardId],
    queryFn: () => fetchBoardMembers(boardId),
    enabled: !!boardId,
  });
}