import * as React from 'react';
require('lazysizes');

interface Props {
  image: string;
  title: string;
}
const LazyImage = ({ image, title }: Props) => (
  <figure className="image is-256x256">
    <img data-src={image} data-sizes="auto" className="lazyload" alt={title} />
  </figure>
);
export default LazyImage;
