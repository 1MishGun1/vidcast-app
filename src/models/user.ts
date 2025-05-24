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
  data: IUser | null;
  loading: boolean;
  error: string | null;
}

export interface ILoginUser {
  login: string;
  password: string;
}

export interface IUserResponse {
  tokenUser: string;
  user: IUser;
}
