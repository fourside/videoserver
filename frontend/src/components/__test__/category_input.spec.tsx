import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';

import CategoryInput from '../category_input';

test('snapshot', () => {
  const props = {
    className: "",
    name: "",
    placeholder: "",
    onChange: () => {},
    onBlur: () => {},
    item: [""],
  };
  const component = renderer.create(<CategoryInput {...props} />).toJSON();
  expect(component).toMatchSnapshot();
});

