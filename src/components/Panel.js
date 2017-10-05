import React from 'react';
import styles from './panel.less';
import { Row, Col } from 'antd';
import PropTypes from 'prop-types';

const Panel = ({title, children}) => {
    return (
        <div className={styles.panel}>
            {title && <Row></Row>}
            <Row>
                <Col span={24}> {children}</Col>
            </Row>
        </div>
    )
};

Panel.propTypes = {
    title: PropTypes.string,
};

export default Panel;