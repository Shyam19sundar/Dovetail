export const initialState = {
    receiver_id: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAT_RECEIVER": {
            return {
                ...state,
                receiver_id: action.receiver_id,
            };
        }

        default:
            return state;
    }
}