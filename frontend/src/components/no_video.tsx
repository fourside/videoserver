import * as React from 'react';

interface Props {
  toggleModal: () => void;
}

const NoVideo = ({ toggleModal }) => (
  <div className="no-video notification is-info">
    <p>
      There is no video. <a onClick={toggleModal}>Add a video in the form.</a>
    </p>
  </div>
);
export default NoVideo;
