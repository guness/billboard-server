import React from 'react';
import styles from './header.less';

const AppHeader = () => {
    return (
        <header className={styles.header}>
            <h2 className={styles.brand}>BILLBOARD PANEL</h2>
        </header>
    )
};

export default AppHeader;