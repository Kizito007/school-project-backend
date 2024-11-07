import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
export const ResponseMessage = (message: string) =>
  SetMetadata('responseMessage', message);
export const RawResponse = () => SetMetadata('rawResponse', true);
