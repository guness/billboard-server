import React from 'react';
import {Card, Popconfirm, Icon} from 'antd';
import styles from './MediaCard.less';
import MediaPreview from './MediaPreview';


const MediaCard = ({media, onDelete}) => {

    const handleConfirm = () => onDelete(media.id);

    const deleteButton = <Popconfirm style={{float: 'right'}} title="Are you sure you want to delete this media?"
                              onConfirm={handleConfirm}
                              okText="Yes"
                              cancelText="No">
        <a href="#"><Icon type="delete"/></a>
    </Popconfirm>;

    return (<Card title={media.name}
                  className={styles.card}
                  extra={deleteButton}
                  bodyStyle={{padding: 0}}>
        <div className={styles.customImageWrapper}>
            <MediaPreview media={media}/>
        </div>
        <div className={styles.cardContent}>
            <div className="custom-card">{media.duration/1000} seconds</div>
        </div>
    </Card>)
};

export default MediaCard;