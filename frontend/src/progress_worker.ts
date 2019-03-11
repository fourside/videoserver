import Client from './shared/client';

import { Progress } from './components/progress_item';

interface ProgressResponse {
  progresses: Array<Progress>;
}

const client = new Client();
const isNotSame = (newData, oldData) :boolean => {
  return JSON.stringify(newData) !== JSON.stringify(oldData);
};

const worker :Worker = self as any;
const polling = () => {
  let cache = {};
  const id = setInterval(async () => {
    const progresses = await client.getProgress();
    if (isNotSame(progresses, cache)) {
      cache = progresses;
      worker.postMessage(progresses);
    } else {
      clearInterval(id)
    }
  }, 4000);
};

self.onmessage = (e) => {
  polling();
}
