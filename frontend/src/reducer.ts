const initalState = { isHTTPNotified: false, startPolling: true };

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case 'NOTIFY_HTTP':
      return { isShown: true, message: 'OK' };
    case 'CLEAR_NOTIFY_HTTP':
      return { isShown: false, message: '' };
    case 'START_POLLING_PROGRESS':
      return { startPolling: true };
    default:
      return state;
  }
}
