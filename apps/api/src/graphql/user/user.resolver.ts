import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput, FilterUserInput } from './dto/user.input';
import { PaginatedUserModel, UserModel } from './dto/user.model';
import { UserService } from './user.service';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation(() => UserModel)
  async createUser(@Args('input') input: CreateUserInput) {
    try {
      const user = await this.userService.createUser(input);
      return user;
    } catch (error: any) {
      if (error.keyValue['username']) {
        throw new BadRequestException('Username already exists');
      } else if (error.keyValue['email']) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new BadRequestException('Something went wrong');
      }
    }
  }

  @Query(() => UserModel)
  async getUser(@Args('id') id: string) {
    return await this.userService.getUser({ id });
  }

  @Query(() => PaginatedUserModel)
  async getUsers(
    @Args('filter') filter: FilterUserInput
  ): Promise<PaginatedUserModel> {
    return await this.userService.getUsers(filter);
  }
}
