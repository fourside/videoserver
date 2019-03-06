import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Pager from '../pager';

test('snapshot', () => {
  const component = renderer
    .create(<Pager total={45} currentPage={2} onChange={() => {}} />)
    .toJSON();
  expect(component).toMatchSnapshot();
});

test('total 46 items should contain 4 li', () => {
  const component = shallow(<Pager total={46} currentPage={2} onChange={() =>{}} />);
  expect(component.find("li").length).toBe(4);
});

test('total 45 items should contain 3 li', () => {
  const component = shallow(<Pager total={45} currentPage={2} onChange={() =>{}} />);
  expect(component.find("li").length).toBe(3);
});

test('total 44 items should contain 3 li', () => {
  const component = shallow(<Pager total={44} currentPage={2} onChange={() =>{}} />);
  expect(component.find("li").length).toBe(3);
});

test('total 0 items should contain 0 li', () => {
  const component = shallow(<Pager total={0} currentPage={2} onChange={() =>{}} />);
  expect(component.find("li").length).toBe(0);
});

test('currentPage is 0, first li should **not** be anchor', () => {
  const component = shallow(<Pager total={44} currentPage={0} onChange={() =>{}} />);
  expect(component.find("li:first-child").childAt(0).type()).toBe("span");
});

test('currentPage is 1, first li should be anchor', () => {
  const component = shallow(<Pager total={44} currentPage={1} onChange={() =>{}} />);
  expect(component.find("li:first-child").childAt(0).type()).toBe("a");
});
