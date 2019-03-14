import * as React from 'react';
import { connect } from 'react-redux';

import Notification from '../components/notification';

const mapStateToProps = state => {
  return {
    message: state.message,
    isShown: state.isShown,
  };
};

export default connect(mapStateToProps)(Notification);

