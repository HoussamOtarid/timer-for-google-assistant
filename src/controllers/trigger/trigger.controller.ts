import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TriggerDto } from 'src/validation';
import { ConfigService } from '@nestjs/config';
import { TriggerService } from 'src/services/trigger';

@Controller('trigger')
export class TriggerController {

  constructor(
    private readonly configService: ConfigService,
    private readonly triggerService: TriggerService,
  ) { }

  @Post()
  trigger(@Body() body: TriggerDto) {
    this.validateKey(body.key);
    this.triggerService.trigger(body.deviceName, body.durationInMinutes);
    return true;
  }

  private validateKey(key: string) {
    if (key !== this.configService.get<string>('SECURITY_KEY')) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: this.configService.get<string>('SECURITY_KEY'),
      }, HttpStatus.FORBIDDEN);
    }
  }

}
