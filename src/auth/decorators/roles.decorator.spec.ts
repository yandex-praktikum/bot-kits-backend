import { Roles } from './roles.decorator';

describe('Roles Decorator', () => {
  it('should set metadata with roles', () => {
    const roles = ['admin', 'user'];

    // Создаем декорированный класс или метод с использованием декоратора
    @Roles(...roles)
    class TestClass {}

    // Используем SetMetadata для получения установленных метаданных
    const metadata = Reflect.getMetadata('roles', TestClass);

    // Проверяем, что метаданные устанавливаются правильно
    expect(metadata).toEqual(roles);
  });
});
