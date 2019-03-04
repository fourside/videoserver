import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Header from '../header';

test('snapshot', () => {
  const component = renderer
    .create(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    .toJSON();
  expect(component).toMatchSnapshot();
});
