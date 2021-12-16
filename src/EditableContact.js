import { useState } from "react";
import Contact from "./Contact.js";
import EditContact from "./EditContact.js";

function EditableContact(props) {
    const [isEditing, setIsEditing] = useState(false);

    function saveContact(contact) {
        const result = props.onEdit(contact);
        if (result) {
            setIsEditing(false);
        }
    }

    var contactRender;
    if (isEditing) {
        contactRender = <EditContact contact={props.contact} onDelete={props.onDelete} onSave={saveContact}/>;
    } else {
        contactRender = <Contact contact={props.contact} onDelete={props.onDelete} onEdit={() => setIsEditing(true)}/>;
    }

    return contactRender;
}

export default EditableContact;