import { Fragment, useEffect, useState } from 'react';
import EditableContact from './EditableContact.js';
import Alert from './Alert.js';
import NewContact from './NewContact.js';
import ContactsApi from './ContactsApi.js';

function Contacts(props) {

    const [message, setMessage] = useState(null);
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        async function fetchContacts() {
            try {
                const c = await ContactsApi.getAllContacts();
                setContacts(c);
            } catch (error) {
                setMessage('Could not contact with the server');
            }
        }

        fetchContacts();
    }, []);

    function onAlertClose() {
        setMessage(null);
    }

    function onContactEdit(newContact, oldContact) {
        const validation = validateContactName(newContact);
        if (! validation) {
            return false;
        }

        if (newContact.name !== oldContact.name) {
            setMessage('Cannot change name');
            return false;
        }

        setContacts((prevContacts) => {
            const newContacts = prevContacts.map((c) => c.name === oldContact.name ? newContact : c);
            return newContacts
        })

        return true;
    }

    function onContactDelete(contact) {
        setContacts((prevContacts) => {
            return prevContacts.filter((c) => c.name !== contact.name);
        });
    }

    function validateContactName(contact) {
        if (contact.name === '') {
            setMessage('A name must be provided');
            return false;
        }

        return true;
    }

    function onAddContact(contact) {
        const validation = validateContactName(contact);
        if (! validation) {
            return false;
        }

        if (contacts.find(c => c.name === contact.name)) {
            setMessage('Duplicated contact');
            return false;
        }

        setContacts((prevContacts) => {
            if (! prevContacts.find(c => c.name === contact.name)) {
                return [...prevContacts, contact];
            } else {
                setMessage('Duplicated contact');
                return prevContacts;
            }
        });
        return true;
    }

    return (
        <Fragment>
            <Alert message={message} onClose={onAlertClose}/>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>&nbsp;</th>
                    </tr>
                </thead>
                <tbody>
                    <NewContact onAddContact={onAddContact}/>
                    {contacts.map((contact) => 
                        <EditableContact key={contact.name} contact={contact} onEdit={(newContact) => onContactEdit(newContact, contact)} onDelete={onContactDelete}/>
                    )}
                </tbody>
            </table>
        </Fragment>
    )
}

export default Contacts;