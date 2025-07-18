// import { json } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData, 
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import type {
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";
// 既存のインポート

// import { getContacts } from "./data";
import appStylesHref from "./app.css?url";

import { useEffect } from "react";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: appStylesHref },
];

import { createEmptyContact, getContacts } from "./data";

// export const action = async () =>{
//   const contact = await createEmptyContact();
//   return json({ contact });
// };

export const action = async () =>
{
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export const loader = async ({
  request,
}: LoaderFunctionArgs) =>
{
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return json({ contacts ,q });
};

export default function App() {
  const { contacts ,q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
       "q"
    );

  useEffect(() =>
  {
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement)
    {
      searchField.value = q || "";
    }
  }, [q]);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form
              id="search-form"
              onChange={(event) =>  {
                  const isFirstSearch = q === null;
                  submit(event.currentTarget, {
                      replace: !isFirstSearch,
                    });
                }}
                  role="search"
            >
              <input
                aria-label="Search contacts"
                defaultValue={q || ""}
                id="q"
                name="q"
                placeholder="Search"
                type="search"
              />
              <div
                aria-hidden
                hidden={!searching}
                id="search-spinner"
              />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
        </div>
          
          <nav>
            {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                    <NavLink className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                      to={`contacts/${contact.id}`}
                    >
                      {contact.first || contact.last ? (
                        <>
                          {contact.first} {contact.last}
                        </>
                      ) : (
                        <i>名前なし</i>
                      )}{" "}
                      {contact.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))
                }
              </ul>
            ) : (
              <p>
                <i>連絡先なし</i>
              </p>
            )}
          </nav>
        </div>
        <div
          className={
            navigation.state === "loading" && !searching
              ? "loading"
              : ""
          }
          id="detail"
        >
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
