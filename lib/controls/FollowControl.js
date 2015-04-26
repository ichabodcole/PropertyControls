'use strict';

// Import dependencies
import { ControlEvents, ControlStates } from '../constants';
import BaseControl from './BaseControl';

class FollowControl extends BaseControl {

    constructor (options={}) {
        super(options);

        this.controlName = options.controlName || 'Follow Control';
        this.state = ControlStates.STOPPED;

        this.__targetListener = this.__onTargetPercentChange.bind(this);
    }

    validateTarget (controlTarget) {
        if (!(controlTarget instanceof BaseControl)) {
            this.__handleError('target property must be set to an instance of BaseControl');
            return false;
        } else if (this === controlTarget) {
            this.__handleError('cannot set target to self');
            return false;
        } else {
            return true;
        }
    }

    start () {
        if (this.target != null && this.state === ControlStates.STOPPED) {
            this.target.on(ControlEvents.VALUE_CHANGE, this.__targetListener);
            this.state = ControlStates.ACTIVE;
            this.emit(ControlEvents.START);
        }
    }

    stop () {
        if (this.state === ControlStates.ACTIVE) {
            this.target.removeListener(ControlEvents.VALUE_CHANGE, this.__targetListener);
            this.state = ControlStates.STOPPED;
            this.emit(ControlEvents.STOP);
        }
    }

    destroy () {
        this.stop();
        super.destroy();
    }

    get target () {
        return this.model.target;
    }

    set target (targetControl) {
        if (this.validateTarget(targetControl)) {
            this.stop();
            this.model.target = targetControl;
        }
    }


    /*************************************
      *      Internal Methods
    **************************************/

    __onTargetPercentChange(e) {
        this.percent = e.percent;
    }
}

export { FollowControl };

export default FollowControl;
