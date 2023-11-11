import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { sanitize } from 'class-sanitizer';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SanitizePipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata): any {
    const { metatype } = metadata;

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    sanitize(object);

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }
}
