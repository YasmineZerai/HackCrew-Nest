import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}
  @Sse(':id')
  getEvents(
    @Param('id') id: number,
  ): Observable<{ data: any; event?: string }> {
    return this.sseService.connect(Number(id));
  }
  @Post('notify-user')
  notifyUser(@Body() body : {userId:number,data:any,event:string}) {
    this.sseService.notifyUser(body.userId, body.data, body.event);
  }
}
