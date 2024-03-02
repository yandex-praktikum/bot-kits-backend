import { ApiProperty } from '@nestjs/swagger';

//-- Определение типа для разных типов полей --//
type TFieldType =
  | 'string' //-- Строка --//
  | 'number' //-- Число --//
  | 'boolean' //-- Булевое значение --//
  | 'object' //-- Объект --//
  | 'array' //-- Массив --//
  | (() => any); //-- Функция, возвращающая любое значение --//

// Определение интерфейса для описания поля
export interface IFieldDescription {
  key: string; //-- Ключ поля описания в Swagger --//
  example: any; //-- Пример значения поля --//
  type: TFieldType; //-- Тип поля --//
  description?: string; //-- Необязательное описание поля --//
  required?: boolean; //-- Необязательный флаг, указывающий на обязательность поля --//
}

//-- Функция для создания описания поля --//
export function createField(
  key: string, //-- Ключ поля --//
  example: any, //-- Пример значения поля --//
  type: TFieldType = 'string', //-- Тип поля со значением по умолчанию 'string' --//
  description?: string, //-- Необязательное описание поля --//
  required = false, //-- Необязательный флаг, указывающий на обязательность поля со значением по умолчанию false --//
): IFieldDescription {
  //-- Возвращаем объект с описанием поля --//
  return { key, example, type, description, required };
}

//-- Функция для создания описания вложенного объекта --//
export function createNestedObject(
  fields: IFieldDescription[], //-- Cписок полей вложенного объекта --//
): IFieldDescription {
  const exampleObj: Record<string, unknown> = {}; //-- Cоздаем пустой объект для примеров значений полей --//
  fields.forEach((field) => {
    //-- Для каждого поля добавляем в объект пример значения поля --//
    exampleObj[field.key] = field.example;
  });

  //-- Возвращаем описание вложенного объекта --//
  return {
    key: '', //-- Ключ будет установлен в родительском объекте --//
    example: exampleObj, //-- Пример значения - объект с примерами значений полей --//
    type: 'object', //-- Тип поля - объект --//
  };
}

//-- Класс для создания описаний API свойств --//
export class ApiPropertyFactory {
  //-- Конструктор класса принимает список полей --//
  constructor(private fields: IFieldDescription[]) {}

  //-- Статический метод для создания класса на основе описания полей --//
  private static createClassFromDescription(
    description: IFieldDescription[], //-- Описание полей --//
  ): any {
    const TempClass = class {}; //-- Создаем временный пустой класс --//

    for (const field of description) {
      //-- Для каждого поля из описания создаем объект с опциями для декоратора --//
      const options = {
        example: field.example,
        type: field.type,
        description: field.description,
        required: field.required,
      };

      //-- Если поле является объектом и у него есть примеры значений --//
      if (field.type === 'object' && Array.isArray(field.example)) {
        //-- Создаем динамический класс для вложенного объекта --//
        const NestedClass = this.createClassFromDescription(field.example);
        options.type = () => NestedClass; //-- Указываем этот класс как тип для поля --//
        options.example = undefined; //-- Убираем пример, так как он теперь представлен классом --//
      }

      //-- Применяем декоратор ApiProperty к временному классу --//
      ApiProperty(options)(TempClass.prototype, field.key);
    }

    //-- Возвращаем созданный класс --//
    return TempClass;
  }

  //-- Метод для генерации класса на основе списка полей --//
  generate(name) {
    const uniqueClassName = name; //-- Создаем уникальное имя для класса --//
    //-- Создаем класс на основе списка полей --//
    const GeneratedClass = ApiPropertyFactory.createClassFromDescription(
      this.fields,
    );

    //-- Назначаем классу уникальное имя --//
    Object.defineProperty(GeneratedClass, 'name', {
      value: uniqueClassName,
    });

    //-- Возвращаем сгенерированный класс --//
    return GeneratedClass;
  }
}
