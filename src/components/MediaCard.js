import React from 'react';
import {Card, Popconfirm, Icon, InputNumber} from 'antd';
import {connect} from 'dva';
import styles from './MediaCard.less';
import MediaPreview from './MediaPreview';
import {imageRegex} from '../utils/config';


class MediaCard extends React.Component{

    constructor(props){
        super(props);

        this.handleConfirm = this.handleConfirm.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleConfirm(){
        let {onDelete, media} = this.props;
        onDelete(media.id);
    }

    handleChange(value){
        let {onDurationChange,  media} = this.props;
        onDurationChange(media.id, value*1000);
    }

    render(){
        const {media, loading} = this.props;

        const deleteButton = <Popconfirm style={{float: 'right'}}
                                         title="Are you sure you want to delete this media?"
                                         onConfirm={this.handleConfirm}
                                         okText="Yes"
                                         cancelText="No">
            <a href="#"><Icon type="delete"/></a>
        </Popconfirm>;

        let duration;
        if(imageRegex.test(media.mimeType)){
            duration = <InputNumber min={1}
                                    max={7200}
                                    disabled={loading}
                                    defaultValue={media.duration/1000}
                                    onChange={this.handleChange} />
        }else{
            duration = <span>{media.duration/1000}</span>
        }

        return (<Card title={media.name}
                      className={styles.card}
                      extra={deleteButton}
                      bodyStyle={{padding: 0}}>
            <div className={styles.customImageWrapper}>
                <MediaPreview media={media} controls={true}/>
            </div>
            <div className={styles.cardContent}>
                <div className="custom-card">
                    Duration: {duration} seconds
                </div>
            </div>
        </Card>)
    }
}

export default connect(({mediaModel, loading}) => ({mediaModel, loading: loading.effects['mediaModel/update']}))(MediaCard);