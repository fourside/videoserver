import Client from './shared/client';

const client = new Client();

const worker: Worker = self as any;
const polling = async () => {
  const progresses = await client.getProgress();
  if (progresses.length > 0) {
    worker.postMessage(progresses);
    setTimeout(polling, 4000);
  } else {
    worker.postMessage('done');
  }
};

self.onmessage = () => {
  polling();
};
