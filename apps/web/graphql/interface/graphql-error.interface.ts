export interface GraphQLError {
  message: string;
  extensions: GraphQLErrorExtensions;
}

export interface GraphQLErrorExtensions {
  code: number;
  response: GraphQLErrorExtensionsResponse;
}

export interface GraphQLErrorExtensionsResponse {
  statusCode: number;
  message: string;
  error: string;
}
