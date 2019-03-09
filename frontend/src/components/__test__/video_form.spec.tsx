import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import VideoForm from '../video_form';

test('snapshot', () => {
  const component = renderer
    .create(<VideoForm close={() => {}} notifyHttp={() => {}} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});
