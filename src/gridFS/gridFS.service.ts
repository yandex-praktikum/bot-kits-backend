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
import * as path from 'node:path';
import * as fs from 'node:fs';
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

  getBucket() {
    return this.filesBucket;
  }
  //add gridfs module
  async filesUpload(files: Array<Express.Multer.File>) {
    const bucket = this.getBucket();
    const outputFolder = path.join(process.cwd(), 'attachments');
    console.log(files.length);
    if (files.length === 0) {
      throw new BadRequestException('no files provided');
    }
    const filesIds: string[] = await Promise.all(
      files.map(async (file) => {
        try {
          if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder);
          }
          console.log(file);
          if (!isAllowedExtension(file.originalname)) {
            throw new UnsupportedMediaTypeException(
              `${file.originalname} has restricted extension`,
            );
          }
          const filepath = path.join(outputFolder, file.originalname);
          await fs.promises.writeFile(filepath, file.buffer);
          const uploadPromise = new Promise<ObjectId>((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.originalname, {
              metadata: { mime: file.mimetype },
            });

            const readStream = fs.createReadStream(filepath);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', () => {
              console.log(`${uploadStream.id} id of file`);
              resolve(uploadStream.id);
            });
            uploadStream.on('error', (e) => {
              reject(e);
            });
          });

          const fileId = await uploadPromise;
          //todo: надо подусать в какой момент перемещать файл во временную директорию для очистки по расписанию
          return fileId.toString();
        } catch (error) {
          console.log('OTLOVILO');
          return error;
        }
      }),
    );
    return filesIds;
  }

  async filesDownload(id: string): Promise<StreamableFile> {
    const bucket = this.getBucket();
    const fileMeta = bucket.find({ _id: new ObjectId(id) });
    const outputFolder = path.join(process.cwd(), 'downloaded');
    let meta;
    for await (const doc of fileMeta) {
      meta = doc;
    }
    console.log(meta);
    if (meta === undefined) {
      throw new NotFoundException('cant find picture with this id', {
        cause: new Error(),
        description: 'Wrong ObjectId',
      });
    }
    const downloadStream = bucket.openDownloadStream(new ObjectId(id));
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }
    const filePath = path.join(outputFolder, meta.filename);
    const writeStream = fs.createWriteStream(filePath);

    // Создаем Promise для отслеживания завершения операции скачивания
    const downloadPromise = new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Подписываемся на событие завершения скачивания
    downloadStream.pipe(writeStream);

    // Дожидаемся завершения скачивания
    await downloadPromise;

    // После завершения скачивания, создаем поток для чтения файла
    const fileReadStream = fs.createReadStream(filePath);
    return new StreamableFile(fileReadStream);
  }

  async filesDelete(id: string) {
    const bucket = this.getBucket();
    try {
      await bucket.delete(new ObjectId(id));
      return { message: 'successfully deleted' };
    } catch (e) {
      return e;
    }
  }
}
