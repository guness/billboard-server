import React from 'react';
import { Modal, Checkbox, Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'dva';


@connect(({ playlistModel, loading: { effects } }) => ({ playlistModel, effects }))
export default class GroupPlaylistModal extends React.Component {

    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        group: PropTypes.object,
    };

    static defaultProps = {
        group: null,
    };

    state = {
        playlists: []
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const { effects } = this.props;
        const { effects: nextEffects } = nextProps;
        if (effects['playlistModel/batchedUpdate'] || nextEffects['playlistModel/batchedUpdate']) {
            return;
        }

        try {
            const { playlistModel: { playlists }, group: { id } } = nextProps;
            this.setState({
                playlists: playlists.filter(({ groupId }) => groupId === id || groupId === null)
            });
        } catch (e) {
            //group is not set yet
        }
    }

    handleOk = () => {
        const { onClose, dispatch } = this.props;

        const playlistArr = this.state.playlists.map(({ id, groupId }) => ({ id, groupId }));

        return dispatch({ type: 'playlistModel/batchedUpdate', payload: { playlistArr } }).then(onClose)
    };

    handleCancel = () => {
        this.props.onClose();
    };

    onChange = (e, i) => {
        const { group: { id } } = this.props;
        const { playlists } = this.state;
        playlists[i] = { ...playlists[i], groupId: e.target.checked ? id : null };
        this.setState(playlists);
    };

    render() {
        const { isVisible, effects } = this.props;
        const { playlists } = this.state;

        return (<Modal
            title="Edit Playlist"
            visible={isVisible}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                <Button key="submit"
                        type="primary"
                        loading={effects['playlistModel/batchedUpdate']}
                        onClick={this.handleOk}> Save </Button>,
            ]}
        >
            <Row>{playlists.map((playlist, i) => {
                const { name, id, groupId } = playlist;
                return <Col span={24} key={id}>
                    <Checkbox
                        onChange={e => this.onChange(e, i)}
                        checked={groupId !== null}
                    >{name}</Checkbox>
                </Col>
            })
            }</Row>
        </Modal>)
    }
}