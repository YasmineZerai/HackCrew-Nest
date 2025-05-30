import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Repository,
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
} from 'typeorm';
import { PublicEntity } from '@src/common/entities/public.entity';
import { ErrorHandler } from '../utils/error-handler.util';

@Injectable()
export class GenericService<T extends ObjectLiteral & PublicEntity> {
  constructor(
    protected readonly repository: Repository<T>,
    protected readonly relations: string[] = [],
    protected readonly resourceName: string = 'Resource',
  ) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async findOne(id: number): Promise<T> {
    try {
      const entity = await this.repository.findOne({
        where: { id } as FindOptionsWhere<T>,
        relations: this.relations,
      });

      if (!entity) {
        ErrorHandler.notFound(this.resourceName, id);
      }

      return entity;
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find({ relations: this.relations });
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async update(id: number, updateDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = await this.findOne(id);
      Object.assign(entity, updateDto);
      return await this.repository.save(entity);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  async remove(id: number): Promise<T> {
    try {
      const entity = await this.findOne(id);
      return await this.repository.remove(entity);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
  async findByCriteria(criteria:any){
    const entity=this.repository.find(criteria)
    if(!entity){
      throw new NotFoundException('entity not found')
    }
    return entity
  }
}
