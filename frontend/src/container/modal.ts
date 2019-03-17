import * as React from 'react';
import { connect } from 'react-redux';

import { closeModal } from '../modules/modal';
import Modal from '../components/modal';

const mapStateToProps = state => {
  return state.modal;
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: () => {
      dispatch(closeModal());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal);

