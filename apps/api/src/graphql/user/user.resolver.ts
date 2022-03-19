import { E, GqlAtGuard } from '@common';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '@schemas';
import { AccessGuard, UseAbility } from 'nest-casl';
import { Roles } from 'src/common/decorators/roles.decorator';
import { GqlRolesGuard } from 'src/common/guards/gql-roles.guard';
import { CreateUserInput, FilterUserInput } from './dto/user.input';
import { PaginatedUserModel, UserModel } from './dto/user.model';
import { UserHook } from './user.hook';
import { UserService } from './user.service';

@UseGuards(GqlAtGuard)
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
  // @UseGuards(GqlRolesGuard, GqlAbilitiesGuard)
  // @CheckAbilities(new ReadUserAbilityHandler())
  @UseGuards(GqlRolesGuard, AccessGuard)
  @UseGuards(AccessGuard)
  @Roles(E.RoleEnum.ADMIN, E.RoleEnum.USER)
  @UseAbility(E.ActionEnum.READ, User, UserHook)
  async getUser(@Args('id') id: string) {
    const user = await this.userService.getUser({ _id: id });
    return user;
  }

  @Query(() => PaginatedUserModel)
  async getUsers(
    @Args('filter') filter: FilterUserInput
  ): Promise<PaginatedUserModel> {
    return await this.userService.getUsers(filter);
  }
}
