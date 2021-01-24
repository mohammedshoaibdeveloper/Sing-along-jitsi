// @flow

import { 
    SET_JWT,
    RECORDING_EVENT_ID,
    RECORDING_EVENT_SLUG
} from './actionTypes';

/**
 * Stores a specific JSON Web Token (JWT) into the redux store.
 *
 * @param {string} [jwt] - The JSON Web Token (JWT) to store.
 * @returns {{
 *     type: SET_TOKEN_DATA,
 *     jwt: (string|undefined)
 * }}
 */
export function setJWT(jwt: ?string) {
    return {
        type: SET_JWT,
        jwt
    };
}

export function setEventId(eventId: ?integer) {
    return {
        type: RECORDING_EVENT_ID,
        eventId
    };
}

export function setEventSlug(eventSlug: ?string) {
    return {
        type: SET_JWT,
        eventSlug
    };
}
