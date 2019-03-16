import * as React from 'react';
import { connect } from 'react-redux';

import ProgressList from '../components/progress_list';

const mapStateToProps = state => {
  return {
    startPolling: state.startPolling,
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressList);
