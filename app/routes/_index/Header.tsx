import generateStarsCanvas from '~/helpers/generateStars';
import Logo from '~/components/logo/Logo';
import styles from './header.module.css';
import {useEffect, useState} from 'react';
import {gsap} from 'gsap/dist/gsap';
import {ScrollTrigger} from 'gsap/dist/ScrollTrigger';

const Header = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const handleHeaderAnimation = () => {
            const timeline = gsap.timeline({
                duration: 1,
            });

            timeline.add(
                gsap.to(
                    '#headerLogo',
                    {
                        opacity: 0,
                        duration: 0.3,
                    },
                ),
                '-=1',
            );

            timeline.add(
                gsap.to(
                    '#headerCopy',
                    {
                        y: 80,
                        scale: 1.5,
                        duration: 1,
                    },
                ),
                '-=1',
            );

            ScrollTrigger.create({
                trigger: '#headerWrapper',
                start: 'top top',
                end: 'bottom 10%',
                scrub: true,
                animation: timeline,
            });
        };

        handleHeaderAnimation();

        window.addEventListener('resize', handleHeaderAnimation);

        return () => {
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
        <div className={styles.header} id="headerWrapper">
            <canvas
                ref={ref => {
                    if (ref) {
                        generateStarsCanvas(ref);
                    }
                }}
            >
            </canvas>
            <div className={styles.copy}>
                <div id="headerLogo">
                    <Logo
                        id="logo-header"
                    />
                </div>
                <div id="headerCopy">
                    <h1 className={styles.title}>Co když..?</h1>
                    <h2 className={styles.subtitle}>nový muzikál</h2>
                </div>
            </div>
        </div>
    );
};

export default Header;
