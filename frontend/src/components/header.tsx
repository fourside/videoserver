import * as React from 'react';
import styled from 'styled-components';

import Menu from '../container/menu';
import Notification from '../container/notification';

const Header = () => {
  return (
    <HeaderWrapper>
      <h1 className="title">video server</h1>
      <MenuWrapper>
        <Menu />
      </MenuWrapper>

      <Notification />
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  display: flex;
  padding: 15px 0;
`;
const MenuWrapper = styled.div`
  margin-left: auto;
`;

export default Header;
