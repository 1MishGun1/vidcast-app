export interface IUser {
  _id: string;
  name: string;
  surname: string;
  login: string;
  email: string;
  passwordHash: string;
  avatar: string;
  coverProfile: string;
  createdAt: string;
  updatedAt: string;
  tokenUser: string;
}

export interface IUserState {
  currentUser: IUser | null;
  selectedUser: IUser | null;
  // users: IUser[];
  loading: boolean;
  error: string | null;
}

export interface ILoginUser {
  login: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface IUserResponse {
  tokenUser: string;
  user: IUser;
}
