import { createStore, combineReducers } from 'redux';

import modalReducer from './modules/modal';
import notificationReducer from './modules/notification';
import progressListReducer from './modules/progress_list';

export default function store() {
  return createStore(
    combineReducers({
      modal: modalReducer,
      notification: notificationReducer,
      progressList: progressListReducer,
    })
  );
}
