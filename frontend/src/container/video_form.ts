import * as React from 'react';
import { connect } from 'react-redux';
import { notifyHttp, clearNotifyHttp } from '../action/video_form';

import VideoForm from '../components/video_form';

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    notifyHttp: () => {
      dispatch(notifyHttp());
      setTimeout(() => {
        dispatch(clearNotifyHttp());
      }, 2000);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoForm);
