YUI.add('scrollview-base-unit-tests', function (Y, NAME) {

    var DURATION = 1,
        SLOW_DURATION = 1000,
        WAIT = 5000,
        simulateMousewheel = Y.simulateMousewheel,
        baseTestSuite = new Y.Test.Suite("Scrollview Base Tests"),
        unitTestSuite = new Y.Test.Suite("Unit Tests"),
        unitTestSuiteDev = new Y.Test.Suite("In development tests"),
        functionalTestSuite = new Y.Test.Suite("Functional Tests");

    unitTestSuite.add(new Y.Test.Case({
        name: "Lifecycle",

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Ensure initial state is correct": function () {
            var scrollview = renderNewScrollview('x'),
                attrs = Y.ScrollView.ATTRS;

            // Loop through each ATTR and ensure its value matches the default to ensure any setters work properly.
            Y.Object.each(attrs, function (data, attr) {
                var val;

                if (data.value !== undefined) {
                    val = data.value;
                    if (Y.Lang.isObject(val)) {
                        Y.ObjectAssert.areEqual(val, scrollview.get(attr));  // areEqual is deprecated, but still works
                    }
                    else {
                        Y.Assert.areEqual(val, scrollview.get(attr));
                    }
                }
            });
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Attributes",

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Deprecated static values should set appropriate ATTRs": function () {

            Y.ScrollView.FRAME_STEP = 1;
            Y.ScrollView.SNAP_DURATION = 2;
            Y.ScrollView.SNAP_EASING = 3;
            Y.ScrollView.EASING = 'cubic-bezier(0, 0, 0, 0)';
            Y.ScrollView.BOUNCE_RANGE = 5;

            var scrollview = renderNewScrollview('x');

            Y.Assert.areEqual(Y.ScrollView.FRAME_STEP, scrollview.get('frameDuration'));
            Y.Assert.areEqual(Y.ScrollView.SNAP_DURATION, scrollview.get('snapDuration'));
            Y.Assert.areEqual(Y.ScrollView.SNAP_EASING, scrollview.get('snapEasing'));
            Y.Assert.areEqual(Y.ScrollView.EASING, scrollview.get('easing'));
            Y.Assert.areEqual(Y.ScrollView.BOUNCE_RANGE, scrollview.get('bounceRange'));
        },

        // Axis setters
        "Forced axis to X should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('x');

            Y.Assert.areEqual(true, scrollview.get('axis').x);
            Y.Assert.areEqual(false, scrollview.get('axis').y);
        },

        "Forced axis to Y should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('y');

            Y.Assert.areEqual(false, scrollview.get('axis').x);
            Y.Assert.areEqual(true, scrollview.get('axis').y);
        },

        "Forced axis to XY should evaluate properly": function () {
            var Test = this,
                scrollview = renderNewScrollview('xy');

            Y.Assert.areEqual(true, scrollview.get('axis').x);
            Y.Assert.areEqual(true, scrollview.get('axis').y);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Rendering",

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Ensure initial rendering is correct": function () {
            var scrollview = renderNewScrollview('x'),
                bb = scrollview.get('boundingBox'),
                cb = scrollview.get('contentBox'),
                id = cb.get('id'),
                ul = cb.all('> ul'),
                li = cb.all('> ul > li');

                Y.Assert.areEqual(10, li.size());
                Y.Assert.isTrue(bb.hasClass('yui3-scrollview'), "BoundingBox does not contain class 'yui3-scrollview'");
                Y.Assert.isTrue(cb.hasClass('yui3-scrollview-content'), "ContentBox does not contain class 'yui3-scrollview-content'");
                Y.Assert.isTrue(bb.hasClass('yui3-scrollview-horiz'), "BoundingBox does not contain class 'yui3-scrollview-horiz'");
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Public API",

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        // Scroll{X/Y} setters
        "set('scrollX') to a positive distance should move it that distance": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 20;

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
            scrollview.set('scrollX', distance);
            Y.Assert.areEqual(distance, scrollview.get('scrollX'));
        },

        "set('scrollY') to a positive distance should move it that distance": function () {
            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = 20;

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview.set('scrollY', distance);
            Y.Assert.areEqual(distance, scrollview.get('scrollY'));
        },

        // scrollTo
        "scrollTo on X should scroll": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.get('scrollX'));
                });
            });

            scrollview.scrollTo(distance, null, DURATION);

            Test.wait(WAIT);
        },

        "scrollTo on Y should scroll": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.get('scrollY'));
                });
            });

            scrollview.scrollTo(null, distance, DURATION);

            Test.wait(WAIT);
        },

        // Properties
        "lastScrolledAmt should be correct": function () {

            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(distance, scrollview.lastScrolledAmt);
                });
            });

            scrollview.set('scrollX', distance, {duration: 10});

            Test.wait(WAIT);
        },

        "Disabled scrollview should not scroll with scrollTo": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.set('disabled', true);
            scrollview.scrollTo(distance, null);
            scrollview.set('scrollY', distance);

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });
            Test.wait(WAIT);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Events",

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Ensure the 'scrollEnd' event fires": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = scrollview._maxScrollX,
                eventsFired = 0;

            // Ensure scrollEnd fires
            scrollview.once('scrollEnd', function () {
                eventsFired++;
                Y.Assert.areEqual(distance, scrollview.get('scrollX'));
                Y.Assert.areEqual(0, scrollview.get('scrollY'));
                Y.Assert.areEqual(1, eventsFired);
            });

            scrollview.scrollTo(distance, 0, DURATION); // args = x, y, duration, easing
        },

        "Widget resize should trigger heightChange": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                eventsFired = 0;

            // Ensure scrollEnd fires
            scrollview.after('heightChange', function () {
                Y.later(100, scrollview, function () {
                    Test.resume(function () {
                        eventsFired++;
                        Y.Assert.areEqual(1, eventsFired);
                    });
                });
            });

            Y.later(10, scrollview, function () {
                scrollview.set('height', 123);
            });

            Test.wait(WAIT);
        }
    }));

    /**
     * The following tests would qualify as functional tests and should
     * probably be moved into a different (non-CI) directory.
     * They currently pass, so leaving here until better coverage can
     * be obtained in the -unit- tests (above).
     */
    functionalTestSuite.add(new Y.Test.Case({
        name: "Movement",
        _should: {
            ignore: {
                // Ignore PhantomJS and IE because lack of gesture simulation support/issues
                "Flick x should provide the correct reaction": (Y.UA.phantomjs || Y.UA.ie),
                "Move right on X should move the content right": (Y.UA.phantomjs || Y.UA.ie),
                "Move left on X should snap back": (Y.UA.phantomjs || Y.UA.ie),
                "Move down on Y should move the content at least that distance": (Y.UA.phantomjs || Y.UA.ie),
                "Move up on Y should bounce back": (Y.UA.phantomjs || Y.UA.ie),

                // Mousewheel emulation is currently only supported in Chrome
                "mousewheel down should move the SV down" : (Y.UA.phantomjs || Y.UA.ie || Y.UA.gecko || Y.UA.android)
            }
        },

        setUp : function () { /* Empty */ },
        tearDown : function () {
            // this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        // Gesture: move
        "Move right on X should move the content right": function () {

            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 1000;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    if (scrollview.get('scrollX') >= 50) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail();
                    }
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: -(distance)
                },
                duration: SLOW_DURATION
            });

            Test.wait(WAIT);
        },

        "Move left on X should snap back": function () {

            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 1000;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    xdist: distance
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        },

        "Move down on Y should move the content at least that distance": function () {

            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = 500;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    if (scrollview.get('scrollY') >= distance) {
                        Y.Assert.pass();
                    }
                    else {
                        Y.Assert.fail("scrollX offset not large enough");
                    }
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    ydist: -(distance)
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        },

        "Move up on Y should bounce back": function () {

            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = 500;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    ydist: distance
                },
                duration: DURATION
            });

            Test.wait(WAIT);
        },

        // Gesture: flick
        "Flick x should provide the correct reaction": function () {

            var Test = this,
                scrollview = renderNewScrollview('x'),
                expected = 1400,
                scrollX;

            scrollview.on('scrollEnd', function () {
                Test.resume(function () {
                    scrollX = scrollview.get('scrollX');

                    // depending on browser activity, scrollX won't always be exactly at the end (sometimes a few pixels shy), so we'll give it a large buffer
                    (scrollX > expected) ? Y.Assert.pass() : Y.Assert.fail('scrollX - expected: ' + expected + ', actual: ' + scrollX);
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                });
            });

            scrollview.get('contentBox').simulateGesture('flick', {
                distance: -15000,
                axis: 'x'
            });

            Test.wait(WAIT);
        },

        "Disabled flick should not scroll": function () {

            var Test = this,
                scrollview = renderNewScrollview('x');

            scrollview.set('flick', false);
            scrollview.get('contentBox').simulateGesture('flick', {
                distance: -100,
                axis: 'x'
            });

            Y.later(200, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        // Disabled
        "Disabled drag should not scroll": function () {
            var Test = this,
                scrollview = renderNewScrollview('y'),
                distance = 500;

            scrollview.set('drag', false);
            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    ydist: distance
                },
                duration: SLOW_DURATION
            });

            Y.later(200, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                });
            });

            Test.wait(WAIT);
        },

        "Disabled scrollview should not scroll with gesture": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 500;

            scrollview.set('disabled', true);
            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    ydist: distance
                },
                duration: SLOW_DURATION
            });

            Y.later(200, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollY'));
                });
            });

            Test.wait(WAIT);
        },

        "Disabled scrollview should not move on gesture": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                distance = 100;

            scrollview.set('disabled', true);

            scrollview.get('contentBox').simulateGesture('move', {
                path: {
                    ydist: -(distance)
                },
                duration: DURATION
            });

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        "Move gesture while flicking should stop flick": function () {
            var Test = this,
                scrollview = renderNewScrollview('x'),
                stop1, stop2;

            // flick example from the center of the node, move 50 pixels down for 50ms)
            scrollview.get('contentBox').simulateGesture("flick", {
                axis: 'x',
                distance: -100
            });

            Y.later(500, this, function () {
                stop1 = scrollview.get('scrollX');
                scrollview.get('contentBox').simulateGesture('move', {
                    path: {
                        xdist: 100
                    },
                    duration: SLOW_DURATION
                }, function () {
                    Test.resume(function () {
                        stop2 = scrollview.get('scrollX');

                        // 50 is a generous threshold to limit false-positives. It's typically <10, ideally 0.
                        if (Math.abs(stop1 - stop2) < 50) {
                            Y.Assert.pass();
                        }
                        else {
                            Y.Assert.fail("Stop offset differences were too large");
                        }
                    });
                });
            });

            Test.wait(WAIT);
        },

        "mousewheel down should move the SV down": function () {
            var Test = this,
                scrollview = renderNewScrollview('x');

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    Y.Assert.areEqual(10, scrollview.get('scrollY'));
                    Y.Assert.areEqual(0, scrollview.get('scrollX'));
                });
            });

            Y.later(100, null, function () {
                simulateMousewheel(Y.one("#container li"), true);
            });

            Test.wait(WAIT);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture start",

        setUp : function () {
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(0, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "Disabled scrollviews should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            scrollview.set('disabled', true);

            response = scrollview._onGestureMoveStart(mockEvent);
            Y.Assert.isFalse(response);
        },

        "Gesture start should create a _gesture object" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            response = scrollview._onGestureMoveStart(mockEvent);

            gesture = scrollview._gesture;

            Y.Assert.isNull(null, gesture.axis);
            Y.Assert.areEqual(0, gesture.startX);
            Y.Assert.areEqual(0, gesture.startY);
            Y.Assert.areEqual(0, gesture.startClientX);
            Y.Assert.isNull(gesture.endClientX);
            Y.Assert.isNull(gesture.endClientY);
            Y.Assert.isNull(gesture.deltaX);
            Y.Assert.isNull(gesture.deltaY);
            Y.Assert.isNull(gesture.flick);
            Y.Assert.isObject(gesture.onGestureMove);
            Y.Assert.isObject(gesture.onGestureMoveEnd);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.start = true;

            response = scrollview._onGestureMoveStart(mockEvent);

            Y.Mock.verify(mockEvent);
        },

        "Flicks should cancel any flicks in progress" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                canceledFlicks = 0,
                response;

            scrollview._flickAnim = {
                cancel: function () {
                    canceledFlicks += 1;
                }
            };

            response = scrollview._onGestureMoveStart(mockEvent);
            Y.Assert.isUndefined(scrollview._flickAnim);
            Y.Assert.areEqual(1, canceledFlicks);
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture X",

        setUp : function () {
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(2, 0);
            this.scrollview._gesture = getMockGestureObject(null, 5, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.start = true;

            response = scrollview._onGestureMove(mockEvent);

            Y.Mock.verify(mockEvent);
        },

        "gesture on X should update the scrollX values" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;
            response = scrollview._onGestureMove(mockEvent);

            Y.Assert.areEqual(3, scrollview._gesture.deltaX);
            Y.Assert.areEqual(0, scrollview._gesture.deltaY);
            Y.Assert.areEqual(8, scrollview.get('scrollX'));
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
        }
    }));

    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture Y",

        setUp : function () {
            this.scrollview = renderNewScrollview('y');
            this.mockEvent = getMockGestureEvent(0, 3);
            this.scrollview._gesture = getMockGestureObject('y', 0, 6);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "scrollview._prevent.start should preventDefault" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview._prevent.end = true;

            response = scrollview._onGestureMoveEnd(mockEvent);

            Y.Mock.verify(mockEvent);
        }
    }));



    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - gesture end",

        setUp : function () {
            this.scrollview = renderNewScrollview('x');
            this.mockEvent = getMockGestureEvent(3, 0);
            this.scrollview._gesture = getMockGestureObject(null, 6, 0);
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "gesture on X should update the scrollX values" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = this.mockEvent,
                response;

            scrollview.once('scrollEnd', function () {
                Test.resume(function () {
                    // If the test gets here, everything passed.
                    Y.Assert.isTrue(true);
                });
            });

            Y.later(1, null, function () {
                response = scrollview._onGestureMoveEnd(mockEvent);
            });

            Test.wait(WAIT);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - flick",

        setUp : function () {
            this.scrollview = renderNewScrollview('x');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "flick on a disabled instance should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview.set('disabled', true);

            response = scrollview._flick();

            Y.Assert.isFalse(response);
        },

        "flick should bar" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');


            response = scrollview._flick({
                flick: {
                    axis: 'x',
                    velocity: '-1'
                }
            });

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        "_flickFrame on X should set scrollX with the correct value" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview._flickFrame(-0.02, 'x', 0);
            Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
            Y.Assert.areEqual(0, scrollview.get('scrollY'));

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollX'));
                });
            });

            Test.wait(WAIT);
        },

        "_flickFrame on Y should set scrollX with the correct value" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y');

            scrollview._flickFrame(-0.02, 'y', 0);
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
            Y.Assert.areNotEqual(0, scrollview.get('scrollY'));

            Y.later(100, this, function () {
                Test.resume(function () {
                    Y.Assert.areNotEqual(0, scrollview.get('scrollY'));
                });
            });

            Test.wait(WAIT);
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - snap",

        setUp : function () {
            this.scrollview = renderNewScrollview('x');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "snapBack on X should work properly" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('x');

            scrollview.set('scrollX', -100);
            Y.Assert.areEqual(-100, scrollview.get('scrollX'));
            scrollview._snapBack();
            Y.Assert.areEqual(0, scrollview.get('scrollX'));
        },

        "snapBack on Y should work properly" : function () {
            var Test = this,
                scrollview = this.scrollview = renderNewScrollview('y');

            scrollview.set('scrollY', -100);
            Y.Assert.areEqual(-100, scrollview.get('scrollY'));
            scrollview._snapBack();
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
        }
    }));


    unitTestSuite.add(new Y.Test.Case({
        name: "Mock event - mousewheel",

        setUp : function () {
            this.scrollview = renderNewScrollview('y');
        },

        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },

        "mousewheel up from 0 should do nothing" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        },

        "mousewheel up from 10 should move the Y offset to 0" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            scrollview.set('scrollY', 10);
            Y.Assert.areEqual(10, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        },

        "mousewheel down from 0 should move the Y offset down" : function () {
            var Test = this,
                scrollview = this.scrollview,
                mockEvent = getMockMousewheelEvent(-1, this.scrollview.get('boundingBox'));

            Y.Mock.expect(mockEvent, {
                method: 'preventDefault'
            });

            Y.Assert.areEqual(0, scrollview.get('scrollY'));
            scrollview._mousewheel(mockEvent);
            Y.Assert.areEqual(10, scrollview.get('scrollY'));
            Y.Mock.verify(mockEvent);
        }
    }));




    if (unitTestSuiteDev.items.length > 0) {
        baseTestSuite.add(unitTestSuiteDev);
    }
    else {
        baseTestSuite.add(unitTestSuite);
        baseTestSuite.add(functionalTestSuite);
    }

    Y.Test.Runner.add(baseTestSuite);

    /*
    unitTestSuiteDev = new Y.Test.Suite();
    Y.Test.Runner.add(unitTestSuiteDev);
    unitTestSuiteDev.add(new Y.Test.Case({
        name: "In Development",
        tearDown : function () {
            this.scrollview.destroy();
            Y.one('#container').empty(true);
        },
    }));
    */

    /*
        Additional test ideas:
        - Don't scroll Y if a X axis
        - Don't scroll X if a Y axis
        - sv._prevent.start
        - sv._prevent.end
        - Flick while already executing a flick
        - Forced axis vs auto-detection
        - Make sure scrollEnd only fires once
        - setScroll after disabling
        - Flick while flicking
        - swipe to OOB
    */

    function getMockMousewheelEvent (delta, target) {
        var mock = new Y.Test.Mock();
        mock.wheelDelta = delta;
        mock.target = target;
        mock.preventDefault = function () {};
        return mock;
    }

    function getMockGestureEvent (x, y) {
        var mock = new Y.Test.Mock();
        mock.clientX = x;
        mock.clientY = y;
        mock.preventDefault = function () {};

        return mock;
    }

    function getMockGestureObject (axis, x, y) {
        return {
            axis: axis,
            startX: x,
            startY: y,
            startClientX: x,
            startClientY: y,
            onGestureMove: {
                detach: function () {}
            },
            onGestureMoveEnd: {
                detach: function () {}
            }
        };
    }

    function renderNewScrollview (axis) {
        var config = {},
            guid = Y.guid(),
            html,
            scrollview,
            widgetClass;

        config.srcNode = '#' + guid;

        if (axis === 'y') {
            config.axis = axis;
            config.height = "100px";
            widgetClass = 'vertical';
        }
        else if (axis === 'x') {
            config.axis = axis;
            config.width = "300px";
            widgetClass = 'horizontal';
        }
        else {
            config.height = "100px";
            config.width = "300px";
            widgetClass = 'horizontal';
        }

        html = "<div class='" + widgetClass + "'><div id='" + guid + "'><ul><li>a</li><li>b</li><li>c</li><li>e</li><li>f</li><li>g</li><li>h</li><li>i</li><li>j</li><li>k</li></ul></div></div>",
        Y.one('#container').append(html);

        scrollview = new Y.ScrollView(config);
        scrollview.render();

        return scrollview;
    }

    /*
    Not possible until (if) bounding constraints are added to scrollTo.  Difficult because
    that is also an internal API that needs to be able to overscroll at times (drags, then snapback)

    "scrollTo above the max width should move it to max X": function () {
        var Test = this,
            scrollview = renderNewScrollview(false),
            bounds = scrollview._getBounds();

        scrollview.on('scrollEnd', function () {
            Test.resume(function () {
                Y.Assert.areEqual(2700, scrollview.get('scrollX'));
            })
        });

            // Assume it starts @ 0
            Y.Assert.areEqual(0, scrollview.get('scrollX'));

            scrollview.scrollTo(2700, null, DURATION);

        Test.wait(WAIT);
    },

    "scrollTo above the max height should move it to max Y": function () {
        var Test = this,
            scrollview = renderNewScrollview(false),
            max = scrollview._maxScrollY;

        scrollview.on('scrollEnd', function () {
            Test.resume(function () {
                Y.Assert.areEqual(max, scrollview.get('scrollX'));
            })
        });

        // Assume it starts @ 0
        Y.Assert.areEqual(0, scrollview.get('scrollY'));

        scrollview.scrollTo(null, max+1, DURATION);

        Test.wait(WAIT);
    },
    */

}, null, {requires: ['test', 'node-event-simulate', 'scrollview-base', 'scrollview-mousewheel-simulate']});
