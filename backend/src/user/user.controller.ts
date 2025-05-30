import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiResponse({ type: User })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findLoggedUser(@ConnectedUser() user) {
    return this.userService.findOne(user.id);
  }

  @Get(':id')
  @ApiResponse({ type: User })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  @ApiResponse({ type: [User] })
  findAll() {
    return this.userService.findAll();
  }

  @Patch(':id')
  @ApiResponse({ type: User })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiResponse({ type: User })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
