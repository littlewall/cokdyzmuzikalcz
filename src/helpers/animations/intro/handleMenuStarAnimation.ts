import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

import {createStarPositionResolver} from './calculateStarPosition';
import {introHeaderElementIds} from './handleHeaderAnimation';

export const introMenuElementIds = {
    menuLogoIcon: 'menuLogoIcon',
    menuNavbar: 'menuNavbar',
};

const handleMenuStarAnimation = () => {
    gsap.registerPlugin(ScrollTrigger);

    const headerStar = document.getElementById(introHeaderElementIds.headerLogoIcon);
    const menuStar = document.getElementById(introMenuElementIds.menuLogoIcon);

    if (!headerStar || !menuStar) {
        return;
    }

    const menuNavbar = document.getElementById(introMenuElementIds.menuNavbar);
    const headerWrapper = document.getElementById(introHeaderElementIds.headerWrapper);
    const menuStarTarget = menuStar.nextElementSibling;

    if (!menuNavbar || !headerWrapper || !menuStarTarget) {
        return;
    }

    const readHeaderBounds = () => {
        const bounds = headerStar.getBoundingClientRect();

        return {
            height: bounds.height,
            left: bounds.left + window.scrollX,
            top: bounds.top + window.scrollY,
            width: bounds.width,
        };
    };
    const readMenuBounds = () => {
        const bounds = menuStarTarget.getBoundingClientRect();
        const navbarBounds = menuNavbar.getBoundingClientRect();
        const layoutParentBounds = menuNavbar.parentElement?.getBoundingClientRect() ?? navbarBounds;

        return {
            height: bounds.height,
            left: layoutParentBounds.left + window.scrollX + bounds.left - navbarBounds.left,
            top: layoutParentBounds.top + window.scrollY + bounds.top - navbarBounds.top,
            width: bounds.width,
        };
    };
    const resolveStarPosition = createStarPositionResolver(
        readHeaderBounds,
        readMenuBounds,
    );
    let starPosition = resolveStarPosition();

    const timeline = gsap.timeline({duration: 1});

    timeline.fromTo(
        menuStar,
        {
            height: () => starPosition.height,
            transformOrigin: 'top left',
            width: () => starPosition.width,
            x: () => starPosition.x,
            y: () => starPosition.y,
        },
        {
            duration: 1,
            ease: 'none',
            height: () => readMenuBounds().height,
            width: () => readMenuBounds().width,
            x: 0,
            y: 0,
        },
        0,
    );

    // Recolour over the last 0.3 of the timeline. The duration must match the
    // '-=0.3' offset so the fill tween ends exactly at time 1 alongside the
    // positional tween; a longer (default 0.5) fill would push the timeline to
    // 1.2 and make the star land at only ~83% of the scroll range — i.e. keep
    // flying past the point where the navbar snaps to the top.
    timeline.add(
        gsap.fromTo(
            '#' + introMenuElementIds.menuLogoIcon,
            {
                '--fill': '#fff',
            },
            {
                '--fill': '#050b28',
                duration: 0.3,
            },
        ),
        '-=0.3',
    );

    const updateStarPosition = (progress: number) => {
        const nextPosition = resolveStarPosition();
        const hasChanged = Object.entries(nextPosition).some(
            ([key, value]) => value !== starPosition[key as keyof typeof starPosition],
        );

        if (!hasChanged) {
            return;
        }

        starPosition = nextPosition;
        timeline.invalidate().progress(progress, true);
    };

    ScrollTrigger.create({
        trigger: 'body',
        start: 10,
        // End exactly where the navbar snaps to the top. The navbar pins once its
        // natural document top reaches the viewport top, which is the bottom of the
        // header hero in document space. headerWrapper is never pinned, so
        // rect.bottom + scrollY is a stable absolute scroll position across
        // refreshes and resizes and resolves to the same scroll as the pin start.
        end: () => headerWrapper.getBoundingClientRect().bottom + window.scrollY,
        scrub: true,
        animation: timeline,
        onRefresh: self => updateStarPosition(self.progress),
        onUpdate: self => updateStarPosition(self.progress),
    });

    gsap.set(menuStar, {
        '--fill': '#fff',
        visibility: 'visible',
    });
    gsap.set(headerStar, {
        visibility: 'hidden',
    });
};

export default handleMenuStarAnimation;
