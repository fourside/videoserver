import * as React from 'react';
import styled from 'styled-components';

import Menu from './menu';

export default class Header extends React.Component<{}, {}> {
  render() {
    return (
      <HeaderWrapper>
        <h1 className="title">video server</h1>
        <MenuWrapper>
          <Menu />
        </MenuWrapper>
      </HeaderWrapper>
    );
  }
}

const HeaderWrapper = styled.header`
  display: flex;
  padding: 15px 0;
`;
const MenuWrapper = styled.div`
  margin-left: auto;
`;

