export const initialState = {
    receiver: null,
    room: null,
    roomDetails: null
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAT_RECEIVER": {
            return {
                ...state,
                receiver: action.receiver,
            };
        }

        case "SET_ROOM": {
            return {
                ...state,
                room: action.room,
            };
        }
        case "SET_ROOM_MEMBERS": {
            return {
                ...state,
                roomDetails: action.roomDetails,
            };
        }

        default:
            return state;
    }
}