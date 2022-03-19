import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Session {
  _id?: string;
  id?: string;

  @Prop({ index: true, required: true })
  userId!: string;

  @Prop({ unique: true, required: true })
  accessToken!: string;

  @Prop({ unique: true, required: true })
  refreshToken!: string;

  @Prop({ type: Date, required: true })
  expiredAt!: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
export type SessionDocument = Session & Document;
