export type FilterClauseType = {
  id: string;
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than';
  value: string;
};

export type ResponseFiltersType = FilterClauseType[];

export type APIQuestionType = {
  id: string;
  name: string;
  type: string;
  value: string;
};

type APIResponsesType = {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: APIQuestionType[];
  calculations: [];
  urlParameters: [];
  quiz?: object;
  documents: [];
};

export type APIResponseType = {
  responses: APIResponsesType[];
  totalResponses: number;
  pageCount: number;
};
