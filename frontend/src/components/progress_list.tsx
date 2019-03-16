import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import { ProgressItem, Progress } from './progress_item';

interface ProgressResponse {
  progresses: Array<Progress>;
}

const useProgress = (startPolling: boolean): ProgressResponse => {
  const [res, setResponse] = useState<ProgressResponse>({
    progresses: [],
  });
  const [inPolling, setInPolling] = useState<boolean>(startPolling);

  useEffect(() => {
    const worker = new Worker('/progress_worker.ts');
    worker.postMessage('init');
    worker.onmessage = e => {
      if (e.data === 'done') {
        setInPolling(false);
      } else {
        setResponse({ progresses: e.data });
      }
    };
    return () => {
      worker.terminate();
    };
  }, [setResponse, startPolling]);

  return res;
};

interface Props {
  startPolling: boolean;
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
