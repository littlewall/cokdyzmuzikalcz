'use client';

import Image from 'next/image';
import styles from './page.module.css';
import generateStars from '../helpers/home/generateStars';

const Home = () => {
    return (
        <main className={styles.main}>
            <div className={styles.starrySky}>
                <canvas
                    ref={ref => {
                        if (ref) {
                            generateStars(ref);
                        }
                    }}
                >
                </canvas>
                <div className={styles.center}>
                    <Image
                        className={styles.logo}
                        src="/question-mark.svg"
                        alt="Co když..? - muzikál logo"
                        width={300}
                        height={300}
                        priority
                    />
                    <h1 className={styles.title}>Co když..?</h1>
                    <h2 className={styles.subtitle}>nový muzikál</h2>
                </div>
            </div>
        </main>
    );
};

export default Home;
