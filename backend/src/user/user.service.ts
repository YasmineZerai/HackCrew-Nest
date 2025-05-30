import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GenericService } from '../common/services/generic.service';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../common/utils/error-handler.util';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly profileService: ProfileService, // inject ProfileService
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

      const hashedPassword = await this.hashPassword(createUserDto.password);

      // Create user first
      const user = await super.create({
        ...createUserDto,
        password: hashedPassword,
      });

      // Create and assign empty profile
      const profile = await this.profileService.createProfileForUser(user);
      user.profile = profile;
      await this.userRepo.save(user);

      return user;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await this.hashPassword(
          updateUserDto.password,
        );
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

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
