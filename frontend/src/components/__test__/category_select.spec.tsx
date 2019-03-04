import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import CategorySelect from '../category_select';

test('snapshot', () => {
  const props = {
    current: "",
    categories: [""],
    onChange: () => {},
  };
  const component = renderer.create(<CategorySelect {...props} />).toJSON();
  expect(component).toMatchSnapshot();
});
