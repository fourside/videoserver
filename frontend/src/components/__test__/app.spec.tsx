import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import App from '../app';

test('snapshot', () => {
  const component = renderer.create(<App />).toJSON();
  expect(component).toMatchSnapshot();
});
