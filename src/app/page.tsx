"use client"
import Image from "next/image";
import styles from "./page.module.css";
import {ReactNode, useEffect, useRef, useState} from "react";

const random = (max: number) => Math.floor(Math.random() * max);

const generateStars = () => {
    const stars = [];

    const starCount = Math.floor(Math.random() * 200 + 700);

    for (let i = 0; i < starCount; i++) {
        const size = `${Math.random() * 3 + 1}px`;

        stars.push(
            <div
                key={`starryNightStar${i}`}
                className={styles.star}
                style={{
                    top: `${Math.random() * 200}%`,
                    left: `${Math.random() * 200}%`,
                    width: size,
                    height: size,
                    "--pulse-delay": `${Math.random() * 5}s`,
                } as React.CSSProperties}
            />
        );
    }

    return stars;
};

const Home = () => {
    const shootingStarsRef = useRef<HTMLDivElement>(null);
    const [generatedStars, setGeneratedStars] = useState<ReactNode[]>([]);

    const removeShootingStar = (shootingStarElement: HTMLDivElement) => {
        if (!shootingStarsRef.current) {
            return;
        }

        shootingStarsRef.current.removeChild(shootingStarElement);
    };

    useEffect(() => {
        const shootingStars = shootingStarsRef.current;

        if (!shootingStars || shootingStars.children.length > 0) {
            return;
        }

        const generateShootingStar = () => {
            const newShootingStar = document.createElement("div");

            newShootingStar.classList.add(styles.shootingStar);
            newShootingStar.style.setProperty("--left", `calc(50% - ${random(500) - 200}px)`);
            newShootingStar.style.setProperty("--top", `calc(50% - ${random(500) - 200}px)`);

            shootingStars.appendChild(newShootingStar);

            setTimeout(() => {
                removeShootingStar(newShootingStar);
                generateShootingStar();
            }, 8000);
        };

        generateShootingStar();
    }, [shootingStarsRef.current]);

    useEffect(() => {
        setGeneratedStars(generateStars());
    }, []);

    return (
        <main className={styles.main}>
            <div className={styles.starrySky}>
                <div className={styles.center}>
                    <Image
                        className={styles.logo}
                        src="/question-mark.svg"
                        alt="Co když..? - Muzikál logo"
                        width={300}
                        height={300}
                        priority
                    />
                    <h1 className={styles.title}>Co když..?</h1>
                    <h2 className={styles.subtitle}>nový český muzikál</h2>
                </div>
                <div className={styles.stars}>
                    {generatedStars}
                </div>
                <div className={styles.shootingStars} ref={shootingStarsRef}></div>
            </div>
        </main>
    );
}

export default Home;
