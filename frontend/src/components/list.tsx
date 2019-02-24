import * as React from 'react';
import styled from 'styled-components';

import Client from '../shared/client';
import {Item, Video} from './item';
import Pager from './pager';
import CategorySelect from './category_select';

interface ListState {
  videos : Array<Video>
  category: Array<string>
  currentPage: number
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

export default class List extends React.Component<RouterProps, ListState> {

  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      category: [],
      currentPage: 0,
      total: 0
    }
  }

  componentDidMount() {
    const { category } = this.props.match.params;
    const offset = this.state.currentPage;
    this.getCategory();
    this.getList(category, offset);
  }

  componentWillReceiveProps(nextProps) {
    const { category } = nextProps.match.params;
    const offset = this.state.currentPage;
    this.getList(category, offset);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.videos !== nextState.videos;
  }

  getList(category, offset) {
    new Client().getList(category, offset)
      .then(json => {
        this.setState({
          videos: json["videos"],
          total: json["total"]
        })
      });
  }

  getCategory() {
    new Client().getCategory()
      .then((json) => {
        this.setState({
          category: json
        })
      });
  }

  handleCategorySelect(e) {
    this.props.history.push(`/list/${e.target.value}`)
  }

  handlePagerClick(i) {
    this.setState({
      currentPage: i
    });
    const { category } = this.props.match.params;
    this.getList(category, i);
  }

  render() {
    return (
      <div>
        <SubNav>
          <Pager total={this.state.total} currentPage={this.state.currentPage} onChange={(i) => this.handlePagerClick(i)} />
          <SideSelect>
            <CategorySelect current={this.props.match.params.category} onChange={(e) => this.handleCategorySelect(e)} categories={this.state.category} />
          </SideSelect>
        </SubNav>
        {this.state.videos.map((video) => (
          <Item video={video} key={video.title}/>
        ))}
        <Pager total={this.state.total} currentPage={this.state.currentPage} onChange={(i) => this.handlePagerClick(i)} />
      </div>
    );
  }
}

const SubNav = styled.nav`
  display: flex;
`;
const SideSelect = styled.div`
  margin-left: auto;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;
