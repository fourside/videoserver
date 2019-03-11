import * as React from 'react';
import { useState, useEffect } from 'react';

import Client from '../shared/client';
import { ProgressItem, Progress } from './progress_item';

interface ProgressResponse {
  progresses: Array<Progress>;
}

const useProgress = (): ProgressResponse => {
  const [res, setResponse] = useState<ProgressResponse>({
    progresses: [],
  });

  const getProgress = async () => {
    const progresses = await new Client().getProgress();
    setResponse({ progresses: progresses });
  };
  useEffect(() => {
    getProgress();
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
