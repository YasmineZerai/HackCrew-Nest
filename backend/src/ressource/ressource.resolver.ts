import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { Ressource } from './entities/ressource.entity';
import { RessourcesService } from './ressource.service';

@Resolver(() => Ressource)
export class RessourceResolver {
  constructor(private readonly ressourceService: RessourcesService) {}

  @Query(() => [Ressource])
  findAllRessources(): Promise<Ressource[]> {
    return this.ressourceService.findAll();
  }

  @Query(() => Ressource)
  findOneRessource(@Args('id', { type: () => Int }) id: number) {
    return this.ressourceService.findOneRessource(id);
  }

    @Query(() => [Ressource])
  async getRessourcesByTeam(
    @Args('teamId', { type: () => Int }) teamId: number,
  ): Promise<Ressource[]> {
    return this.ressourceService.findByTeam(teamId);
  }
}
