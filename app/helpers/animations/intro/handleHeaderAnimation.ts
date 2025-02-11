import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

export const introHeaderElementIds = {
    headerLogo: 'headerLogo',
    headerCopy: 'headerCopy',
    headerWrapper: 'headerWrapper',
    headerLogoIcon: 'headerLogoIcon',
};

const handleHeaderAnimation = () => {
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
        duration: 1,
    });

    timeline.add(
        gsap.to(
            '#' + introHeaderElementIds.headerLogo,
            {
                opacity: 0,
                duration: 0.1,
            },
        ),
        '-=1',
    );

    timeline.add(
        gsap.to(
            '#' + introHeaderElementIds.headerCopy,
            {
                y: 80,
                duration: 1,
            },
        ),
        '-=1',
    );

    timeline.add(
        gsap.to(
            '#' + introHeaderElementIds.headerCopy + ' h1',
            {
                scale: 1.5,
                duration: 1,
            },
        ),
        '-=1',
    );

    timeline.add(
        gsap.to(
            '#' + introHeaderElementIds.headerCopy + ' h2',
            {
                y: 20,
                duration: 1,
            },
        ),
        '-=1',
    );

    ScrollTrigger.create({
        trigger: '#' + introHeaderElementIds.headerWrapper,
        start: 'top top',
        end: 'bottom 10%',
        scrub: true,
        animation: timeline,
    });
};

export default handleHeaderAnimation;
