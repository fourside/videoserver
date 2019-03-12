import Client from './shared/client';

const client = new Client();

const worker :Worker = self as any;
const polling = () => {
  let cache = {};
  const getProgress = async () => {
    const progresses = await client.getProgress();
    if (progresses.length > 0) {
      cache = progresses;
      worker.postMessage(progresses);
      setTimeout(getProgress, 4000);
    }
  };
  getProgress();
};

self.onmessage = (e) => {
  polling();
}
