/**
 * @module polyfills
 */

function objectAssign() {
    if (typeof Object.assign !== 'function') {
      Object.assign = (target, varArgs) => {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        const to = Object(target);

        for (let i = 1; i < arguments.length; i++) {
          const nextSource = arguments[i];

          if (nextSource != null) {
            const keys = Object.keys(nextSource);
            keys.forEach((nextKey) => {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            });
          }
        }
      return to;
    };
  }
}

export default function polyfill(only = []) {
  if (only.length) {
    const polyfills = Object.keys(only);
    polyfills.forEach((fn) => {
      fn();
    });
    return;
  }

  objectAssign();
}
