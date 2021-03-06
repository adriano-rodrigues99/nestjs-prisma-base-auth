import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserDTO } from './dto/user.dto';
import { MailService } from '../mail/mail.service';

const getUserSelectFields = (password = false) => ({
  id: true,
  email: true,
  name: true,
  password,
});

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  public async encryptPassword(password: any): Promise<string> {
    return await hash(password, 8);
  }

  public async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const existUser = await this.findByEmail(createUserDto.email);
    if (existUser) {
      throw new BadRequestException('User already exists with this email');
    }
    const savedUser: User = await this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: await this.encryptPassword(createUserDto.password),
      },
      select: getUserSelectFields(),
    });

    this.mailService.sendCreation({
      ...savedUser,
      password: createUserDto.password,
    });
    return savedUser;
  }

  public async findAll(): Promise<UserDTO[]> {
    return await this.prismaService.user.findMany({
      select: getUserSelectFields(),
    });
  }

  public async findOne(id: number, selectPassword = false): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: {
        id,
      },
      select: getUserSelectFields(selectPassword),
    });
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
  }

  public async update(
    id: number,
    updateUserDto: Prisma.UserUpdateInput,
  ): Promise<UserDTO> {
    const user: User = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const password = updateUserDto.password
      ? await this.encryptPassword(updateUserDto.password)
      : user.password;

    return await this.prismaService.user.update({
      data: { ...user, ...updateUserDto, password },
      where: {
        id,
      },
      select: getUserSelectFields(),
    });
  }

  public async remove(id: number): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id,
      },
      select: getUserSelectFields(),
    });
  }
}
