import { Document } from 'mongoose';

interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  password: string;
}

export default User;
