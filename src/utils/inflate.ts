import { v4 } from 'uuid';
import type { InflateWorkerMessage, InflateWorkerResponse } from '../workers/inflate';

import InflateWorker from '../workers/inflate?worker';
const worker = new InflateWorker();

export const inflateWorker = (buffer: Uint8Array) => new Promise<Uint8Array>((resolve) => {
   const id = v4();

   worker.postMessage({
      id,
      buffer,
   } satisfies InflateWorkerMessage, [buffer.buffer]);

   worker.addEventListener('message', (message: MessageEvent<InflateWorkerResponse>) => {
      const { data } = message;
      if (data.id !== id) return;
      resolve(data.buffer);
   })
});