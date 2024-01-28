import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsNotNaNConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    return !isNaN(value);
  }

  defaultMessage() {
    return 'Value must not be NaN';
  }
}

export function IsNotNaN(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotNaN',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotNaNConstraint,
    });
  };
}
