import * as React from 'react';
import prettyBytes from 'pretty-bytes';

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
                <small>size: {prettyBytes(this.video.bytes)}</small>
              </p>
              <p>
                <small>{this.video.mtime}</small>
              </p>
              <p>
                <span className="icon">
                  <a href={this.video.url}>
                    <i className="fas fa-download"></i>
                  </a>
                </span>
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }
}
