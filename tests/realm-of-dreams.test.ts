import assert from 'node:assert/strict';
import {
    mkdtemp,
    readFile,
    rm,
    writeFile,
} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {
    after,
    before,
    test,
} from 'node:test';
import {fileURLToPath} from 'node:url';

import {build} from 'astro';

let html = '';
let outputDirectory = '';
let originalTypes = Buffer.alloc(0);

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const typesFile = join(projectRoot, '.astro', 'types.d.ts');

before(async () => {
    outputDirectory = await mkdtemp(join(tmpdir(), 'cokdyz-astro-test-'));
    originalTypes = await readFile(typesFile);

    await build({
        cacheDir: join(outputDirectory, '.astro'),
        logLevel: 'silent',
        outDir: outputDirectory,
        root: projectRoot,
    });

    html = await readFile(join(outputDirectory, 'index.html'), 'utf8');
});

after(async () => {
    await writeFile(typesFile, originalTypes);

    if (outputDirectory) {
        await rm(outputDirectory, {force: true, recursive: true});
    }
});

void test('renders the Realm of Dreams performance before the creatives section', () => {
    const performancePosition = html.indexOf('data-section="realm-of-dreams"');
    const creativesPosition = html.indexOf('id="tvurci-obsazeni"');

    assert.notEqual(performancePosition, -1, 'performance section is missing');
    assert.notEqual(creativesPosition, -1, 'creatives section is missing');
    assert.ok(performancePosition < creativesPosition, 'performance section must precede creatives');
});

void test('identifies the London performance and embeds its YouTube video', () => {
    const section = html.slice(
        html.indexOf('data-section="realm-of-dreams"'),
        html.indexOf('id="tvurci-obsazeni"'),
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
    const section = html.slice(
        html.indexOf('data-section="realm-of-dreams"'),
        html.indexOf('id="tvurci-obsazeni"'),
    );

    assert.match(
        section,
        /<blockquote[^>]*>.*A really powerful vocal melody.*songs like that\..*<\/blockquote>/s,
    );
    assert.match(section, /<cite[^>]*>.*Drew Gasparini.*<\/cite>/s);
});
