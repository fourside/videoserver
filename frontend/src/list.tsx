import * as React from 'react';

import {Client} from './client';
import {Item, Video} from './item';

interface ListState {
  videos : Array<Video>
}

class List extends React.Component<{}, ListState> {

  constructor(props) {
    super(props);
    this.state = {
      videos: []
    }
  }

  componentWillMount() {
    new Client().getList()
      .then((json) => {
        this.setState({
          videos: json['videos']
        })
      });
  }

  render() {
    return (
      <ul>
        {this.state.videos.map(video =>(
          <Item video={video}/>
        ))}
      </ul>
    );
  }
}

export default List;

