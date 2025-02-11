import type {LinksFunction} from '@remix-run/node';
import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from '@remix-run/react';

import appleTouchIcon from './assets/favicon/apple-touch-icon.png?url';
import favicon16 from './assets/favicon/favicon-16x16.png?url';
import favicon32 from './assets/favicon/favicon-32x32.png?url';
import appStylesHref from './globals.css?url';

export const links: LinksFunction = () => [
    {
        rel: 'stylesheet',
        href: appStylesHref,
    },
    {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: appleTouchIcon,
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: favicon32,
    },
    {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: favicon16,
    },

];

const App = () => {
    return (
        <html lang="cs">
            <head>
                <meta charSet="utf-8" />
                <meta
                    httpEquiv="Content-Type"
                    content="text/html;charset=utf-8"
                />
                <meta name="author" content="Milan Zítka" />
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <Links />
                <Scripts />
            </head>
            <body>
                <main>
                    <Outlet />
                </main>
                <ScrollRestoration />
            </body>
        </html>
    );
};

export default App;
