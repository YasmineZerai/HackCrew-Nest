import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AlertDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    message:string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    event : string


}