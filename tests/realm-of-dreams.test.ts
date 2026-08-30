import assert from 'node:assert/strict';
import {
    after,
    before,
    test,
} from 'node:test';

import React, {type ComponentType} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
import {createServer, type ViteDevServer} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

let markup = '';
let vite: ViteDevServer | undefined;

before(async () => {
    vite = await createServer({
        appType: 'custom',
        configFile: false,
        css: {
            transformer: 'lightningcss',
        },
        optimizeDeps: {
            noDiscovery: true,
        },
        plugins: [tsconfigPaths()],
        server: {
            hmr: false,
            middlewareMode: true,
            ws: false,
        },
    });

    const route = await vite.ssrLoadModule('/app/routes/_index/route.tsx') as {
        default: ComponentType,
    };
    const originalConsoleError = console.error;

    console.error = (...args: unknown[]) => {
        if (String(args[0]).startsWith('Warning: useLayoutEffect does nothing on the server')) {
            return;
        }

        originalConsoleError(...args);
    };

    try {
        markup = renderToStaticMarkup(
            React.createElement(
                MemoryRouter,
                null,
                React.createElement(route.default),
            ),
        );
    } finally {
        console.error = originalConsoleError;
    }
});

after(async () => {
    await vite?.close();
});

void test('renders the Realm of Dreams performance before the creatives section', () => {
    const performancePosition = markup.indexOf('data-section="realm-of-dreams"');
    const creativesPosition = markup.indexOf('data-section="creatives"');

    assert.notEqual(performancePosition, -1, 'performance section is missing');
    assert.notEqual(creativesPosition, -1, 'creatives section marker is missing');
    assert.ok(performancePosition < creativesPosition, 'performance section must precede creatives');
});

void test('identifies the London performance and embeds its YouTube video', () => {
    const section = markup.slice(
        markup.indexOf('data-section="realm-of-dreams"'),
        markup.indexOf('data-section="creatives"'),
    );

    assert.match(section, /<h2[^>]*>Realm of Dreams v Londýně<\/h2>/);
    assert.match(section, /Scribbles Vol\. 3/);
    assert.match(section, /The Other Palace/);
    assert.match(section, /Esme North/);
    assert.match(section, /Gary Jerry/);
    assert.match(
        section,
        /<iframe[^>]+src="https:\/\/www\.youtube-nocookie\.com\/embed\/kUOoUXOcykA"[^>]+title="Realm of Dreams – živě v The Other Palace"/,
    );
});

void test('attributes Drew Gasparini’s response to the song', () => {
    const section = markup.slice(
        markup.indexOf('data-section="realm-of-dreams"'),
        markup.indexOf('data-section="creatives"'),
    );

    assert.match(
        section,
        /<blockquote[^>]*>.*A really powerful vocal melody.*songs like that\..*<\/blockquote>/s,
    );
    assert.match(section, /<cite[^>]*>.*Drew Gasparini.*<\/cite>/s);
});
