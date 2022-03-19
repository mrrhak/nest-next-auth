import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from '@schemas';
import { CreateSessionInput } from './dto/session.input.dto';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(Session.name) private model: Model<SessionDocument>
  ) {}

  async create(input: CreateSessionInput) {
    return await this.model.create(input);
  }

  async deleteById(id: string): Promise<boolean> {
    return await this.model.findByIdAndDelete(id);
  }

  async deleteByAccessToken(accessToken: string): Promise<boolean> {
    return await this.model.findOneAndDelete({ accessToken });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<boolean> {
    return await this.model.findOneAndDelete({ refreshToken });
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    await this.model.deleteMany({ userId });
    return true;
  }

  async findById(id: string): Promise<SessionDocument> {
    return await this.model.findById(id);
  }

  async findByUserId(userId: string): Promise<SessionDocument[]> {
    return await this.model.find({ userId });
  }

  async findByAccessToken(accessToken: string): Promise<SessionDocument> {
    return await this.model.findOne({ accessToken });
  }

  async findByRefreshToken(refreshToken: string): Promise<SessionDocument> {
    return await this.model.findOne({ refreshToken });
  }
}
