import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class ValidationDtoPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) =>
        this.customExceptionFactory(errors),
    });
  }

  customExceptionFactory(errors: ValidationError[]): BadRequestException {
    const formattedErrors = errors.reduce((acc, error) => {
      Object.entries(error.constraints || {}).forEach(([key, message]) => {
        acc.push(message);
      });

      return acc.concat(this.formatNestedErrors(error.children || []));
    }, []);

    return new BadRequestException({
      message: formattedErrors.length ? formattedErrors : ['Invalid request'],
      error: 'Bad Request',
      statusCode: 400,
    });
  }

  formatNestedErrors(errors: ValidationError[]): string[] {
    const formattedErrors = [];

    for (const error of errors) {
      if (error.constraints) {
        Object.values(error.constraints).forEach((constraint) => {
          formattedErrors.push(constraint);
        });
      }

      if (error.children && error.children.length) {
        formattedErrors.push(...this.formatNestedErrors(error.children));
      }
    }

    return formattedErrors;
  }
}
