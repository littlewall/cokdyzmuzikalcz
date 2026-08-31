import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';

void test('desktop navigation keeps space between the logo and the first link', async () => {
    const css = await readFile(new URL('../src/components/Menu.module.css', import.meta.url), 'utf8');
    const desktopStyles = css.match(/@media \(min-width: 900px\) \{\s*\.menuWrapper \{([\s\S]*?)\n\t?\}\s*\}/);
    const logoStyles = css.match(/\.menuLogo \{([\s\S]*?)\n\}/);

    assert.ok(desktopStyles, 'desktop menu wrapper styles are missing');
    assert.ok(logoStyles, 'menu logo styles are missing');
    assert.match(desktopStyles[1], /margin-left:\s*(?!0(?:px|rem|em|vw)?\s*;)[\d.]+(?:px|rem|em|vw)\s*;/);
    assert.match(logoStyles[1], /flex-shrink:\s*0\s*;/);
});

void test('star position resolver reads fresh geometry after a resize', async () => {
    const {createStarPositionResolver} = await import(
        '../src/helpers/animations/intro/calculateStarPosition.ts'
    );
    let headerBounds = {
        height: 300, left: 490, top: 169, width: 300,
    };
    let menuBounds = {
        height: 32, left: 159, top: 743, width: 32,
    };
    const resolver = createStarPositionResolver(
        () => headerBounds,
        () => menuBounds,
    );

    assert.deepEqual(resolver(), {
        height: 300,
        width: 300,
        x: 331,
        y: -574,
    });

    headerBounds = {
        height: 300, left: 350, top: 209, width: 300,
    };
    menuBounds = {
        height: 32, left: 145, top: 823, width: 32,
    };

    assert.deepEqual(resolver(), {
        height: 300,
        width: 300,
        x: 205,
        y: -614,
    });
});

void test('star animation checks live geometry while the user scrolls', async () => {
    const animation = await readFile(
        new URL('../src/helpers/animations/intro/handleMenuStarAnimation.ts', import.meta.url),
        'utf8',
    );

    assert.match(animation, /onRefresh:\s*self\s*=>\s*updateStarPosition\(self\.progress\)/);
    assert.match(animation, /onUpdate:\s*self\s*=>\s*updateStarPosition\(self\.progress\)/);
    assert.match(animation, /const menuStarTarget = menuStar\.nextElementSibling/);
    assert.match(animation, /const bounds = menuStarTarget\.getBoundingClientRect\(\)/);
});

void test('star refresh neither jumps the timeline nor scales a low-resolution layer', async () => {
    const animation = await readFile(
        new URL('../src/helpers/animations/intro/handleMenuStarAnimation.ts', import.meta.url),
        'utf8',
    );

    assert.doesNotMatch(animation, /timeline\.progress\(1/);
    assert.doesNotMatch(animation, /scale[XY]:/);
    assert.match(animation, /height:\s*\(\)\s*=>\s*starPosition\.height/);
    assert.match(animation, /width:\s*\(\)\s*=>\s*starPosition\.width/);
});

void test('star finishes travelling exactly when the navbar snaps to the top', async () => {
    const animation = await readFile(
        new URL('../src/helpers/animations/intro/handleMenuStarAnimation.ts', import.meta.url),
        'utf8',
    );

    // The scroll range ends at the navbar pin point (bottom of the header hero),
    // measured live off the never-pinned header wrapper.
    assert.match(
        animation,
        /end:\s*\(\)\s*=>\s*headerWrapper\.getBoundingClientRect\(\)\.bottom\s*\+\s*window\.scrollY/,
    );

    // The recolour tween must not stretch the timeline past the positional tween:
    // its duration has to match the '-=0.3' offset it is added at, otherwise the
    // star lands short of the scroll end and keeps moving after the menu pins.
    assert.match(animation, /'--fill':\s*'#050b28',\s*duration:\s*0\.3,/);
    assert.match(animation, /'-=0\.3',/);
});

void test('menu star stays hidden until the white animated state is ready', async () => {
    const css = await readFile(new URL('../src/components/Menu.module.css', import.meta.url), 'utf8');

    assert.match(css, /\.menuLogo\s+svg:first-child\s*\{[\s\S]*?visibility:\s*hidden/);
});
