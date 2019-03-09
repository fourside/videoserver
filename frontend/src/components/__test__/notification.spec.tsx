import * as React from 'react';
import { shallow } from 'enzyme';
import * as renderer from 'react-test-renderer';

import Notification from '../notification';

test('snapshot', () => {
  const component = renderer
    .create(<Notification message="OK" isShown={true} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});

test('message', () => {
  const component = shallow(<Notification message="OK" isShown={true} />);
  expect(component.find('span').text()).toBe('OK');
});

test('isShown is true', () => {
  const component = shallow(<Notification message="OK" isShown={true} />);
  expect(component.hasClass('is-shown')).toBe(true);
});

test('isShown is false', () => {
  const component = shallow(<Notification message="OK" isShown={false} />);
  expect(component.hasClass('is-hidden')).toBe(true);
});
