import * as React from 'react';
require('lazysizes');

const LazyImage = ({ image, title }) => (
  <figure className="image is-256x256">
    <img data-src={image} data-sizes="auto" className="lazyload" alt={title} />
  </figure>
);
export default LazyImage;
