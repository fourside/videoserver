const initalState = { isHTTPNotified: false };

export default function reducer(state = initalState, action) {
  switch (action.type) {
    case 'NOTIFY_HTTP':
      return { isShown: true, message: "OK" };
    case 'CLEAR_NOTIFY_HTTP':
      return { isShown: false, message: "" };
    default:
      return state;
  }
}
