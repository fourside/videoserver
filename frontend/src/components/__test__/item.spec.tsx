import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import { Item, Video } from '../item';

test('snapshot', () => {
  const video = {
    title: "",
    image: "",
    url: "",
    category: "",
    bytes: 256,
    mtime: "",
  };
  const component = renderer.create(<Item video={video} />).toJSON();
  expect(component).toMatchSnapshot();
});
