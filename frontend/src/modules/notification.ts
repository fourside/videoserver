const initalState = { isShown: false, message: '' };

export default function notificationReducer(state = initalState, action) {
  switch (action.type) {
    case 'NOTIFY_HTTP':
      return { isShown: true, message: 'OK' };
    case 'CLEAR_NOTIFY_HTTP':
      return { isShown: false, message: '' };
    default:
      return state;
  }
}

export const notifyHttp = () => {
  return { type: 'NOTIFY_HTTP' };
};
export const clearNotifyHttp = () => {
  return { type: 'CLEAR_NOTIFY_HTTP' };
};
