import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Menu from '../menu';

test('snapshot', () => {
  const component = renderer
    .create(
      <MemoryRouter>
        <Menu toggleModal={() => {}} />
      </MemoryRouter>
    )
    .toJSON();
  expect(component).toMatchSnapshot();
});
