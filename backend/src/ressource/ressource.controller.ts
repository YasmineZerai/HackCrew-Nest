import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RessourcesService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProduces,
  ApiResponse,
} from '@nestjs/swagger';
import { Ressource } from './entities/ressource.entity';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { FileUploadInterceptor } from '@src/ressource/file-upload.interceptor';

@Controller('ressources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class RessourcesController {
  constructor(private readonly ressourcesService: RessourcesService) {}

  @Post(':teamId')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ type: Ressource })
  @UseInterceptors(FileUploadInterceptor)
  async create(
    @Body() createRessourceDto: CreateRessourceDto,
    @UploadedFile() file: Express.Multer.File,
    @ConnectedUser() user: any,
    @Param('teamId') teamId: number,
  ) {
    const newRessource = await this.ressourcesService.createRessource(
      createRessourceDto,
      user.id,
      teamId,
      file,
    );
    this.ressourcesService.notifyTeamMembers(newRessource.team.id,user.id)
    return newRessource;
  }

  @Get()
  @ApiResponse({ type: [Ressource] })
  findAll() {
    return this.ressourcesService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: Ressource })
  findOne(@Param('id') id: string) {
    return this.ressourcesService.findOne(+id);
  }

  @Get(':id/file')
  @ApiOkResponse({
    description: 'Returns the requested file',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiProduces('application/octet-stream')
  async getFile(@Param('id') id: string) {
    const fileStream = await this.ressourcesService.getFileStream(+id);
    return new StreamableFile(fileStream);
  }

  @Put(':id')
  @ApiResponse({ type: Ressource })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Form data for ressource',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Ressource title' },
        description: { type: 'string', description: 'Ressource description' },

        file: {
          type: 'string',
          format: 'binary',
          description: 'The uploaded file',
        },
      },
    },
  })
  @UseInterceptors(FileUploadInterceptor)
  update(
    @Param('id') id: string,
    @Body() updateRessourceDto: UpdateRessourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ressourcesService.update(+id, updateRessourceDto, file);
  }

  @Delete(':id')
  @ApiResponse({ type: Ressource })
  remove(@Param('id') id: string) {
    return this.ressourcesService.remove(+id);
  }
}
