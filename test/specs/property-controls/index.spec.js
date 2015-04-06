import * as PropertyControls from '../../../lib/index';

describe('Exporting the library', function() {
    describe('RangeControl', function() {
        it('should export the RangeControl class', function() {
            expect(PropertyControls.RangeControl).toBeDefined();
        });

        it('should export the RangeControlEvent object', function() {
            expect(PropertyControls.RangeControlEvent).toBeDefined();
        });
    });

    describe('FollowControl', function() {
        it('should export the FollowControl class', function() {
            expect(PropertyControls.FollowControl).toBeDefined();
        });

        it('should export the FollowControlEvent object', function() {
            expect(PropertyControls.FollowControlEvent).toBeDefined();
        });
    });

    describe('GraphControl', function() {
        it('should export the GraphControl class', function() {
            expect(PropertyControls.GraphControl).toBeDefined();
        });

        it('should export the GraphControlEvent object', function() {
            expect(PropertyControls.GraphControlEvent).toBeDefined();
        });
    });

    describe('OmniControl', function() {
        it('should export the OmniControl class', function() {
            expect(PropertyControls.OmniControl).toBeDefined();
        });

        it('should export the OmniControlEvent object', function() {
            expect(PropertyControls.OmniControlEvent).toBeDefined();
        });
    });

});
