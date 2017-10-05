import React from 'react';
import {Card, Popconfirm, Icon} from 'antd';
import styles from './MediaCard.less';
import {HOST, imageRegex} from '../utils/config';

const ImagePreview = ({url}) => {
    return (<img alt="example"
                 width="100%"
                 className={styles.customImage}
                 src={url}/>);
};

const VideoPreview = ({url, mimeType}) => {
    return (<video width="100%" controls="true">
        <source src={HOST + '/' +url} type={mimeType}/>
    </video>);
};


const MediaCard = ({media, onDelete}) => {

    const handleConfirm = () => onDelete(media.id);

    const MediaPreview = imageRegex.test(media.mimeType) ?
        <ImagePreview url={HOST + '/' + media.url}/> :
        <VideoPreview mimeType={media.mimeType} url={media.url}/>;

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
            {MediaPreview}
        </div>
        <div className={styles.cardContent}>
            <div className="custom-card">{media.duration/1000} seconds</div>
        </div>
    </Card>)
};

export default MediaCard;