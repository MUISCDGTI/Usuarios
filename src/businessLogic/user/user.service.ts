import { omit } from 'lodash';
import { DocumentDefinition } from 'mongoose';
import User, { UserDocument } from './user.model';

export async function createUser(input: DocumentDefinition<Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword'>>) {
  try {
    const user = await User.create(input);
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({ email, password }: { email: string, password: string }) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
}
