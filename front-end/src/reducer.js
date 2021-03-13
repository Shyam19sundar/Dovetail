export const initialState = {
    receiver: null,
    user: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAT_RECEIVER": {
            return {
                ...state,
                receiver: action.receiver,
            };
        }

        case "SET_USER": {
            return {
                ...state,
                user: action.user,
            };
        }

        default:
            return state;
    }
}