import * as React from 'react';

import Client from './client';
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

  componentWillMount() {
    const { category } = this.props.match.params;
    new Client().getList(category)
      .then(json => {
        this.setState({
          videos: json
        })
      });
  }

  render() {
    return (
      <div>
        {this.state.videos.map(video =>(
          <Item video={video} key={video.title}/>
        ))}
      </div>
    );
  }
}

export default List;

