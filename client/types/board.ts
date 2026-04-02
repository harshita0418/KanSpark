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
}

export interface CreateBoardInput {
  title: string;
  description?: string;
}