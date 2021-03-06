import * as React from 'react';

import VideoForm from '../container/video_form';

interface ModalProps {
  closeModal: () => void;
  isOpen: boolean;
}
const Modal = ({ closeModal, isOpen }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Video Form</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            <VideoForm close={closeModal} />
          </div>
        </section>
        <footer className="modal-card-foot" />
      </div>
    </div>
  );
};

export default Modal;
