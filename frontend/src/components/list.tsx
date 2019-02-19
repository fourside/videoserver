import * as React from 'react';

import Client from '../shared/client';
import {Item, Video} from './item';
import Pager from './pager';

interface ListState {
  videos : Array<Video>
  currentPage: number
  total: number
}
interface RouterProps {
  match: {
    params: {
      category: string
    }
  }
}

class List extends React.Component<RouterProps, ListState> {

  constructor(props) {
    super(props);
    this.state = {
      videos: [],
      currentPage: 0,
      total: 0
    }
  }

  componentDidMount() {
    const { category } = this.props.match.params;
    const offset = this.state.currentPage;
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
        <Pager total={this.state.total} currentPage={this.state.currentPage} onChange={(i) => this.handlePagerClick(i)} />
        {this.state.videos.map((video) => (
          <Item video={video} key={video.title}/>
        ))}
        <Pager total={this.state.total} currentPage={this.state.currentPage} onChange={(i) => this.handlePagerClick(i)} />
      </div>
    );
  }
}

export default List;

