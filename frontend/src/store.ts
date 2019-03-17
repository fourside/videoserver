import { createStore } from 'redux';
import reducer from './modules/video_form';

export default function store() {
  return createStore(reducer);
}
