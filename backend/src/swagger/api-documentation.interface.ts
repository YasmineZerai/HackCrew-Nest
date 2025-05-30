import { INestApplication } from "@nestjs/common";

export interface IApiDocumentation {
  setup(app: INestApplication, appName?: string): void;
}