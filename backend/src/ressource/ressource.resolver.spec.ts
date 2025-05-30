import { Test, TestingModule } from '@nestjs/testing';
import { RessourceResolver } from './ressource.resolver';

describe('RessourceResolver', () => {
  let resolver: RessourceResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RessourceResolver],
    }).compile();

    resolver = module.get<RessourceResolver>(RessourceResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
