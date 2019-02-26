import * as React from 'react';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

import Client from '../shared/client';
import {Item, Video} from './item';
import Pager from './pager';
import CategorySelect from './category_select';

interface ListResponse {
  videos : Array<Video>
  total: number
}

interface RouterProps {
  match: {
    params: {
      category: string
    }
  }
  history: Array<string>
}

const useList = (category :string, offset :number) :ListResponse => {
  const [listResponse, setListResponse] = useState<ListResponse>({ videos: [], total: 0 });

  useEffect(() => {
    new Client().getList(category, offset)
      .then(json => {
        setListResponse({videos: json["videos"], total: json["total"]});
    });
  }, [listResponse.videos])

  return listResponse;
};

const useCategory = () => {
  const [category, setCategory] = useState<Array<string>>([""]);

  useEffect(() => {
    new Client().getCategory()
      .then(json => {
        setCategory(json);
    });
  }, [category])

  return category;
};

const List = (props :RouterProps) => {
  const [current, setCurrent] = useState<number>(0);

  const category = useCategory();
  let listRes = useList(props.match.params.category, current);

  const handlePagerClick = (i :number) :void => {
    setCurrent(i);
    const { category } = props.match.params;
    listRes = useList(category, i);
  }

  const handleCategorySelect = (e :any) :void => {
    props.history.push(`/list/${e.target.value}`);
  }

  return (
    <>
      <SubNav>
        <Pager total={listRes.total} currentPage={current} onChange={(i) => handlePagerClick(i)} />
        <SideSelect>
          <CategorySelect 
            current={props.match.params.category}
            onChange={(e) => handleCategorySelect(e)}
            categories={category} />
        </SideSelect>
      </SubNav>

      {listRes.videos.map((video) => (
        <Item video={video} key={video.title}/>
      ))}

      <Pager total={listRes.total} currentPage={current} onChange={(i) => handlePagerClick(i)} />
    </>
  );
}

export default List;

const SubNav = styled.nav`
  display: flex;
`;
const SideSelect = styled.div`
  margin-left: auto;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;
