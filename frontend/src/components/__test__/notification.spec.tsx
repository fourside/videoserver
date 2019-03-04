import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import Notification from '../notification';

test('snapshot', () => {
  const component = renderer
    .create(<Notification message="OK" isShown={true} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});
