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
                {tag({category: this.video.category})}
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
                <small>{prettyBytes(this.video.bytes)}</small>
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }
}

interface TagProps {
  category: string
}
function tag(props: TagProps) {
  let tag;
  if (props.category) {
    tag = <span className="tag is-info">{props.category}</span>;
  } else {
    tag = "";
  }
  return (
    <span>
      {tag}
    </span>
  );
}
