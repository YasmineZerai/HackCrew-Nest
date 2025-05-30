import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReadStream, existsSync, promises as fs } from 'fs';
import { Repository } from 'typeorm';
import { Ressource } from './entities/ressource.entity';
import { CreateRessourceDto } from './dto/create-ressource.dto';
import { UpdateRessourceDto } from './dto/update-ressource.dto';
import { join } from 'path';
import { GenericService } from '@src/common/services/generic.service';
import { NotificationService } from '@src/notification/notification.service';
import { TeamService } from '@src/team/team.service';
import { EventType } from '@src/enum/event-type.enum';
import { UserService } from '@src/user/user.service';

@Injectable()
export class RessourcesService extends GenericService<Ressource>  {
  constructor(
    @InjectRepository(Ressource)
    private readonly ressourceRepository: Repository<Ressource>,
    private readonly notificationService : NotificationService,
    private readonly teamService : TeamService,
    private readonly userService : UserService
  ) {
        super(ressourceRepository)

  }

  async createRessource(
    createRessourceDto: CreateRessourceDto,
    userId:number,
    teamId:number,
    file?: Express.Multer.File,
    
  ) {
    const ressource = this.ressourceRepository.create(createRessourceDto);
    const user = await this.userService.findOne(userId)
    const team = await this.teamService.findOne(teamId)
    if(!user || !team){throw new NotFoundException()}
    ressource.user=user;
    ressource.team=team;

    if (file) {
      ressource.path = file.path;
      ressource.link = '';
    } else if (createRessourceDto.link) {
      ressource.path = '';
    }

    return this.ressourceRepository.save(ressource);
  }

  // async findAll() {
  //   return this.ressourceRepository.find();
  // }

  // async findOne(id: number) {
  //   const ressource = await this.ressourceRepository.findOne({ where: { id } });
  //   if (!ressource) {
  //     throw new NotFoundException(`Ressource with ID ${id} not found`);
  //   }
  //   return ressource;
  // }

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

  async notifyTeamMembers(teamId:number,userId:number){
    const team = await this.teamService.findOne(teamId)
    const message = `Ressource  is created.`;
    const event = EventType.NEW_RESSOURCE
    return  this.notificationService.notifyReceivers(team,userId,message,message,event)

  }
    async findAll(): Promise<Ressource[]> {
    return this.ressourceRepository.find({
      relations: ['user', 'team'],
    });
  }

    async findOneRessource(id: number){
    return this.ressourceRepository.findOne({
      where: { id },
      relations: ['user', 'team'],
    });
  }
    async findByTeam(teamId: number): Promise<Ressource[]> {
    return this.ressourceRepository.find({
      where: { team: { id: teamId } },
      relations: ['team', 'user'],
    });
  }

}
