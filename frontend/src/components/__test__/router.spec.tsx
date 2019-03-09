import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import Router from '../router';

test('snapshot', () => {
  const component = renderer.create(<Router />).toJSON();
  expect(component).toMatchSnapshot();
});
