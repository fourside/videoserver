import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import Modal from '../modal';

test('snapshot', () => {
  const component = renderer
    .create(<Modal closeModal={() => {}} notifyHttp={() => {}} isOpen={true} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});
