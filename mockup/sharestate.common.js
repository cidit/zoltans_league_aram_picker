export const protocol = {
    server: {
        /**
         * @param id the id of the user.
         */
        YOU_ARE: "YOU_ARE",
        /**
         * @param changes the changes to be merged into the state
         */
        STATE_CHANGE: "STATE_CHANGE",
        /**
         * @param state the current state in the backend
         */
        STATE: "STATE",
    },
    client: {
        /**
         * @param update an update to the state that the backend should broadcast
         */
        UPDATE: "UPDATE",
    },
}

export const teams = {
    RED: "RED",
    BLUE: "BLUE",
}


/**
 * Simple object check.
 * @source https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param item
 * @returns {boolean}
 */
export function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @source https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
 * @param target
 * @param ...sources
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}