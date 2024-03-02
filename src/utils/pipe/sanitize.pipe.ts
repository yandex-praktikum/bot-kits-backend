import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { sanitize } from 'class-sanitizer';
import { plainToClass } from 'class-transformer';

//-- Класс-пайп для санитизации (очистки) входных данных в NestJS приложении --//
@Injectable()
export class SanitizePipe implements PipeTransform<any> {
  //-- Метод transform автоматически вызывается NestJS для обработки данных перед их передачей в методы контроллера --//
  transform(value: any, metadata: ArgumentMetadata): any {
    //-- Извлекаем метатип аргумента для проверки, нужно ли применять санитизацию --//
    const { metatype } = metadata;

    //-- Если метатип отсутствует или не требует валидации, возвращаем исходное значение --//
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    //-- Преобразуем исходные данные в экземпляр класса для последующей санитизации --//
    const object = plainToClass(metatype, value);
    //-- Применяем санитизацию к объекту --//
    sanitize(object);

    //-- Возвращаем обработанный объект --//
    return object;
  }

  //-- Вспомогательный метод для проверки, требуется ли валидация для данного типа данных --//
  private toValidate(metatype: any): boolean {
    //-- Определяем список типов данных, которые не требуют санитизации --//
    const types: any[] = [String, Boolean, Number, Array, Object];
    //-- Возвращаем true, если тип данных не входит в список исключений, т.е. требует санитизации --//
    return !types.find((type) => metatype === type);
  }
}
