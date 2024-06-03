export type User = {
  username: string;
  pushups: number;
  completed: number;
};

export type Users = {
  [id: string]: User;
};
