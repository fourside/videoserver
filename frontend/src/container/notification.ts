import { connect } from 'react-redux';

import Notification from '../components/notification';

const mapStateToProps = state => {
  return {
    message: state.notification.message,
    isShown: state.notification.isShown,
  };
};

export default connect(mapStateToProps)(Notification);

