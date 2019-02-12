import * as React from 'react';

import {Client} from './client';

class List extends React.Component<{}, {}> {

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

