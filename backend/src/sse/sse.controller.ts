import { Body, Controller, Param, Post, Sse, UseGuards } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@src/auth/guards/jwt.guard';
import { ConnectedUser } from '@src/auth/decorators/user.decorator';
import { use } from 'passport';

@Controller('sse')
@UseGuards(JwtAuthGuard)
export class SseController {
  constructor(private readonly sseService: SseService) {}
  @Sse()
  getEvents(
    @ConnectedUser() user: any,
  ): Observable<{ data: any; event?: string }> {
    return this.sseService.connect(Number(user.id));
  }
  @Post('notify-user')
  notifyUser(@Body() body: { userId: number; data: any; event: string }) {
    this.sseService.notifyUser(body.userId, body.data, body.event);
  }
}
