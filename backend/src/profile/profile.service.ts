import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { GenericService } from '@src/common/services/generic.service';
import { ErrorHandler } from '@src/common/utils/error-handler.util';
import { User } from '@src/user/entities/user.entity';

@Injectable()
export class ProfileService extends GenericService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {
    super(profileRepo, ['user'], 'Profile');
  }

  async createProfile(user: User, createProfileDto: CreateProfileDto): Promise<Profile> {
    try {
      if (user.profile) {
        ErrorHandler.conflict('User already has a profile');
      }

      const profile = this.profileRepo.create({
        ...createProfileDto,
        user,
      });

      return await this.profileRepo.save(profile);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async createProfileForUser(user: User): Promise<Profile> {
    try {
      const profile = this.profileRepo.create({
        picture: '',
        phoneNumber: '',
        location: '',
        user,
      });
      return await this.profileRepo.save(profile);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async updateProfile(userId: number, updateProfileDto: Partial<UpdateProfileDto>): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOne({
        where: { user: { id: userId } },
      });

      if (!profile) {
        ErrorHandler.notFound('Profile');
      }

      Object.assign(profile, updateProfileDto);
      return await this.profileRepo.save(profile);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async getProfile(userId: number): Promise<Profile> {
    try {
      const profile = await this.profileRepo.findOne({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      if (!profile) {
        ErrorHandler.notFound('Profile');
      }

      return profile;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}