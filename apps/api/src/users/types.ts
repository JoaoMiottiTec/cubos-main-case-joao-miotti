export type UserSafe = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthResponse = {
  token: string;
  user: UserSafe;
};
