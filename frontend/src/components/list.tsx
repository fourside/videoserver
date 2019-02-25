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

const List = (props :RouterProps) => {
  const [listRes, setListRes] = useState<ListResponse>({ videos: [], total: 0 });
  const [category, setCategory] = useState<Array<string>>([]);
  const [current, setCurrent] = useState<number>(0);

  const client = new Client();

  const getList = (category :string, offset :number) :void => {
    client.getList(category, offset)
      .then(json => {
        setListRes({videos: json["videos"], total: json["total"]});
      })
  };

  const getCategory = () :void => {
    client.getCategory()
      .then((json) => {
        setCategory(json);
      });
  }

  const handlePagerClick = (i :number) :void => {
    setCurrent(i);
    const { category } = props.match.params;
    getList(category, i);
  }

  const handleCategorySelect = (e :any) :void => {
    props.history.push(`/list/${e.target.value}`);
  }

  useEffect(() => {
    const { category } = props.match.params;
    const offset = current;
    getList(category, offset);
  }, [...listRes.videos])

  useEffect(() => {
    getCategory();
  }, [...category])

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
