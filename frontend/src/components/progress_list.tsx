import * as React from 'react';
import { useState, useEffect, useRef } from 'react';

import Client from '../shared/client';
import { ProgressItem, Progress } from './progress_item';

interface ProgressResponse {
  progresses: Array<Progress>;
}

const useProgress = (): ProgressResponse => {
  const [res, setResponse] = useState<ProgressResponse>({
    progresses: [],
  });

  useEffect(() => {
    const worker = new Worker("/progress_worker.ts");
    worker.postMessage("init");
    worker.onmessage = (e) => {
      setResponse({ progresses: e.data });
    };
    return () => worker.terminate();
  }, [setResponse]);

  return res;
};

const ProgressList = () => {
  const list = useProgress();
  return (
    <>
      {list.progresses.map(progress => (
        <ProgressItem {...progress} key={progress.title} />
      ))}
    </>
  );
};

export default ProgressList;
