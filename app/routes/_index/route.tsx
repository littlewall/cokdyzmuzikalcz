import {MetaFunction} from '@remix-run/react';
import clsx from 'clsx';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import {useEffect} from 'react';

import Menu from '~/components/menu/Menu';

import milanzitkaImageSrc from '../../assets/images/creatives/milanzitka.png?url';
import Header from './Header';
import styles from './index.module.css';

export const meta: MetaFunction = () => {
    return [
        {
            title: 'Co když..? - nový původní český muzikál',
        },
        {
            name: 'description',
            content: 'V záři blížícího se meteoroidu šest mladých lidí dostává šanci napravit chyby minulosti dřív, než padající hvězda splní jejich poslední přání. Najdou ale odvahu říct, po čem doopravdy touží?',
        },
        {
            name: 'canonical',
            content: 'https://cokdyzmuzikal.cz',
        },
    ];
};

const Index = () => {
    useEffect(() => {
        const refreshScrollTrigger = () => {
            ScrollTrigger.refresh();
        };

        window.addEventListener('resize', refreshScrollTrigger);

        return () => {
            window.removeEventListener('resize', refreshScrollTrigger);
        };
    }, []);

    return (
        <main className={styles.main}>
            <Header />
            <Menu />
            <div className={styles.content} id="o-muzikalu">
                <div className={styles.copy}>
                    <strong>
                        V záři blížícího se meteoroidu dostává šest mladých lidí šanci napravit chyby minulosti dřív,
                        než padající hvězda splní jejich poslední přání. Najdou ale odvahu říct, po čem doopravdy touží?
                    </strong>
                    <p>
                        Původní český muzikál s intimním příběhem o tom, že někdy musíme ztratit všechno, abychom našli to nejdůležitější.
                    </p>
                </div>
                <div className={styles.video}>
                    <iframe
                        src="https://player.cloudinary.com/embed/?public_id=mhxyw0cf98timxi0rsfh&cloud_name=da9ua4xl4&profile=WIweb"
                        width="640"
                        height="360"
                        style={{
                            height: '100%',
                            width: '100%',
                            aspectRatio: '640 / 360',
                            position: 'absolute',
                            top: 0,
                        }}
                        allowFullScreen={false}
                    >
                    </iframe>
                </div>
            </div>
            <div className={styles.content} id="tvurci-obsazeni">
                <div className={clsx(styles.creativesCard, styles.fullWidth)}>
                    <div className={styles.name}>
                        <div className={styles.imageWrapper}>
                            <div
                                className={styles.image}
                                style={{backgroundImage: 'url(' + milanzitkaImageSrc + ')'}}
                            >
                            </div>
                        </div>
                    </div>
                    <div className={styles.description}>
                        <h3>Milan Zítka</h3>
                        <strong>hudba, texty, scénář</strong>
                        <p>
                            Hudebník, skladatel a textař, jehož cesta k muzikálu vedla přes jeviště i hudební studia.
                            Jako muzikálový herec účinkoval v inscenacích RENT, Ples upírů, Fantom opery či Les Misérables (Bídníci).
                            V autorské tvorbě spojuje vášeň pro hudbu s vyprávěním příběhů. Jeho muzikálovou prvotinou
                            byl muzikál Mistr jazzu, který se uváděl v Karlovarském městském divadle.
                        </p>
                    </div>
                </div>
            </div>
            <footer className={styles.footer}>
                <p className={styles.copy}>
                    &copy; 2025 Milan Zítka
                </p>
            </footer>
        </main>
    );
};

export default Index;
