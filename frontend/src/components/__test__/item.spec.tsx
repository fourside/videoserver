import * as React from 'react';
import 'jest';
import * as renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { Item } from '../item';

describe('Item', () => {
  test('snapshot', () => {
    const video = {
      title: '',
      image: '',
      url: '',
      category: '',
      bytes: 256,
      mtime: '',
    };
    const component = renderer.create(<Item video={video} />).toJSON();
    expect(component).toMatchSnapshot();
  });

  test('props', () => {
    const video = {
      title: 'title',
      image: 'img.jpeg',
      url: 'http://example.com',
      category: 'music',
      bytes: 256,
      mtime: '2006-01-02',
    };
    const component = shallow(<Item video={video} />);
    expect(component.find(`figure > img[alt="${video.title}"]`).length).toBe(1);
    expect(
      component.find(`figure > img[data-src="${video.image}"]`).length
    ).toBe(1);
    expect(component.find('.content > p > strong').text()).toBe(video.title);
    expect(component.find('.tag.is-info').text()).toBe(video.category);
    expect(component.find('.icon + small').text()).toBe('256 B');
  });

  test('pretty bytes', () => {
    const video = {
      title: '',
      image: '',
      url: '',
      category: '',
      bytes: 1000 * 1000 * 1000 * 12,
      mtime: '',
    };
    const component = shallow(<Item video={video} />);
    expect(component.find('.icon + small').text()).toBe('12 GB');
  });
});
