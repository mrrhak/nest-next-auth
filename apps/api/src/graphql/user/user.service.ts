import { BaseService } from '@lib/mongoose/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@schemas';
import { CreateUserInput, FilterUserInput } from './dto/user.input';
import { PaginatedUserModel } from './dto/user.model';
import { HashLibService } from '@lib/hash';

@Injectable()
export class UserService extends BaseService<UserDocument> {
  constructor(
    @InjectModel(User.name)
    readonly model: Model<UserDocument>,
    private readonly hashService: HashLibService
  ) {
    super(model);
  }

  async createUser(input: CreateUserInput): Promise<UserDocument> {
    input.password = await this.hashService.hash(input.password);
    return await this.create(input);
  }

  async getUser(filter: any): Promise<UserDocument> {
    return await this.findOne(filter);
  }

  async getUsers(filter: FilterUserInput): Promise<PaginatedUserModel> {
    const { firstName, lastName, email, ...pageFilter } = filter;
    const myFilter = { ...pageFilter };
    if (firstName) {
      myFilter['firstName'] = `{$regex:"${firstName}"}`;
    }
    if (lastName) {
      myFilter['lastName'] = `{$regex:"${lastName}"}`;
    }
    if (email) {
      myFilter['email'] = `{$regex:"${email}"}`;
    }
    return await this.getPaginatedList(myFilter);
  }
}
