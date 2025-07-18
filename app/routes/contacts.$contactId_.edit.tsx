
import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
} from "@remix-run/node";

import { json, redirect } from "@remix-run/node";
// import type { LoaderFunctionArgs } from "@remix-run/node";
// import { json } from "@remix-run/node";
// import { Form, useLoaderData } from "@remix-run/react";

import invariant from "tiny-invariant";

// import { getContact } from "../data";
import { getContact, updateContact } from "../data";

import{
    Form,
    useLoaderData,
    useNavigate,
} from "@remix-run/react";

export const action = async ({
    params,
    request,
}: ActionFunctionArgs) =>{
    invariant(params.contactId, "Missing contactId param");
    const formData = await request.formData();
    const firstName = formData.get("first");
    const lastName = formData.get("last");
    const updates = Object.fromEntries(formData);
    updates.first; // "Some"
    updates.last; // "Name"
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
};

export const loader = async ({
    params,
}: LoaderFunctionArgs) =>
{
    invariant(params.contactId, "Missing contactId param");
    const contact = await getContact(params.contactId);
    if (!contact)
    {
        throw new Response("Not Found", { status: 404 });
    }
    return json({ contact });
};


export default function EditContact()
{
    const { contact } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    return (
        <Form key={contact.id} id="contact-form" method="post">
            <p>
                <span>Name</span>
                <input
                    aria-label="First name"
                    defaultValue={contact.first}
                    name="first"
                    placeholder="First"
                    type="text"
                />
                <input
                    aria-label="Last name"
                    defaultValue={contact.last}
                    name="last"
                    placeholder="Last"
                    type="text"
                />
            </p>
            <label>
                <span>Twitter</span>
                <input
                    defaultValue={contact.twitter}
                    name="twitter"
                    placeholder="@jack"
                    type="text"
                />
            </label>
            <label>
                <span>Avatar URL</span>
                <input
                    aria-label="Avatar URL"
                    defaultValue={contact.avatar}
                    name="avatar"
                    placeholder="https://example.com/avatar.jpg"
                    type="text"
                />
            </label>
            <label>
                <span>Notes</span>
                <textarea
                    defaultValue={contact.notes}
                    name="notes"
                    rows={6}
                />
            </label>
            <p>
                <button type="submit">保存</button>
                <button onClick={() => navigate(-1)} type="button">
                    キャンセル
                </button>
            </p>
        </Form>
    );
}