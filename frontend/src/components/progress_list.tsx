import * as React from 'react';
import { useState, useEffect } from 'react';

import { ProgressItem, Progress } from './progress_item';

interface ProgressResponse {
  progresses: Array<Progress>;
}

const worker = new Worker('/progress_worker.ts');

const useProgress = (startPolling: Date): ProgressResponse => {
  const [res, setResponse] = useState<ProgressResponse>({
    progresses: [],
  });

  useEffect(() => {
    worker.postMessage('init');
    worker.onmessage = e => {
      if (e.data === 'done') {
      } else {
        setResponse({ progresses: e.data });
      }
    };
    return () => {};
  }, [setResponse, startPolling]);

  return res;
};

interface Props {
  startPolling: Date;
}
const ProgressList = ({ startPolling }: Props) => {
  const list = useProgress(startPolling);
  return (
    <>
      {list.progresses.map(progress => (
        <ProgressItem {...progress} key={progress.title} />
      ))}
    </>
  );
};

export default ProgressList;
