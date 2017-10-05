import React from 'react';
import styles from './content.less';
import { Row, Col } from 'antd';


const Content = (props) =>
{
    return (
        <article className={styles.content}>
            <Row gutter={16}>
                <Col span={24}>
                    {props.children}
                </Col>
            </Row>
        </article>
    )
};

export default Content;