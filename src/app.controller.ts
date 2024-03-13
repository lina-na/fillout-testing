import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UsePipes,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { serverConfig } from 'config/config';
import { GetReqDto } from './dto/get.dto';
import { JsonParsePipe } from './pipes/get.pipe';

@Controller(`/${serverConfig.form_id}/filteredResponses`)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePipes(new JsonParsePipe())
  async getData(
    @Query()
    query: GetReqDto,
    @Res() res: Response,
  ) {
    const data = await this.appService.getData(query);
    return res.status(HttpStatus.OK).send(data);
  }
}
