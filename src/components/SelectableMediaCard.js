import React from 'react';
import {Card, Icon} from 'antd';
import MediaPreview from './MediaPreview';
import styles from './MediaCard.less';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class SelectableMediaCard extends React.Component {
    constructor(props){
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.onClick(this.props.media.id, this.props.selected, this.props.playlist.id);
    }



    render() {
        const {media, selected} = this.props;
        let classes = classnames([styles.card, styles.cardSmall]);
        return (<Card
            onClick={this.handleClick}
            className={classes}
            extra={selected ? <Icon className={styles.iconSelected} type="check-circle"/> : null}
            title={media.name}
            bodyStyle={{padding: 0}}>
            <div className={styles.customImageWrapper}>
                <MediaPreview media={media} controls={false}/>
            </div>
        </Card>)
    }
}

SelectableMediaCard.propTypes = {
    media: PropTypes.object,
    selected: PropTypes.bool,
    playlist: PropTypes.object,
};

export default SelectableMediaCard;