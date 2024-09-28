import {MetaFunction} from '@remix-run/react';

import Menu from '~/components/menu/Menu';

import Header from './Header';
import styles from './index.module.css';

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
            <Header />
            <Menu />
            <div className={styles.content}>
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
                lorem ipsum
                <br />
            </div>
        </main>
    );
};

export default Index;
