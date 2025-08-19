/**
 * Delete all keys from the given object except for the specified keys.
 *
 * @param {Object} obj - The object from which to delete keys.
 * @param {string[]} keysToPreserve - An array of keys to preserve.
 * @return {void} This function does not return a value.
 */
export const deleteKeysExcept = (obj, keysToPreserve) => {
    // Loop through each key in the object
    for (const key in obj) {
        // If the current key is not in the list of keys to preserve, delete it from the object
        if (!keysToPreserve.includes(key)) {
            delete obj[key];
        }
    }
}
