import * as React from 'react';

import {Client} from './client';

interface ListProps {
  videos : Array<any>
}

class List extends React.Component<{}, ListProps> {

  constructor(props) {
    super(props);
    this.state = {
      videos: []
    }
  }

  componentDidMount() {
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
          <li key={video.title}>
            {video.title}
          </li>
        ))}
      </ul>
    );
  }
}

export default List;

