'use strict';
// Import dependencies
import { BaseControl, BaseControlEvent } from './BaseControl';

// Event String Constants
export var FollowControlEvent = Object.assign({
    START: 'control:follow_start',
    STOP: 'control:follow_stop'
}, BaseControlEvent);

export class FollowControl extends BaseControl {

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
            this.target.on(FollowControlEvent.VALUE_CHANGE, this.__targetListener);
            this.state = FollowControl.ACTIVE;
            this.emit(FollowControlEvent.START);
        }
    }

    stop () {
        if (this.state === FollowControl.ACTIVE) {
            this.target.removeListener(FollowControlEvent.VALUE_CHANGE, this.__targetListener);
            this.state = FollowControl.STOPPED;
            this.emit(FollowControlEvent.STOP);
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
FollowControl.ACTIVE  = 'follow:active';
FollowControl.STOPPED = 'follow:stopped';

export default FollowControl;
