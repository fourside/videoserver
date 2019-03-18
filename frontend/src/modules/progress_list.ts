const initalState = { startPolling: null };

export default function pollingReducer(state = initalState, action) {
  switch (action.type) {
    case 'START_POLLING_PROGRESS':
      return { startPolling: Date.now() };
    default:
      return state;
  }
}

export const startPolling = () => {
  return { type: 'START_POLLING_PROGRESS' };
};
