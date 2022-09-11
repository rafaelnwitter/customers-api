import { v4 as uuid } from 'uuid';
const randomUuid = uuid();
export interface Customer {
  id: string;
  username: string;
  document: number;
  email: string;
}
