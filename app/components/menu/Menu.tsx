import {NavLink} from '@remix-run/react';
import clsx from 'clsx';
import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import {
    useEffect,
    useState,
} from 'react';

import Logo from '~/components/logo/Logo';
import handleStarAnimation, {introMenuElementIds} from '~/helpers/animations/intro/handleMenuStarAnimation';

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

        const ctx = gsap.context(() => {
            gsap.registerPlugin(ScrollTrigger);

            ScrollTrigger.create({
                trigger: '#' + introMenuElementIds.menuNavbar,
                start: 'top top',
                end: 'max',
                pin: true,
                pinType: 'fixed',
                pinSpacing: false,
            });

            handleStarAnimation();
        });

        const refreshScrollTrigger = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', refreshScrollTrigger);

        return () => {
            ctx.clear();
            window.removeEventListener('resize', refreshScrollTrigger);
        };
    }, [isLoadedLogo]);

    return (
        <nav
            className={styles.navbar}
            id={introMenuElementIds.menuNavbar}
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
                        id={introMenuElementIds.menuLogoIcon}
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
