import React, { useReducer } from 'react';

import axios from 'axios';
import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import { 
    ADD_CONTACT,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR,
    GET_CONTACTS,
    CLEAR_CONTACTS
} from '../types';

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null, //when we click edit, whatever contact we are editing should be put into this
        filtered: null, //initially null
        error: null
    };

    const [state, dispatch] = useReducer(ContactReducer, initialState);

    //Get Contacts
    const getContacts = async () => {   
        try {
            const res = await axios.get('api/contacts');
            dispatch({
                type: GET_CONTACTS, 
                payload: res.data}); //contact comes in and we are directly sending it to the payload.
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR, 
                payload: err.response.msg});
        }    
    };

    //Add Contact
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'applicatiom/json'
            }
        }

        try {
            const res = await axios.post('api/contacts', contact, config);
            dispatch({type: ADD_CONTACT, payload: res.data}); //contact comes in and we are directly sending it to the payload.
        } catch (err) {
            dispatch({type: CONTACT_ERROR, payload: err.response.msg});
        }    
    };

    //Delete Contact
    const deleteContact = async id => {
        try {
             await axios.delete(`api/contacts/${id}`);
            dispatch({
                type: DELETE_CONTACT, 
                payload: id
            });  
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR, 
                payload: err.response.msg});
        }    
    };

    //Update Contact
    const updateContact = async contact => {
        const config = {
            headers: {
                'Content-Type': 'applicatiom/json'
            }
        }
        try {
            const res = await axios.put(`api/contacts/${contact._id}`, contact, config);
            dispatch({
                type: UPDATE_CONTACT, 
                payload: res.data
            }); 
        } catch (err) {
            dispatch({
                type: CONTACT_ERROR, 
                payload: err.response.msg});
        }    
    };

    //Clear Contacts
    const clearContacts = () => {
        dispatch({type: CLEAR_CONTACTS})
    }

    //Set Current Contact
    const setCurrent = contact => {
        dispatch({type: SET_CURRENT, payload: contact})
    }

    //Clear Current Contact - not going to take any parameters in so empty paranthesis
    const clearCurrent = () => {
        dispatch({type: CLEAR_CURRENT})
    }

    //Filter Contact
    const filterContacts = text => {
        dispatch({type: FILTER_CONTACTS, payload: text})
    }

    //Clear Filter
    const clearFilter = () => {
        dispatch({type: CLEAR_FILTER})
    }

    return (
        <ContactContext.Provider 
        value={{
            contacts: state.contacts,
            current: state.current,
            filtered: state.filtered,
            error:state.error,
            getContacts,
            addContact,
            deleteContact,
            setCurrent,
            clearCurrent,
            updateContact,
            filterContacts,
            clearFilter,
            clearContacts
        }}>
            { props.children }
        </ContactContext.Provider>
    );
};

export default ContactState;