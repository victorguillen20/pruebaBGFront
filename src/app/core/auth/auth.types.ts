export interface User {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleId: number;
  mustChangePassword: boolean;
}

export interface Menu {
  id: number;
  key: string;
  label: string;
  icon: string;
  route: string;
  order: number;
}
