import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import List from '../list';

test('snapshot', () => {
  const props = {
    match: {
      params: {
        category: '',
      },
    },
    history: [''],
  };
  const component = renderer.create(<List {...props} />).toJSON();
  expect(component).toMatchSnapshot();
});
