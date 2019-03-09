import * as React from 'react';
import * as renderer from 'react-test-renderer';

import Loading from '../loading';

test('snapshot', () => {
  const component = renderer.create(<Loading />).toJSON();
  expect(component).toMatchSnapshot();
});
