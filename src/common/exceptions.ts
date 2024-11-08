import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const EmailAlreadyUsedException = () =>
  new ConflictException('email already in use, please recover account');

export const EmailAlreadyExistsException = () =>
  new ConflictException('email already exists');

export const VerifiedEmailAlreadyExistsException = () =>
  new ConflictException('verified email already exists');

export const EmailTokenNotFoundException = () =>
  new NotFoundException('token not found');

export const InvalidEmailTokenException = () =>
  new ForbiddenException('email token is invalid or has expired');

export const UserNotFoundException = () =>
  new NotFoundException('user not found');

export const EmailNotVerifiedException = () =>
  new ForbiddenException('email not verified');

export const EmailAlreadyVerifiedException = () =>
  new ForbiddenException('email already verified');

export const PasswordAlreadySetException = () =>
  new NotAcceptableException('password already set for user');

export const PasswordNotSetException = () =>
  new ForbiddenException('password not set for user');

export const LoginCredentialsException = () =>
  new UnauthorizedException('login credentials are incorrect');

export const IncorrectPasswordException = () =>
  new UnauthorizedException('password is incorrect');

export const TxPinIncorrectException = () =>
  new ForbiddenException('tx pin incorrect');

export const EmptyFileException = () => new BadRequestException('empty file');

export const NotAuthorizedToPerfromActionException = () =>
  new ForbiddenException('not authorized to perform action');

export const UnableToUploadFileException = () =>
  new InternalServerErrorException('unable to upload file(s)');

export const UnableToCreateAccountException = () =>
  new InternalServerErrorException('unable to create account');

export const DataAlreadyExistsException = () =>
  new ForbiddenException('data already exists');

export const UsernameAlreadyExistsException = () =>
  new ForbiddenException('username already exists');

export const AdminNotFoundException = () =>
  new NotFoundException('admin not found');

export const ProductNotFoundException = () =>
  new NotFoundException('product not found');
