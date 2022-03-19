import { Types } from 'mongoose';

export const getObjectId = (text?: string) => {
  if (text) return new Types.ObjectId(text);
  else return new Types.ObjectId(0);
};
