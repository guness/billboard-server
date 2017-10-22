import React from 'react';
import {imageRegex} from '../utils/config';
import styles from './MediaPreview.less';
import PropTypes from 'prop-types';

const ImagePreview = ({url}) => {
    return (<img alt="example"
                 width="100%"
                 className={styles.customImage}
                 src={url}/>);
};

const VideoPreview = ({url, mimeType, controls}) => {
    return (<video width="100%" controls={controls}>
        <source src={url} type={mimeType}/>
    </video>);
};

const MediaPreview = ({media, controls}) => {
    return imageRegex.test(media.mimeType) ?
        <ImagePreview url={media.url}/> :
        <VideoPreview controls={controls} mimeType={media.mimeType} url={media.url}/>;
};

MediaPreview.propTypes = {
    media: PropTypes.object.isRequired,
    controls: PropTypes.bool,
};

export default MediaPreview;