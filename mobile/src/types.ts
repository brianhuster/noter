export interface User {
  _id: string;
  username: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
