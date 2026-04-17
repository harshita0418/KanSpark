export interface BoardMember {
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

export interface Board {
  _id: string;
  title: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    lastname: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  members?: BoardMember[];
  deletedAt?: string | null;
}

export interface CreateBoardInput {
  title: string;
  description?: string;
}

export interface List {
  _id: string;
  title: string;
  boardId: string;
  color?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  _id: string;
  title: string;
  description?: string;
  listId: string;
  boardId: string;
  assigneeId?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}