
function Contact(props) {
    return (
        <tr>
            <td>{props.contact.name}</td>
            <td>{props.contact.phone}</td>
            <td>
                <button className="btn btn-primary" onClick={() => props.onEdit(props.contact)}>Edit</button>
                <button className="btn btn-primary" onClick={() => props.onDelete(props.contact)}>Delete</button>
            </td>
        </tr>
    )
}

export default Contact;