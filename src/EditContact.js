import { useState } from "react";

function EditContact(props) {
    const [name, setName] = useState(props.contact.name);
    const [phone, setPhone] = useState(props.contact.phone);

    return (
        <tr>
            <td><input className="form-control" name="name" value={name} onChange={(event) => setName(event.target.value)}/></td>
            <td><input className="form-control" name="phone" value={phone} onChange={(event) => setPhone(event.target.value)}/></td>
            <td>
                <button className="btn btn-primary" onClick={() => props.onSave({name: name, phone:phone})}>Save</button>
                <button className="btn btn-primary" onClick={() => props.onDelete(props.contact)}>Delete</button>
            </td>
        </tr>
    )
}

export default EditContact;