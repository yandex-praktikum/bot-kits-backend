import * as _cluster from 'cluster';
const cluster = _cluster as unknown as _cluster.Cluster;
import * as os from 'os';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppClusterService {
  static clusterize(callback: () => void, numCores?: number): void {
    const numCPUs = numCores || os.cpus().length;

    if (cluster.isPrimary) {
      console.log(`Главный сервер запущен на ${process.pid}`);
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} упал. Перезапуск.`);
        cluster.fork();
      });
    } else {
      console.log(`Кластерный сервер запущен на ${process.pid}`);
      callback();
    }
  }
}
