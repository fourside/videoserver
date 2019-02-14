import * as React from 'react';

interface ItemProps {
  video : Video
}

export interface Video {
  title :string
  image :string
  url :string
  category :string
  bytes :number
  mtime :string
}

export class Item extends React.Component<ItemProps, {}> {
  video :Video;

  constructor(props: ItemProps) {
    super(props);
    this.video = props.video;
  }

  render() {
    return (
      <div className="box is-half">
        <article className="media">
          <div className="media-left">
            <figure className="image is-256x256">
              <img src={this.video.image} alt={this.video.title} />
            </figure>
          </div>
          <div className="media-content">
            <div className="content">
              <p>
                <strong>{this.video.title}</strong>
              </p>
              <p>
                <small>size: {this.video.bytes}</small>
              </p>
              <p>
                <small>{this.video.mtime}</small>
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }
}
