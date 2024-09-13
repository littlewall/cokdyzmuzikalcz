import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';
import type {LinksFunction} from '@remix-run/node';

import appStylesHref from './globals.css?url';
import faviconHref from './assets/favicon.png?url';

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: appStylesHref,
    }, {
        rel: 'icon',
        href: faviconHref,
        type: 'image/png',
        sizes: '32x32',
    },
];

const App = () => {
    return (
        <html lang="cs">
            <head>
                <meta name="charset" content="utf-8" />
                <meta name="author" content="Milan Zítka" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
                <Scripts />
            </head>
            <body>
                <main>
                    Menu
                    <Outlet />
                </main>
                <ScrollRestoration />
            </body>
        </html>
    );
};

export default App;
