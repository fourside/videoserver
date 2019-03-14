import * as React from 'react';
import { connect } from 'react-redux';
import { notifyHttp } from '../action/video_form';

import VideoForm from '../components/video_form';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    notifyHttp: () => {
      dispatch(notifyHttp());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoForm);
