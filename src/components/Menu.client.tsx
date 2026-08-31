import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';
import {
    useEffect, useRef, useState,
} from 'react';

import {introHeaderElementIds} from '../helpers/animations/intro/handleHeaderAnimation';
import {introMenuElementIds} from '../helpers/animations/intro/handleMenuStarAnimation';
import handleMenuStarAnimation from '../helpers/animations/intro/handleMenuStarAnimation';
import Logo from './Logo.client';
import styles from './Menu.module.css';

const menuLinks = [{href: '#o-muzikalu', label: 'O muzikálu'}, {href: '#tvurci-obsazeni', label: 'Tvůrci a obsazení'}];

const Menu = () => {
    const navbarRef = useRef<HTMLElement>(null);
    const [isOpened, setIsOpened] = useState(false);
    const [isLoadedLogo, setIsLoadedLogo] = useState(false);

    useEffect(() => {
        if (!isLoadedLogo) return;

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

            handleMenuStarAnimation();
        });

        let refreshFrame = 0;
        const refreshScrollTrigger = () => {
            window.cancelAnimationFrame(refreshFrame);
            refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        const resizeObserver = new ResizeObserver(refreshScrollTrigger);
        const geometryElements = [
            document.getElementById(introHeaderElementIds.headerWrapper),
            document.getElementById(introMenuElementIds.menuLogoIcon)?.closest('a'),
            navbarRef.current,
        ];

        geometryElements.forEach(element => element && resizeObserver.observe(element));

        window.addEventListener('resize', refreshScrollTrigger);

        return () => {
            ctx.revert();
            resizeObserver.disconnect();
            window.cancelAnimationFrame(refreshFrame);
            window.removeEventListener('resize', refreshScrollTrigger);
        };
    }, [isLoadedLogo]);

    return (
        <nav
            className={styles.navbar}
            id={introMenuElementIds.menuNavbar}
            ref={navbarRef}
        >
            <div className={styles.menu}>
                <a
                    href="/"
                    className={styles.menuLogo}
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
                </a>
                <button
                    className={`${styles.hamburgerButton} ${isOpened ? styles.active : ''}`}
                    onClick={() => setIsOpened(!isOpened)}
                    aria-label="Menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`${styles.menuWrapper} ${isOpened ? styles.mobileOpened : ''}`}>
                    <ul className={styles.menuList}>
                        {menuLinks.map(link => (
                            <li key={link.href} className={styles.menuItem}>
                                <a href={link.href} className={styles.menuLink}>
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div className={styles.socials}>
                        <a
                            href="https://www.instagram.com/cokdyzmuzikal"
                            target="_blank"
                            rel="noreferrer"
                            title="Instagram"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.196-4.354 2.617-6.78 6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                            </svg>
                        </a>
                        <a
                            href="https://www.youtube.com/@milanzitkacz"
                            target="_blank"
                            rel="noreferrer"
                            title="Youtube"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0)">
                                    <path d="M23.4982 6.15419C23.2227 5.10952 22.4086 4.28694 21.3764 4.00726C19.5055 3.5 12 3.5 12 3.5C12 3.5 4.49455 3.5 2.62364 4.00726C1.59136 4.28694 0.777273 5.10952 0.501818 6.15419C0 8.04887 0 12 0 12C0 12 0 15.9511 0.501818 17.8458C0.777273 18.8905 1.59136 19.7131 2.62364 19.9927C4.49455 20.5 12 20.5 12 20.5C12 20.5 19.5055 20.5 21.3764 19.9927C22.4086 19.7131 23.2227 18.8905 23.4982 17.8458C24 15.9511 24 12 24 12C24 12 24 8.04887 23.4982 6.15419Z" fill="currentColor" />
                                    <path d="M9.54541 15.5878L15.8181 11.9999L9.54541 8.41211V15.5878Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect
                                            width="24"
                                            height="17"
                                            fill="transparent"
                                            transform="translate(0 3.5)"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Menu;
