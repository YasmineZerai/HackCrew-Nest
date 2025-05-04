import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericService } from '../common/services/generic.service';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../common/utils/error-handler.util';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {
    super(
      userRepo,
      [
        'profile',
        'memberships',
        'todos',
        'ressources',
        'notifications',
        'messages',
      ],
      'User',
    );
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepo.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        ErrorHandler.conflict('User with this email already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      return super.create({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
        updateUserDto.password = hashedPassword;
      }
      return super.update(id, updateUserDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepo.findOne({
        where: { email },
        relations: this.relations,
      });

      if (!user) {
        ErrorHandler.notFound('User', email);
      }

      return user;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
