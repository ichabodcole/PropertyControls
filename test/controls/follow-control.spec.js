import { ControlEvents } from '../../lib/constants';
import BaseControl from '../../lib/controls/BaseControl';
import FollowControl from '../../lib/controls/FollowControl';

describe ('FollowControl', function () {
    var fc, options, model, listener, noop;
    noop = function() { return true; };

    beforeEach(function () {
        options = {
            //events: events,
            controlName: 'FollowControl',
            propertyName: 'myProperty'
        };
        listener = {
            update: function () {

            }
        };
        fc = new FollowControl(options);
    });

    describe ('constructor', function () {
        it ('should not throw an error', function () {
            expect(function () {
                new FollowControl();
            }).not.toThrow();
        });
    });

    describe ('properties', function () {
        describe ('target', function () {
            var control;

            beforeEach(function () {
                control = new BaseControl(options);
            });

            it ('should return undefined if followProperty has not been set', function () {
                expect(fc.target).not.toBeDefined();
            });

            it ('should return a control object if one has been set', function ( ) {
                fc.target = control;
                expect(fc.target).toBe(control);
            });

            it ('should throw an error if not set to a control object', function () {
                expect(function () {
                    fc.target = 'Hello';
                }).toThrow(new Error('FollowControl: target property must be set to an instance of BaseControl'));
            });

            it ('should not be set to a value that is not an instance of BaseControl', function () {
                // Have to wrap this or it will break the test.
                expect(function () {
                    fc.target = 'Hello';
                }).toThrow();

                expect(fc.target).not.toBeDefined();
            });

            it ('should throw an error if set to its own FollowControl object', function () {
                expect(function () {
                    fc.target = fc;
                }).toThrow(new Error('FollowControl: cannot set target to self'));
            });

            it ('should not be set to a value that is it self', function () {
                // Have to wrap this or it will break the test.
                expect(function () {
                    fc.target = fc;
                }).toThrow();

                expect(fc.target).not.toBeDefined();
            });

            xit ('should throw an error if set to a control object with a different propertyName value', function () {
                var otherModel = {
                    propertyName: 'otherProperty'
                };
                var bc = new BaseControl(otherOptions);
                expect(function () {
                    fc.target = bc;
                }).toThrow(new Error('FollowControl: target control must have propertyName:myProperty not propertyName:otherProperty'));
            });

            xit ('should not set the target when set to a control object with a different propertyName property', function ( ){
                var otherModel = {
                    propertyName: 'otherProperty'
                };
                var bc = new BaseControl(otherOptions);
                expect(function () {
                    fc.target = bc;
                }).toThrow();

                expect(fc.target).toBe(undefined);
            });
        });
    });

    describe ('methods', function () {
        var bc;

        beforeEach(function () {
            var bcoptions = {
                controlName: 'FollowControl',
                model: model
            };
            bc = new BaseControl(bcoptions);
        });

        describe ('start', function () {

            it ('should be defined', function () {
                expect(fc.start).toBeDefined();
            });

            it ('should call the on method of the control being followed', function () {
                spyOn(bc, 'on');
                fc.target = bc;
                fc.start();
                expect(fc.target.on).toHaveBeenCalledWith(ControlEvents.VALUE_CHANGE, fc.__targetListener);
            });

            it ('should not do anything if a target is has not been set when called', function () {
                spyOn(bc, 'on');
                fc.start();
                fc.target = bc;
                expect(fc.target.on).not.toHaveBeenCalled();
            });

            it ('should call the emit method with the START event', function () {
                spyOn(fc, 'emit');
                fc.target = bc;
                fc.start();
                expect(fc.emit).toHaveBeenCalledWith(ControlEvents.START);
            });
        });

        describe ('stop', function () {
            it ('should be defined', function () {
                expect(fc.stop).toBeDefined();
            });

            it ('should call the removeListener method of the control being followed', function () {
                spyOn(bc, 'removeListener');
                fc.target = bc;
                fc.start();
                fc.stop();
                expect(fc.target.removeListener).toHaveBeenCalledWith(ControlEvents.VALUE_CHANGE, fc.__targetListener);
            });

            it ('should do nothing if a targetToken has not been set', function () {
                spyOn(bc, 'removeListener');
                fc.target = bc;
                fc.stop();
                expect(fc.target.removeListener).not.toHaveBeenCalled();
            });

            it ('should call the events emit method with the STOP event', function () {
                spyOn(fc, 'emit');
                fc.target = bc;
                fc.start();
                fc.stop();
                expect(fc.emit).toHaveBeenCalledWith(ControlEvents.STOP);
            });
        });

        describe('destroy', function() {
            it('should call the stop method', function() {
                spyOn(fc, 'stop');
                fc.destroy();
                expect(fc.stop).toHaveBeenCalled();
            });
        });

        describe ('on', function() {
            it('should be defined', function() {
                expect(fc.on).toBeDefined();
            });
        });

    });

    describe ('when a follow controls target value changes', function() {
        var bc;
        beforeEach(function () {

            var bcoptions = {
                controlName: 'BaseControl',
            };
            bc = new BaseControl(bcoptions);
        });

        it ('should update the follow controls percent property to match the targets', function() {
            fc.target = bc;
            fc.start();

            bc.value = 0.9;

            expect(fc.percent).toBe(bc.percent);
        });
    });
});
