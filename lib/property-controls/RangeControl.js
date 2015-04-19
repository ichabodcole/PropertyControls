'use strict';

import BaseControl from './BaseControl';

class RangeControl extends BaseControl {

    // Constructor init code
    constructor (options={}) {
        super(options);
        this.controlName = options.controlName || 'Range Control';
    }
}

export { RangeControl };
export default RangeControl;
