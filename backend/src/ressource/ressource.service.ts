import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, existsSync, promises as fs } from 'fs';
import { Repository } from 'typeorm';
import { Ressource } from './entities/ressource.entity';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { join } from 'path';
import { GenericService } from '@src/common/services/generic.service';

@Injectable()
export class RessourcesService extends GenericService<Ressource> {
  constructor(
    @InjectRepository(Ressource)
    private readonly ressourceRepository: Repository<Ressource>,
  ) {
    super(ressourceRepository);
  }

  async create(
    createRessourceDto: CreateRessourceDto,
    file?: Express.Multer.File,
  ) {
    const ressource = this.ressourceRepository.create(createRessourceDto);

    if (file) {
      ressource.path = file.path;
      ressource.link = '';
    } else if (createRessourceDto.link) {
      ressource.path = '';
    }

    return this.ressourceRepository.save(ressource);
  }

  async update(
    id: number,
    updateRessourceDto: UpdateRessourceDto,
    file?: Express.Multer.File,
  ) {
    const ressource = await this.findOne(id);

    if (file) {
      if (ressource.path) {
        try {
          await fs.unlink(join(process.cwd(), ressource.path));
        } catch (err) {
          console.error('Failed to delete old file:', err);
        }
      }
      ressource.path = file.path;
      ressource.link = '';
    } else if (updateRessourceDto.link) {
      if (ressource.path) {
        try {
          await fs.unlink(join(process.cwd(), ressource.path));
        } catch (err) {
          console.error('Failed to delete old file:', err);
        }
      }
      ressource.path = '';
      ressource.link = updateRessourceDto.link;
    }

    Object.assign(ressource, updateRessourceDto);
    return this.ressourceRepository.save(ressource);
  }

  async remove(id: number) {
    const ressource = await this.findOne(id);

    if (ressource.path) {
      try {
        await fs.unlink(join(process.cwd(), ressource.path));
      } catch (err) {
        console.error('Failed to delete file:', err);
      }
    }

    return this.ressourceRepository.remove(ressource);
  }

  async getFileStream(id: number) {
    const ressource = await this.ressourceRepository.findOne({ where: { id } });
    if (!ressource) {
      throw new NotFoundException('Resource not found');
    }

    if (!ressource.path) {
      throw new NotFoundException('No file associated with this resource');
    }

    const filePath = join(process.cwd(), ressource.path);
    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found on server');
    }

    return createReadStream(filePath);
  }
}
