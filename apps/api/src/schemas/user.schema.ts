import { E } from '@common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  _id?: string;
  id?: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: true, set: (v) => v.toLowerCase(), trim: true })
  username!: string;

  @Prop({ unique: true, set: (v) => v.toLowerCase(), trim: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: Object.values(E.StatusEnum), createdIndex: true })
  status!: E.StatusEnum;

  @Prop({ default: null })
  refreshToken?: string;

  @Prop({ type: Types.ObjectId })
  createdBy?: Types.ObjectId;

  @Prop({ type: Date, default: () => Date.now() })
  createdAt!: Date;

  @Prop({ type: Types.ObjectId })
  updatedBy?: Types.ObjectId;

  @Prop({ type: Date, default: () => Date.now() })
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
