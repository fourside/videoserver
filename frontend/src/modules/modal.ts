const initalState = { isOpen: false };

export default function modalReducer(state = initalState, action) {
  switch (action.type) {
    case 'OPEN_MODAL':
      return { isOpen: true };
    case 'CLOSE_MODAL':
      return { isOpen: false };
    case 'TOGGLE_MODAL':
      return { isOpen: !state.isOpen };
    default:
      return state;
  }
}

export const openModal = () => {
  return { type: 'OPEN_MODAL' };
};
export const closeModal = () => {
  return { type: 'CLOSE_MODAL' };
};
export const toggleModal = () => {
  return { type: 'TOGGLE_MODAL' };
};

