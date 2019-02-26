import { useState, useEffect } from 'react';
import Client from '../shared/client';

const client = new Client();

const useCategory = () => {
  const [category, setCategory] = useState<Array<string>>([""]);

  const getCategory = async () => {
    const json = await client.getCategory();
    setCategory(json);
  }

  useEffect(() => {
    getCategory()
  }, [])

  return category;
};

export default useCategory;
