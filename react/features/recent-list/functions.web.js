/* global interfaceConfig */

import { parseURIString, safeDecodeURIComponent } from '../base/util';


function safeStartCase(s = '') {
    return _.words(`${s}`.replace(/['\u2019]/g, '')).reduce(
        (result, word, index) => result + (index ? ' ' : '') + _.upperFirst(word)
        , '');
}


/**
 * Transforms the history list to a displayable list.
 *
 * @private
 * @param {Array<Object>} recentList - The recent list form the redux store.
 * @returns {Array<Object>}
 */
export function toDisplayableList(recentList) {
    return (
        recentList.slice(-3).reverse()
            .map(item => {
                return {
                    date: item.date,
                    duration: item.duration,
                    time: [ item.date ],
                    title: safeStartCase(safeDecodeURIComponent(parseURIString(item.conference).room)),
                    url: item.conference.split('?jwt=')[0]
                };
            }));
}

/**
 * Returns <tt>true</tt> if recent list is enabled and <tt>false</tt> otherwise.
 *
 * @returns {boolean} <tt>true</tt> if recent list is enabled and <tt>false</tt>
 * otherwise.
 */
export function isRecentListEnabled() {
    return interfaceConfig.RECENT_LIST_ENABLED;
}
