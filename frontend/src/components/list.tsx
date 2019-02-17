import * as React from 'react';

import Client from '../shared/client';
import {Item, Video} from './item';

interface ListState {
  videos : Array<Video>
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
      videos: []
    }
  }

  render() {
    const { category } = this.props.match.params;
    new Client().getList(category)
      .then(json => {
        this.setState({
          videos: json
        })
      });
    return (
      <div>
        {this.state.videos.map((video, i) => (
          <Item video={video} key={i}/>
        ))}
      </div>
    );
  }
}

export default List;

