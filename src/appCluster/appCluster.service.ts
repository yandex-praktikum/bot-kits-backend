import * as _cluster from 'cluster';
const cluster = _cluster as unknown as _cluster.Cluster;
import * as os from 'os';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppClusterService {
  /**
   * Создает кластеры Node.js для более эффективного использования многоядерных систем.
   *
   * @param callback Функция, которая будет вызываться в каждом кластере.
   * @param numCores Желаемое количество ядер для использования. Если не задано, используются все доступные ядра.
   */
  static clusterize(callback: () => void, numCores?: number): void {
    // Если задано использовать только одно ядро или параметр не указан, запускаем callback в текущем процессе.
    if (numCores === 1 || numCores <= 0 || !numCores) {
      console.log(`Запуск в однопоточном режиме на ${process.pid}`);
      callback();
      return;
    }
    // Определяем количество ядер (по умолчанию используем все доступные ядра системы)
    const numCPUs = numCores > os.cpus().length ? os.cpus().length : numCores;

    // Проверяем, является ли текущий процесс главным (первичным).
    if (cluster.isPrimary) {
      // Выводим сообщение о запуске главного сервера.
      console.log(`Главный сервер запущен на ${process.pid}`);

      // Создаем форки равные количеству ядер.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      // Слушаем событие 'exit', чтобы в случае падения одного из кластеров перезапустить его.
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} упал. Перезапуск.`);
        cluster.fork();
      });
    } else {
      // В этой части кода мы находимся в одном из кластеров.
      // Выводим сообщение о запуске кластерного сервера.
      console.log(`Кластерный сервер запущен на ${process.pid}`);

      // Вызываем переданную функцию callback.
      callback();
    }
  }
}
