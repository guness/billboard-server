import React from 'react';
import styles from './layout.less';

const Layout = (props) =>
{
    return (
        <article className={styles.layout}>
            {props.children}
        </article>
    )
};

export default Layout;