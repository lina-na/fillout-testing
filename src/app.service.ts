import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios, { AxiosError } from 'axios';
import { serverConfig } from 'config/config';
import {
  FilterClauseType,
  APIQuestionType,
  APIResponseType,
} from './types/type';
import { GetReqDto } from './dto/get.dto';
import {
  booleanTypes,
  dateTypes,
  numberTypes,
  stringTypes,
} from './constants/constants';

@Injectable()
export class AppService {
  applyFilter(filter: FilterClauseType, question: APIQuestionType) {
    const transformedValues = (() => {
      if (numberTypes.includes(question.type))
        return {
          filter: Number(filter.value),
          input: Number(question.value),
        };
      if (stringTypes.includes(question.type))
        return {
          filter: filter.value,
          input: question.value,
        };
      if (dateTypes.includes(question.type))
        return {
          filter: new Date(filter.value),
          input: new Date(question.value),
        };
      if (booleanTypes.includes(question.type))
        return {
          filter: JSON.parse(filter.value),
          input: JSON.parse(question.value),
        };
    })();

    const conditions = {
      equals: ({ filter, input }) => input === filter,
      does_not_equal: ({ filter, input }) => input !== filter,
      greater_than: ({ filter, input }) => input > filter,
      less_than: ({ filter, input }) => input < filter,
    };

    return conditions[filter.condition](transformedValues);
  }

  async getData(query: GetReqDto): Promise<APIResponseType> {
    try {
      const { data } = await axios.get<APIResponseType>(
        `${serverConfig.request_url}/submissions`,
        {
          headers: {
            Authorization: `Bearer ${serverConfig.api_key}`,
          },
          params: query,
        },
      );

      if (!query.filters) {
        return data;
      }

      const filteredResponses = data.responses.filter((response) => {
        return query.filters.every((filter) => {
          const question = response.questions.find((q) => q.id === filter.id);
          if (!question) return false;

          return this.applyFilter(filter, question);
        });
      });

      return {
        responses: filteredResponses,
        totalResponses: filteredResponses.length,
        pageCount: Math.ceil(filteredResponses.length / (query.limit || 150)),
      };
    } catch (error) {
      console.log(error.message);
      if (error instanceof AxiosError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException();
    }
  }
}
