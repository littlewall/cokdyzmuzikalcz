import {Flip} from 'gsap/dist/Flip';
import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

import {introHeaderElementIds} from './handleHeaderAnimation';

export const introMenuElementIds = {
    menuLogoIcon: 'menuLogoIcon',
    menuNavbar: 'menuNavbar',
};

const handleMenuStarAnimation = () => {
    gsap.registerPlugin(ScrollTrigger, Flip);

    const state = Flip.getState('#' + introHeaderElementIds.headerLogoIcon + ', #' + introMenuElementIds.menuLogoIcon);
    const flip = Flip.from(state, {absolute: true, duration: 1});

    const timeline = gsap.timeline({
        duration: 1,
        onStart: () => {
            gsap.set('#' + introHeaderElementIds.headerLogoIcon, {
                visibility: 'hidden',
            });
        },
    });

    timeline.add(flip, '-=1');
    timeline.add(
        gsap.fromTo(
            '#' + introMenuElementIds.menuLogoIcon,
            {
                '--fill': '#fff',
            },
            {
                '--fill': '#050b28',
            },
        ),
        '-=0.3',
    );

    ScrollTrigger.create({
        trigger: 'body',
        start: 10,
        endTrigger: '#' + introMenuElementIds.menuNavbar,
        end: 'bottom -10%',
        scrub: true,
        animation: timeline,
    });
};

export default handleMenuStarAnimation;
