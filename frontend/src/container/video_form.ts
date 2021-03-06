import { connect } from 'react-redux';
import { notifyHttp, clearNotifyHttp } from '../modules/notification';
import { startPolling } from '../modules/progress_list';

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
      setTimeout(() => {
        dispatch(startPolling());
      }, 2000);
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VideoForm);
