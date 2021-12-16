class ContactsApi {
    static API_BASE_URL ="/api/v1";

    static requestHeaders() {
        return {}
    }

    static async getAllContacts() {
        const headers = this.requestHeaders();
        const request = new Request(ContactsApi.API_BASE_URL + "/contacts", {
            method: 'GET',
            headers: headers
        });

        const response = await fetch(request);

        if (! response.ok) {
            throw Error("Response not valid" + response.status);
        }

        return response.json();
    }
}

export default ContactsApi;