import {MetaFunction} from '@remix-run/react';
import generateStarsCanvas from '~/helpers/generateStars';
import styles from './index.module.css';

import logoImage from '~/assets/images/question-mark.svg';

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Co když..? - nový původní český muzikál',
        },
        {
            name: 'description',
            content: 'Šest příběhů, šest přání, jedna padající hvězda. Nový muzikál o životě, lásce a přátelství. Co když se život ze dne na den změní? Dokážeme nechat jít staré a přijmout nové? A co když to nové je vlastně tak dobře známé?',
        },
        {
            name: 'canonical',
            content: 'https://cokdyzmuzikal.cz',
        },
    ];
};

const Index = () => {
    return (
        <main className={styles.main}>
            <div className={styles.starrySky}>
                <canvas
                    ref={ref => {
                        if (ref) {
                            generateStarsCanvas(ref);
                        }
                    }}
                >
                </canvas>
                <div className={styles.center}>
                    <img
                        className={styles.logo}
                        src={logoImage}
                        alt="Co když..? - muzikál logo"
                        width={300}
                        height={300}
                    />
                    <h1 className={styles.title}>Co když..?</h1>
                    <h2 className={styles.subtitle}>nový muzikál</h2>
                </div>
            </div>
        </main>
    );
};

export default Index;
