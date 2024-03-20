import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { GridFSBucket } from 'mongodb';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import { isAllowedExtension } from 'src/types/allowedFileExtensions';

@Injectable()
export class FilesBucketService {
  private filesBucket: GridFSBucket;

  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {
    this.filesBucket = new GridFSBucket(this.connection.db, {
      bucketName: 'Bucket',
    });
  }

  private getBucket() {
    return this.filesBucket;
  }

  //-- Функция для загрузки файлов в хранилище и возврата их идентификаторов --//
  async filesUpload(files: Array<Express.Multer.File>) {
    //-- Получаем экземпляр бакета для работы с файловым хранилищем --//
    const bucket = this.getBucket();

    //-- Определяем путь к папке для временного хранения файлов --//
    const outputFolder = path.join(__dirname, 'attachments');

    //-- Проверяем, были ли предоставлены файлы для загрузки --//
    if (files.length === 0) {
      throw new BadRequestException('no files provided');
    }

    //-- Асинхронно обрабатываем массив файлов, загружая их и получая их идентификаторы с типом файла--//
    const filesIds: Record<string, string>[] = await Promise.all(
      files.map(async (file) => {
        try {
          //-- Создаем папку для файлов, если она не существует --//
          if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
          }

          //-- Проверяем расширение файла на допустимость --//
          if (!isAllowedExtension(file.originalname)) {
            throw new UnsupportedMediaTypeException(
              `${file.originalname} has restricted extension`,
            );
          }

          //-- Формируем путь к файлу в папке для временного хранения --//
          const filepath = path.join(outputFolder, file.originalname);

          //-- Записываем файл в файловую систему --//
          await fs.promises.writeFile(filepath, file.buffer);

          //-- Создаем промис для загрузки файла в хранилище --//
          const uploadPromise = new Promise<ObjectId>((resolve, reject) => {
            //-- Открываем поток для загрузки файла --//
            const uploadStream = bucket.openUploadStream(file.originalname, {
              metadata: { mime: file.mimetype },
            });

            //-- Читаем файл из файловой системы и передаем в поток загрузки --//
            const readStream = fs.createReadStream(filepath);
            readStream.pipe(uploadStream);

            //-- По завершении загрузки возвращаем идентификатор файла --//
            uploadStream.on('finish', () => {
              resolve(uploadStream.id);
            });

            //-- Обрабатываем возможные ошибки при загрузке --//
            uploadStream.on('error', (e) => {
              reject(e);
            });
          });

          //-- Ожидаем завершения загрузки и возвращаем идентификатор файла --//
          const fileId = await uploadPromise;

          //-- TODO: рассмотреть логику перемещения файла во временную директорию для последующей очистки --//
          return { fileId: fileId.toString(), mime: file.mimetype };
        } catch (error) {
          return error;
        }
      }),
    );

    //-- Возвращаем массив идентификаторов загруженных файлов --//
    return filesIds;
  }

  //-- Функция для скачивания файла по идентификатору и возврата его в виде потока --//
  async filesDownload(id: string): Promise<StreamableFile> {
    //-- Получаем экземпляр бакета для работы с файловым хранилищем --//
    const bucket = this.getBucket();
    //-- Ищем метаданные файла в хранилище по идентификатору --//
    const fileMeta = bucket.find({ _id: new ObjectId(id) });
    //-- Определяем путь к папке для сохранения скачанных файлов --//
    const outputFolder = path.join(__dirname, 'downloaded');
    let meta;
    //-- Перебираем результаты запроса метаданных файла (ожидаем один документ) --//
    for await (const doc of fileMeta) {
      meta = doc;
    }

    //-- Проверяем, найдены ли метаданные файла. Если нет, выбрасываем исключение --//
    if (meta === undefined) {
      throw new NotFoundException('cant find picture with this id', {
        cause: new Error(),
        description: 'Wrong ObjectId',
      });
    }
    //-- Открываем поток для скачивания файла из хранилища по идентификатору --//
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    //-- Если папка для скачивания не существует, создаем ее --//
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
    //-- Формируем путь к файлу в папке для скачиванных файлов --//
    const filePath = path.join(outputFolder, meta.filename);
    //-- Создаем поток для записи файла в файловую систему --//
    const writeStream = fs.createWriteStream(filePath);

    //-- Создаем Promise для отслеживания завершения операции скачивания --//
    const downloadPromise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve); // При успешной записи файла разрешаем Promise
      writeStream.on('error', reject); // При ошибке записи отклоняем Promise
    });

    //-- Перенаправляем поток скачивания в поток записи для сохранения файла --//
    downloadStream.pipe(writeStream);

    //-- Дожидаемся завершения скачивания файла --//
    await downloadPromise;

    //-- После завершения скачивания, создаем поток для чтения файла --//
    const fileReadStream = fs.createReadStream(filePath);
    //-- Возвращаем файл в виде потока, готового к передаче клиенту --//
    return new StreamableFile(fileReadStream);
  }

  //-- Функция для удаления файла из хранилища по идентификатору --//
  async filesDelete(id: string) {
    //-- Получаем экземпляр бакета для работы с файловым хранилищем --//
    const bucket = this.getBucket();
    try {
      //-- Пытаемся удалить файл по идентификатору. Идентификатор преобразуется в ObjectId для совместимости с MongoDB --//
      await bucket.delete(new ObjectId(id));
    } catch (e) {
      //-- В случае возникновения ошибки, возвращаем ее. Это может быть полезно для отладки, но в реальном приложении лучше возвращать стандартизированный ответ об ошибке --//
      return e;
    }
  }
}
