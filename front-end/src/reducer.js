export const initialState = {
    user: null,
    receiver: null,
    room: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAT_RECEIVER": {
            return {
                receiver: action.receiver,
            };
        }

        case "SET_ROOM": {
            return {
                room: action.room,
            };
        }

        case "SET_USER": {
            return {
                user: action.user,
            };
        }

        default:
            return state;
    }
}