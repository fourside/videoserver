import { connect } from 'react-redux';

import { toggleModal } from '../modules/modal';
import NoVideo from '../components/no_video';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => {
      dispatch(toggleModal());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NoVideo);
