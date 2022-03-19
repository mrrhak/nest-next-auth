import { Injectable } from '@nestjs/common';
import { User } from '@schemas';
import { Request, SubjectBeforeFilterHook } from 'nest-casl';
import { UserService } from './user.service';

@Injectable()
export class UserHook implements SubjectBeforeFilterHook<User, Request> {
  constructor(readonly userService: UserService) {}

  async run({ params }: Request) {
    return await this.userService.findOne({ _id: params.id });
  }
}
