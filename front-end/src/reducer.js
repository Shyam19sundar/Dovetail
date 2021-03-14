export const initialState = {
    receiver: null,
    room: null,
    uploaded: false
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

        case 'SET_UPLOAD': {
            return {
                uploaded: action.uploaded
            }
        }

        default:
            return state;
    }
}