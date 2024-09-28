import {gsap} from 'gsap/dist/gsap';
import {useEffect, useState} from 'react';

import Logo from '~/components/logo/Logo';
import generateStarsCanvas from '~/helpers/animations/intro/generateStars';
import handleHeaderAnimation, {introHeaderElementIds} from '~/helpers/animations/intro/handleHeaderAnimation';

import styles from './header.module.css';

const Header = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        const ctx = gsap.context(() => {
            handleHeaderAnimation();
        });

        window.addEventListener('resize', handleHeaderAnimation);

        return () => {
            ctx.clear();
            window.removeEventListener('resize', handleHeaderAnimation);
        };
    }, [isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            return;
        }

        setIsLoaded(true);
    }, []);

    return (
        <div className={styles.header} id={introHeaderElementIds.headerWrapper}>
            <canvas
                ref={ref => {
                    if (ref) {
                        generateStarsCanvas(ref);
                    }
                }}
            >
            </canvas>
            <div className={styles.copy}>
                <div id={introHeaderElementIds.headerLogo}>
                    <Logo
                        id={introHeaderElementIds.headerLogoIcon}
                    />
                </div>
                <div id={introHeaderElementIds.headerCopy}>
                    <h1 className={styles.title}>Co když..?</h1>
                    <h2 className={styles.subtitle}>nový muzikál</h2>
                </div>
            </div>
        </div>
    );
};

export default Header;
