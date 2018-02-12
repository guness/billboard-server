import React from 'react';
import { Spin } from 'antd';
import styles from './ModuleLoading.less'

export default () => <div className={styles.loadingContainer}><Spin/></div>;