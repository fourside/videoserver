import * as React from 'react';
import { useState, useCallback } from 'react';
import styled from 'styled-components';

import Menu from './menu';
import Modal from './modal';
import Notification from './notification';

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isNotified, setNotified] = useState(false);

  const toggleModal = useCallback((): void => {
    setModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const notifyHttp = useCallback((): void => {
    setNotified(true);
    setTimeout(() => {
      setNotified(false);
    }, 2000);
  }, []);

  return (
    <HeaderWrapper>
      <h1 className="title">video server</h1>
      <MenuWrapper>
        <Menu toggleModal={toggleModal} />
      </MenuWrapper>

      <Notification message="OK!" isShown={isNotified} />

      <Modal
        closeModal={toggleModal}
        notifyHttp={notifyHttp}
        isOpen={isModalOpen}
      />
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
