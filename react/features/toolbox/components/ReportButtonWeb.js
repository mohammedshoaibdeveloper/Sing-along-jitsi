// @flow

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { translate } from '../../base/i18n';
import { ReportIconWeb } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox';
import { openURLInBrowser } from '../../base/util';


type Props = AbstractButtonProps & {

    /**
     * The URL to the user documenation.
     */
    _userDocumentationURL: string
};


/**
 * Implements an {@link AbstractButton} to open the user documentation in a new window.
 */

class ReportButtonWebb extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.help';
    icon = ReportIconWeb;
    label = 'Report';

    /**
     * Handles clicking / pressing the button, and opens a new window with the user documentation.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        sendAnalytics(createToolbarEvent('help.pressed'));
        openURLInBrowser(`https://hallelujahgospel.com/report/sing-along/${this.props.room}`);
    }
}


/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {Object}
 */
function _mapStateToProps(state: Object) {
    const { userDocumentationURL } = state['features/base/config'].deploymentUrls || {};
    const visible = typeof userDocumentationURL === 'string';

    return {
        _userDocumentationURL: userDocumentationURL,
        room: state['features/base/conference'].room,
        visible: true
    };
}

export default translate(connect(_mapStateToProps)(ReportButtonWebb));
