'use strict';

// Import dependencies
import { ControlEvents } from '../constants';
import BaseControl from './BaseControl';

class FollowControl extends BaseControl {

    constructor (options={}) {
        super(options);

        this.controlName = options.controlName || 'Follow Control';
        this.state = FollowControl.STOPPED;

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
        if (this.target != null && this.state === FollowControl.STOPPED) {
            this.target.on(ControlEvents.VALUE_CHANGE, this.__targetListener);
            this.state = FollowControl.ACTIVE;
            this.emit(ControlEvents.START);
        }
    }

    stop () {
        if (this.state === FollowControl.ACTIVE) {
            this.target.removeListener(ControlEvents.VALUE_CHANGE, this.__targetListener);
            this.state = FollowControl.STOPPED;
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

// Control states
FollowControl.ACTIVE  = 'active';
FollowControl.STOPPED = 'stopped';

export { FollowControl };

export default FollowControl;
