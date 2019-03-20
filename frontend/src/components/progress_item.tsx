import * as React from 'react';

export interface Progress {
  title: string;
  progress: number;
  ETA: string;
  image: string;
}

export const ProgressItem = (props: Progress) => {
  return (
    <div className="box is-half is-progress">
      <article className="media">
        <div className="media-left">
          <figure className="image is-256x256">
            <ProgressThumbnail title={props.title} image={props.image} />
          </figure>
        </div>
        <div className="media-content">
          <div className="content">
            <p>{props.title}</p>
            <p>
              <small>ETA: {props.ETA}</small>
            </p>
            <progress
              className="progress is-success"
              value={props.progress}
              max="100">
              {props.progress}%
            </progress>
          </div>
        </div>
      </article>
    </div>
  );
};

interface ThumbnailProps {
  image: string;
  title: string;
}
const ProgressThumbnail = ({ image, title }: ThumbnailProps) => {
  if (image === undefined) {
    return <div className="is-loading" />;
  }
  return <img src={image} data-sizes="auto" alt={title} />;
};
