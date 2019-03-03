import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import Loading from '../loading';

test('snapshot', () => {
  const loading = renderer.create(<Loading />).toJSON();
  expect(loading).toMatchSnapshot();
});
