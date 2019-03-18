const initalState = { startPolling: true };

export default function pollingReducer(state = initalState, action) {
  switch (action.type) {
    case 'START_POLLING_PROGRESS':
      return { startPolling: true };
    default:
      return state;
  }
}

export const startPolling = () => {
  return { type: 'START_POLLING' };
};
