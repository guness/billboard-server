import React from 'react';
import {HOST, imageRegex} from '../utils/config';
import styles from './MediaPreview.less';

const ImagePreview = ({url}) => {
    return (<img alt="example"
                 width="100%"
                 className={styles.customImage}
                 src={url}/>);
};

const VideoPreview = ({url, mimeType, controls}) => {
    return (<video width="100%" controls={controls}>
        <source src={HOST + '/' + url} type={mimeType}/>
    </video>);
};

const MediaPreview = ({media, controls}) => {
    return imageRegex.test(media.mimeType) ?
        <ImagePreview url={HOST + '/' + media.url}/> :
        <VideoPreview controls={controls} mimeType={media.mimeType} url={media.url}/>;
};

export default MediaPreview;