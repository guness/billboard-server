import React from 'react';
import { Modal, Checkbox, Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import { connect } from 'dva';


@connect(({ playlistModel, tickerlistModel, loading: { effects } }) => ({ playlistModel, tickerlistModel, effects }))
export default class GroupPlaylistModal extends React.Component {

    static propTypes = {
        isVisible: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
        group: PropTypes.object,
        type: PropTypes.oneOf(['playlist', 'tickerlist'])
    };

    static defaultProps = {
        group: null,
    };

    state = {
        lists: []
    };

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        const { effects } = this.props;
        const { effects: nextEffects, type } = nextProps;
        if (effects[`${type}Model/batchedUpdate`] || nextEffects[`${type}Model/batchedUpdate`]) {
            return;
        }

        try {
            const { group: { id } } = nextProps;
            let list;
            if (type === 'playlist') {
                list = nextProps.playlistModel.playlists;
            } else if (type === 'tickerlist') {
                list = nextProps.tickerlistModel.tickerlists;
            }

            this.setState({
                lists: list.filter(({groupId}) => groupId === id || groupId === null)
            });
        } catch (e) {
            //group is not set yet
        }
    }

    handleOk = () => {
        const { onClose, dispatch, type } = this.props;

        const listArr = this.state.lists.map(({ id, groupId }) => ({ id, groupId }));

        return dispatch({ type: `${type}Model/batchedUpdate`, payload: { listArr } }).then(onClose)
    };

    handleCancel = () => {
        this.props.onClose();
    };

    onChange = (e, i) => {
        const { group: { id } } = this.props;
        const { lists } = this.state;
        lists[i] = { ...lists[i], groupId: e.target.checked ? id : null };
        this.setState(lists);
    };

    render() {
        const { isVisible, effects, type } = this.props;
        const titleLower = type === 'playlist' ? 'playlist' : 'caption list';
        const titleUpper = type === 'playlist' ? 'Playlist' : 'Caption List';


        const { lists } = this.state;

        return (<Modal
            title={`Edit ${titleUpper}`}
            visible={isVisible}
            onCancel={this.handleCancel}
            footer={[
                <Button key="back" onClick={this.handleCancel}>Cancel</Button>,
                <Button key="submit"
                        type="primary"
                        loading={effects[`${type}Model/batchedUpdate`]}
                        onClick={this.handleOk}> Save </Button>,
            ]}
        >
            <Row>{lists.map((list, i) => {
                const { name, id, groupId } = list;
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