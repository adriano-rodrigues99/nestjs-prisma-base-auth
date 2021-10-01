import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, Prisma } from '@prisma/client';
import { UserDTO } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  public async create(
    @Body() createUserDto: Prisma.UserCreateInput,
  ): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Get()
  public async findAll(): Promise<any[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<UserDTO> {
    return await this.userService.findOne(+id);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ): Promise<UserDTO> {
    return await this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return await this.userService.remove(+id);
  }
}
