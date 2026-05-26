export interface NestedUserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  user?: NestedUserData;
}