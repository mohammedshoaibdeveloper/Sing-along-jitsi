// @flow

import React, { Component } from 'react';
import type { Dispatch } from 'redux';
import { Linking } from "react-native"
import _ from 'lodash';

import { ConfirmDialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { safeDecodeURIComponent } from "../../base/util"
import { cancelWaitForOwner, _openLoginDialog } from '../actions';

/**
 * The type of the React {@code Component} props of {@link WaitForOwnerDialog}.
 */
type Props = {

    /**
     * The name of the conference room (without the domain part).
     */
    _room: string,

    /**
     * Redux store dispatch function.
     */
    dispatch: Dispatch<any>,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * The dialog is display in XMPP password + guest access configuration, after
 * user connects from anonymous domain and the conference does not exist yet.
 *
 * See {@link LoginDialog} description for more details.
 */
class WaitForOwnerDialog extends Component<Props> {
    /**
     * Initializes a new WaitForWonderDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onLogin = this._onLogin.bind(this);
    }

    safeStartCase(s = '') {
        return _.words(`${s}`.replace(/['\u2019]/g, '')).reduce(
            (result, word, index) => result + (index ? ' ' : '') + _.upperFirst(word)
            , '');
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _room: room
        } = this.props;

        const roomName = this.safeStartCase(safeDecodeURIComponent(room))

        return (
            <ConfirmDialog
                okKey="Leave Meeting"
                onSubmit={() => {
                    this._onCancel()
                }}
                waitingForHost={true}
                contentKey = {
                    {
                        key: 'dialog.WaitForHostMsgWOk',
                        params: { room: roomName }
                    }
                }
                cancelKey = 'Host Access'
                onCancel = { this._onLogin }
                 />
        );
    }

    _onCancel: () => void;

    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancel() {
        this.props.dispatch(cancelWaitForOwner());
    }

    _onLogin: () => void;

    /**
     * Called when the OK button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onLogin() {
        this.props.dispatch(cancelWaitForOwner());
        Linking.openURL("https://hallelujahgospel.com/backoffice/live-events")
        // this.pro
        // this.props.dispatch(_openLoginDialog());
    }
}

/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code WaitForOwnerDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _room: string
 * }}
 */
function _mapStateToProps(state) {
    const { authRequired } = state['features/base/conference'];

    return {
        _room: authRequired && authRequired.getName()
    };
}

export default translate(connect(_mapStateToProps)(WaitForOwnerDialog));
