import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import clsx from 'clsx';
import {NavLink} from '@remix-run/react';
import {Flip} from 'gsap/dist/Flip';
import {
    useEffect,
    useState,
} from 'react';

import Logo from '~/components/logo/Logo';

import styles from './menu.module.css';

const menuLinks = [
    {
        href: '/o-projektu',
        label: 'O muzikálu',
    },
    {
        href: '/album',
        label: 'Album',
    },
    {
        href: '/galerie',
        label: 'Galerie',
    },
    {
        href: '/kontakt',
        label: 'Kontakt',
    },
];

const Menu = ({
    hasSocialIcons = true,
}) => {
    const [isOpened, setIsOpened] = useState(false);
    const [isLoadedLogo, setIsLoadedLogo] = useState(false);

    useEffect(() => {
        if (!isLoadedLogo) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger, Flip);

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: '.' + styles.navbar,
                start: 'top top',
                end: 'max',
                pin: true,
                pinType: 'fixed',
                pinSpacing: false,
            });
        });

        const handleStarAnimation = () => {
            const state = Flip.getState('#logo-header, #logo-menu');
            const flip = Flip.from(state, {absolute: true, duration: 1});

            const timeline = gsap.timeline({
                duration: 1,
                onStart: () => {
                    gsap.set('#logo-header', {
                        visibility: 'hidden',
                    });
                },
            });

            timeline.add(flip, '-=1');
            timeline.add(
                gsap.fromTo('#logo-menu', {
                    '--fill': '#fff',
                }, {
                    '--fill': '#050b28',
                }),
                '-=0.3',
            );

            ScrollTrigger.create({
                trigger: 'body',
                start: 10,
                endTrigger: '.' + styles.navbar,
                end: 'bottom -10%',
                scrub: true,
                animation: timeline,
            });
        };

        handleStarAnimation();

        window.addEventListener('resize', handleStarAnimation);

        return () => {
            ctx.clear();
            window.removeEventListener('resize', handleStarAnimation);
        };
    }, [isLoadedLogo]);

    return (
        <nav
            className={styles.navbar}
            ref={ref => {
                if (ref) {
                    ScrollTrigger.refresh();
                }
            }}
        >
            <div className={styles.menu}>
                <NavLink
                    className={styles.menuLogo}
                    to="/"
                >
                    <span className={styles.menuLogoText}>
                        Co když..
                    </span>
                    <Logo
                        id="logo-menu"
                        width="2rem"
                        height="2rem"
                        fill="#050b28"
                        onLoad={() => setIsLoadedLogo(true)}
                    />
                </NavLink>
                <button
                    className={clsx(styles.hamburgerButton, isOpened && styles.active)}
                    onClick={() => setIsOpened(!isOpened)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={clsx(styles.menuWrapper, isOpened && styles.mobileOpened)}>
                    <ul className={clsx(styles.menuList)}>
                        {menuLinks.map(link => (
                            <li key={link.href} className={styles.menuItem}>
                                <NavLink
                                    className={state => clsx(styles.menuLink, state.isActive && styles.linkActive)}
                                    to={link.href}
                                >
                                    {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                    {hasSocialIcons && (
                        <div className={styles.socials}>
                            {/* <SocialsIcons /> */}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Menu;
