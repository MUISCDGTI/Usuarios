import { useState } from "react"

function NewContact(props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    function onClick() {
        const newContact = {
            name: name,
            phone: phone
        };
        const result = props.onAddContact(newContact);

        if (result) {
            setName('');
            setPhone('');
        }
    }

    return (
        <tr>
            <td><input className="form-control" name="name" value={name} onChange={(event) => setName(event.target.value)}/></td>
            <td><input className="form-control" name="phone" value={phone} onChange={(event) => setPhone(event.target.value)}/></td>
            <td><button className="btn btn-primary" onClick={onClick}>Add Contact</button></td>
        </tr>
    )
}

export default NewContact;
