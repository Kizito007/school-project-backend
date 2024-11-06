import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AuthUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
