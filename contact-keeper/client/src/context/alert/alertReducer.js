import { SET_ALERT, REMOVE_ALERT } from "../types";

// eslint-disable-next-line  
export default (state, action) => {
    switch(action.type){
        case SET_ALERT:
            return[
                ...state,
                action.payload
            ];
        // eslint-disable-next-line  
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== action.payload) // payload is the id

        // eslint-disable-next-line    
        default:
            return state;
    }
};