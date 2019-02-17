import * as React from 'react';

export default ({ closeModal, isOpen }) => {
  if(!isOpen) {
    return null;
  }

  return(
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Title</p>
          <button className="delete" onClick={closeModal} />
        </header>
        <section className="modal-card-body">
          <div className="content">
            modal form
          </div>
        </section>
        <footer className="modal-card-foot">
          <a className="button" onClick={closeModal}>Cancel</a>
        </footer>
      </div>
    </div>
  );
}

