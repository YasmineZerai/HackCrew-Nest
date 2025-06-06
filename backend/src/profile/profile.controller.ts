import { Controller, Get, Post, Body, Patch, UseGuards, UploadedFile, UseInterceptors, Res, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { User } from '@src/user/entities/user.entity';
import { ProfilePictureUploadInterceptor } from './profile-picture-upload.interceptor';
import { Response } from 'express';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  async create(@ConnectedUser() user: User, @Body() createProfileDto: CreateProfileDto) {
    const profile = await this.profileService.createProfile(user, createProfileDto);
    return {
      success: true,
      message: 'Profile created successfully',
      payload: { profile },
    };
  }

  @Get()
  async getProfile(@ConnectedUser() user: User) {
    const profile = await this.profileService.getProfile(user.id);
    return {
      success: true,
      message: 'Profile retrieved successfully',
      payload: { profile },
    };
  }

  @Patch()
  async update(
    @ConnectedUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.profileService.updateProfile(user.id, updateProfileDto);
    return {
      success: true,
      message: 'Profile updated successfully',
      payload: { profile },
    };
  }

  @Post('upload-picture')
  @UseInterceptors(ProfilePictureUploadInterceptor)
  async uploadProfilePicture(
    @ConnectedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Save file path to profile entity
    const profile = await this.profileService.updateProfile(user.id, { picture: file?.path });
    return {
      success: true,
      message: 'Profile picture uploaded successfully',
      payload: { profile },
    };
  }

  @Get('picture/:picturePath')
  async getProfilePicture(@Param('picturePath') picturePath: string, @Res() res: Response) {
    const filePath = `uploads/profile-pictures/${picturePath}`;
    return res.sendFile(filePath, { root: './' });
  }

  @Get('picture')
  async getOwnProfilePicture(@ConnectedUser() user: User, @Res() res: Response) {
    const profile = await this.profileService.getProfile(user.id);
    if (!profile || !profile.picture) {
      return res.status(404).json({ success: false, message: 'Profile picture not found' });
    }
    // Extract just the filename in case the path is stored
    const picturePath = profile.picture.replace(/^.*[\\\/]/, '');
    const filePath = `uploads/profile-pictures/${picturePath}`;
    return res.sendFile(filePath, { root: './' });
  }
}