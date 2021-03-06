import * as React from 'react';
import LazyImage from './lazy_image';

const PrettyBytes = require('pretty-bytes');

interface ItemProps {
  video: Video;
}

export interface Video {
  title: string;
  image: string;
  url: string;
  category: string;
  bytes: number;
  mtime: string;
}

export const Item = ({ video }: ItemProps) => (
  <div className="box is-half">
    <article className="media">
      <div className="media-left">
        <LazyImage title={video.title} image={video.image} />
      </div>
      <div className="media-content">
        <div className="content">
          <p>
            <strong>{video.title}</strong>
          </p>
          <p>{tag({ category: video.category })}</p>
          <p>
            <small>{video.mtime}</small>
          </p>
          <p>
            <span className="icon">
              <a href={video.url}>
                <i className="fas fa-download" />
              </a>
            </span>
            <small>{PrettyBytes(video.bytes)}</small>
          </p>
        </div>
      </div>
    </article>
  </div>
);

interface TagProps {
  category: string;
}
const tag = (props: TagProps) => {
  let tag;
  if (props.category) {
    tag = <span className="tag is-info">{props.category}</span>;
  } else {
    tag = '';
  }
  return <span>{tag}</span>;
};
