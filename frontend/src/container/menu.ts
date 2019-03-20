import { connect } from 'react-redux';

import { toggleModal } from '../modules/modal';
import Menu from '../components/menu';

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
)(Menu);
