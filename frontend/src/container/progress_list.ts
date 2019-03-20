import { connect } from 'react-redux';

import ProgressList from '../components/progress_list';

const mapStateToProps = state => {
  return {
    startPolling: state.progressList.startPolling,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressList);
