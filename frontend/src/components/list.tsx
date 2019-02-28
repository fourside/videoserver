import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Client from '../shared/client';
import { Item, Video } from './item';
import Pager from './pager';
import Loading from './loading';
import CategorySelect from './category_select';
import useCategory from '../hooks/use_category';

interface ListResponse {
  videos?: Array<Video>;
  total: number;
}

interface RouterProps {
  match: {
    params: {
      category: string;
    };
  };
  history: Array<string>;
}

const useList = (category: string, offset: number): ListResponse => {
  const [listResponse, setListResponse] = useState<ListResponse>({
    videos: undefined,
    total: 0,
  });

  const getList = async () => {
    const json = await new Client().getList(category, offset);
    setListResponse({ videos: json['videos'], total: json['total'] });
  };
  useEffect(() => {
    getList();
  }, [category, offset]);

  return listResponse;
};

const List = (props: RouterProps) => {
  const [current, setCurrent] = useState<number>(0);

  const category = useCategory();
  const listRes = useList(props.match.params.category, current);

  const handleCategorySelect = (e: any): void => {
    setCurrent(0);
    props.history.push(`/list/${e.target.value}`);
  };

  if (listRes.videos === undefined) {
    return <Loading />;
  }
  if (listRes.videos.length === 0) {
    return <ZeroHit />;
  }

  return (
    <>
      <SubNav>
        <Pager
          total={listRes.total}
          currentPage={current}
          onChange={i => setCurrent(i)}
        />
        <SideSelect>
          <CategorySelect
            current={props.match.params.category}
            onChange={e => handleCategorySelect(e)}
            categories={category}
          />
        </SideSelect>
      </SubNav>

      {listRes.videos.map(video => (
        <Item video={video} key={video.title} />
      ))}

      <Pager
        total={listRes.total}
        currentPage={current}
        onChange={i => setCurrent(i)}
      />
    </>
  );
};

export default List;

const ZeroHit = () => (
  <div className="zero-hit notification is-info">
    <p>There is no video. Add a video in the form.</p>
  </div>
);

const SubNav = styled.nav`
  display: flex;
`;
const SideSelect = styled.div`
  margin-left: auto;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;
