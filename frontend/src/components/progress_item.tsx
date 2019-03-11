import * as React from 'react';
import { useState } from 'react';
import LazyImage from './lazy_image';
import Client from '../shared/client';
require('lazysizes');

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
          <LazyImage title={props.title} image={props.image} />
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
