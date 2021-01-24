// @flow

import _ from 'lodash';
import React from "react"

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { openDialog } from "../../base/dialog"
import { 
    isLocalParticipantModerator, 
    _getAllParticipants, 
    kickParticipant,
    getLocalParticipant
} from "../../base/participants"

import { AbstractHangupButton } from '../../base/toolbox';
import { HangupDialog }  from "../../remote-video-menu"
import type { AbstractButtonProps } from '../../base/toolbox';

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
        _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._hangup = () => {
            sendAnalytics(createToolbarEvent('hangup'));

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {

                console.log("here")
                // this.props.dispatch(openDialog(this.props._isLocalBuddyModerator ? CallEndPopOver : EndCallForUser, {
                //     open: true,
                //     isModerator: this.props._isLocalBuddyModerator,
                //     ...this.props
                // }))
                // this.props.dispatch(appNavigate(undefined));
            } else {
                // this.props.dispatch(openDialog(HangupDialog))
                this.props.dispatch(disconnect(true));
            }
        };
    }

    /**
     * Helper function to end the meeting if moderator has ended the call
     * @override
     * @protected
     * @returns {void}
     */
    _endCall() {
        let participants = this.props._allParticipants;
        participants = participants.filter(participant => participant.id != this.props._localParticipant.id)
        participants.forEach(participant => {
            this.props.dispatch(kickParticipant(participant.id))
        })
    }
    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        console.log("@@@@@@@@@@@@2", "here")
        this._hangup();
    }
}

function _mapStateToProps(state: Object) {
    return {
        _allParticipants: _getAllParticipants(state),
        _isLocalBuddyModerator: isLocalParticipantModerator(state),
        _localParticipant: getLocalParticipant(state)
    }
}

export default translate(connect(_mapStateToProps)(HangupButton));
