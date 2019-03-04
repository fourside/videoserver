import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import Pager from '../pager';

test('snapshot', () => {
  const component = renderer
    .create(<Pager total={45} currentPage={2} onChange={() => {}} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});

