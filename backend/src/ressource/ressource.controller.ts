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
  UseInterceptors,
} from '@nestjs/common';
import { RessourcesService } from './ressource.service';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('ressources')
export class RessourcesController {
  constructor(private readonly ressourcesService: RessourcesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() createRessourceDto: CreateRessourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ressourcesService.create(createRessourceDto, file);
  }

  @Get()
  findAll() {
    return this.ressourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ressourcesService.findOne(+id);
  }

  @Get(':id/file')
  async getFile(@Param('id') id: string) {
    const fileStream = await this.ressourcesService.getFileStream(+id);
    return new StreamableFile(fileStream);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateRessourceDto: UpdateRessourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.ressourcesService.update(+id, updateRessourceDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ressourcesService.remove(+id);
  }
}
