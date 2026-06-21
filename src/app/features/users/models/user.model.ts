import { UserResponse } from '../../../core/api/api.types';

export interface UserTableRow {
  id: number;
  names: string;
  userName: string;
  email: string;
  createdAt: string;
  raw: UserResponse;
}
