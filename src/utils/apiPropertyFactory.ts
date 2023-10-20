import { ApiProperty } from '@nestjs/swagger';

// Определение типа для разных типов полей
type FieldType =
  | 'string' // строка
  | 'number' // число
  | 'boolean' // булевое значение
  | 'object' // объект
  | 'array' // массив
  | (() => any); // функция, возвращающая любое значение

// Определение интерфейса для описания поля
export interface IFieldDescription {
  key: string; // ключ поля
  example: any; // пример значения поля
  type: FieldType; // тип поля
  description?: string; // необязательное описание поля
  required?: boolean; // необязательный флаг, указывающий на обязательность поля
}

// Функция для создания описания поля
export function createField(
  key: string, // ключ поля
  example: any, // пример значения поля
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' = 'string', // тип поля со значением по умолчанию 'string'
  description?: string, // необязательное описание поля
  required = false, // необязательный флаг, указывающий на обязательность поля со значением по умолчанию false
): IFieldDescription {
  // Возвращаем объект с описанием поля
  return { key, example, type, description, required };
}

// Функция для создания описания вложенного объекта
export function createNestedObject(
  fields: IFieldDescription[], // список полей вложенного объекта
): IFieldDescription {
  const exampleObj: any = {}; // создаем пустой объект для примеров значений полей
  fields.forEach((field) => {
    // для каждого поля
    exampleObj[field.key] = field.example; // добавляем в объект пример значения поля
  });

  // Возвращаем описание вложенного объекта
  return {
    key: '', // ключ будет установлен в родительском объекте
    example: exampleObj, // пример значения - объект с примерами значений полей
    type: 'object', // тип поля - объект
  };
}

// Класс для создания описаний API свойств
export class ApiPropertyFactory {
  // Конструктор класса принимает список полей
  constructor(private fields: IFieldDescription[]) {}

  // Статический метод для создания класса на основе описания полей
  private static createClassFromDescription(
    description: IFieldDescription[], // описание полей
  ): any {
    const TempClass = class {}; // создаем временный пустой класс

    for (const field of description) {
      // для каждого поля из описания
      const options = {
        // создаем объект с опциями для декоратора
        example: field.example,
        type: field.type,
        description: field.description,
        required: field.required,
      };

      // Если поле является объектом и у него есть примеры значений
      if (field.type === 'object' && Array.isArray(field.example)) {
        // Создаем динамический класс для вложенного объекта
        const NestedClass = this.createClassFromDescription(field.example);
        options.type = () => NestedClass; // указываем этот класс как тип для поля
        options.example = undefined; // убираем пример, так как он теперь представлен классом
      }

      // Применяем декоратор ApiProperty к временному классу
      ApiProperty(options)(TempClass.prototype, field.key);
    }

    // Возвращаем созданный класс
    return TempClass;
  }

  // Метод для генерации класса на основе списка полей
  generate(name) {
    const uniqueClassName = name; // создаем уникальное имя для класса
    // Создаем класс на основе списка полей
    const GeneratedClass = ApiPropertyFactory.createClassFromDescription(
      this.fields,
    );

    // Назначаем классу уникальное имя
    Object.defineProperty(GeneratedClass, 'name', {
      value: uniqueClassName,
    });

    // Возвращаем сгенерированный класс
    return GeneratedClass;
  }
}
