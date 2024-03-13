import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { GetQueryDto } from 'src/dto/get.dto';

@Injectable()
export class JsonParsePipe implements PipeTransform {
  transform(value: GetQueryDto, metadata: ArgumentMetadata) {
    try {
      return {
        ...value,
        filters: value.filters ? JSON.parse(value.filters) : '',
      };
    } catch (error) {
      throw new BadRequestException('Invalid JSON format');
    }
  }
}
