"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mengerTests = void 0;
var MengerSponge_js_1 = require("../MengerSponge.js");
var Suite_js_1 = require("../../lib/Suite.js");
var canvas = document.getElementById("glCanvas");
/**
 * Creates synthetic events to simulate a mouse drag
 * @param can canvas elemnt
 * @param dx direction in x to drag
 * @param dy direction in y to drag
 * @param frames number of frames to drag
 * @param rightClick true if it is a right click on the mouse
 */
function dragMouse(target, dx, dy, frames, rightClick) {
    if (rightClick === void 0) { rightClick = false; }
    target.dispatchEvent(new MouseEvent("mousedown", { screenX: 0, screenY: 0 }));
    for (var i = 0; i < frames; i++) {
        target.dispatchEvent(new MouseEvent("mousemove", {
            buttons: rightClick ? 2 : 1,
            screenX: dx + i * dx,
            screenY: dy + i * dy
        }));
    }
    target.dispatchEvent(new MouseEvent("mouseup"));
}
/**
 * Creates synthetic events to simulate pressing a button
 * @param keyCode code of the key to press
 * @param times number of times to press the button
 */
function pressKey(target, keyCode, times) {
    for (var i = 0; i < times; i++) {
        target.dispatchEvent(new KeyboardEvent("keydown", { code: keyCode }));
    }
}
/* Create testing environment by linking with browser. */
exports.mengerTests = new Suite_js_1.Tests(canvas, document.getElementById("test-view"));
exports.mengerTests.setup = function (animation) {
    if (animation) {
        animation.reset();
    }
};
exports.mengerTests.cleanup = exports.mengerTests.setup;
/**
 * Tests the isDirty and setClean methods.
 */
exports.mengerTests.unitTest("Menger isDirty/setClean", function () {
    var m = new MengerSponge_js_1.MengerSponge(1);
    // Must be dirty on creation
    Suite_js_1.isTrue(function () { return m.isDirty(); });
    m.setClean();
    Suite_js_1.isTrue(function () { return !m.isDirty(); });
    m.setLevel(2);
    Suite_js_1.isTrue(function () { return m.isDirty(); });
});
/**
 * Tests that the generated geometry is approximately
 * correct.
 */
exports.mengerTests.unitTest("Menger approximate positions/normals/indices", function () {
    var m = new MengerSponge_js_1.MengerSponge(1);
    // Level one
    Suite_js_1.isTrue(function () { return m.normalsFlat().length >= 8 * 3; });
    Suite_js_1.isTrue(function () { return m.indicesFlat().length >= 12 * 3; });
    Suite_js_1.isTrue(function () { return m.positionsFlat().length >= 8 * 3; });
    // Level two
    m.setLevel(2);
    Suite_js_1.isTrue(function () { return m.normalsFlat().length >= 64 * 3; });
    Suite_js_1.isTrue(function () { return m.indicesFlat().length >= 68 * 2 * 3; });
    Suite_js_1.isTrue(function () { return m.positionsFlat().length >= 64 * 3; });
    // Level three. Too much to compute. At least as big as level two.
    m.setLevel(3);
    Suite_js_1.isTrue(function () { return m.normalsFlat().length >= 64 * 3; });
    Suite_js_1.isTrue(function () { return m.indicesFlat().length >= 68 * 2 * 3; });
    Suite_js_1.isTrue(function () { return m.positionsFlat().length >= 64 * 3; });
    // Level three. Too much to compute. At least as big as level two.
    m.setLevel(4);
    Suite_js_1.isTrue(function () { return m.normalsFlat().length >= 64 * 3; });
    Suite_js_1.isTrue(function () { return m.indicesFlat().length >= 68 * 2 * 3; });
    Suite_js_1.isTrue(function () { return m.positionsFlat().length >= 64 * 3; });
});
var _loop_1 = function (i) {
    exports.mengerTests.integrationTest("Menger Sponge Level " + i, "./static/img/menger/level_" + i + "_ref.png", function (animation) {
        animation.reset();
        dragMouse(canvas, 1, -1, 10);
        pressKey(window, "KeyW", 30);
        pressKey(window, "KeyD", 5);
        dragMouse(canvas, -1, 1, 20);
        pressKey(window, "Digit" + i, 1);
        animation.draw();
    });
};
/**
 * Menger Level integration tests
 */
for (var i = 1; i < 5; i++) {
    _loop_1(i);
}
/**
 * Tests the mouse orbital rotation
 */
/*mengerTests.integrationTest(
  "Mouse Orbital Rotation",
  "./static/img/menger/mouse_orbit_rotation_ref.png",
  (animation) => {
    animation.reset();
    pressKey(window, "Digit2", 1);
    pressKey(window, "KeyC", 1);
    dragMouse(canvas, -1, 1, 10);
    animation.draw();

  }
);*/
/**
 * Tests the mouse fps rotation
 */
exports.mengerTests.integrationTest("Mouse FPS Rotation", "./static/img/menger/mouse_fps_rotation_ref.png", function (animation) {
    animation.reset();
    pressKey(window, "Digit2", 1);
    dragMouse(canvas, -1, -1, 10);
    animation.draw();
});
/**
 * Tests mouse zoom in
 */
exports.mengerTests.integrationTest("Mouse Zoom In", "./static/img/menger/mouse_zoom_in_ref.png", function (animation) {
    animation.reset();
    pressKey(window, "Digit2", 1);
    dragMouse(canvas, -1, -1, 35, true);
    animation.draw();
});
/**
 * Tests mouse zoom out
 */
exports.mengerTests.integrationTest("Mouse Zoom Out", "./static/img/menger/mouse_zoom_out_ref.png", function (animation) {
    animation.reset();
    pressKey(window, "Digit2", 1);
    dragMouse(canvas, -1, 1, 35, true);
    animation.draw();
});
/**
 * Tests W key Orbital Mode
 */
/*mengerTests.integrationTest(
  "W Key (Orbital Mode)",
  "./static/img/menger/w_orbital_ref.png",
  (animation) => {
    animation.reset();
    pressKey(window, "Digit2", 1);
    pressKey(window, "KeyC", 1);
    pressKey(window, "KeyW", 35);
    animation.draw();
  }
);*/
/**
 * Tests W Key in FPS Mode
 */
exports.mengerTests.integrationTest("W Key (FPS Mode)", "./static/img/menger/w_fps_ref.png", function (animation) {
    animation.reset();
    pressKey(window, "Digit2", 1);
    dragMouse(canvas, 1, 0, 5);
    pressKey(window, "KeyW", 30);
    animation.draw();
});
/**
 * Tests S key Orbital Mode
 */
/*mengerTests.integrationTest(
  "S Key (Orbital Mode)",
  "./static/img/menger/s_orbital_ref.png",
  (animation) => {
    animation.reset();
    pressKey(window, "Digit2", 1);
    pressKey(window, "KeyC", 1);
    pressKey(window, "KeyS", 35);
    animation.draw();
  }
);*/
/**
 * Tests S Key in FPS Mode
 */
exports.mengerTests.integrationTest("S Key (FPS Mode)", "./static/img/menger/s_fps_ref.png", function (animation) {
    animation.reset();
    pressKey(window, "Digit2", 1);
    dragMouse(canvas, 1, 0, 10);
    pressKey(window, "KeyS", 30);
    animation.draw();
});
/**
 * Tests A key Orbital Mode
 */
/*mengerTests.integrationTest(
  "A Key (Orbital Mode)",
  "./static/img/menger/a_orbital_ref.png",
  (animation) => {
    animation.reset();
    pressKey(window, "Digit2", 1);
    pressKey(window, "KeyW", 35);
    pressKey(window, "KeyC", 1);
    pressKey(window, "KeyA", 5);
    animation.draw();
  }
);*/
/**
 * Tests A Key in FPS Mode
 */
exports.mengerTests.integrationTest("A Key (FPS Mode)", "./static/img/menger/a_fps_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        pressKey(window, "KeyW", 35);
        pressKey(window, "KeyA", 10);
        animation.draw();
    }
});
/**
 * Tests D key Orbital Mode
 */
/*mengerTests.integrationTest(
  "D Key (Orbital Mode)",
  "./static/img/menger/d_orbital_ref.png",
  (animation) => {
    if (animation) {
      animation.reset();
      pressKey(window, "Digit2", 1);
      pressKey(window, "KeyW", 35);
      pressKey(window, "KeyC", 1);
      pressKey(window, "KeyD", 5);
      animation.draw();
    }
  }
);*/
/**
 * Tests D Key in FPS Mode
 */
exports.mengerTests.integrationTest("D Key (FPS Mode)", "./static/img/menger/d_fps_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        pressKey(window, "KeyW", 35);
        pressKey(window, "KeyD", 10);
        animation.draw();
    }
});
/**
 * Tests left arrow key
 */
exports.mengerTests.integrationTest("Left Arrow Key", "./static/img/menger/left_arrow_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        //dragMouse(canvas, -1, 1, 15);
        pressKey(window, "ArrowLeft", 10);
        animation.draw();
    }
});
/**
 * Tests right arrow key
 */
exports.mengerTests.integrationTest("Right Arrow Key", "./static/img/menger/right_arrow_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        //dragMouse(canvas, -1, 1, 15);
        pressKey(window, "ArrowRight", 10);
        animation.draw();
    }
});
/**
 * Tests Up arrow key in orbital mode
 */
/*mengerTests.integrationTest(
  "Up Arrow Key (Orbital Mode)",
  "./static/img/menger/up_arrow_orbital_ref.png",
  (animation) => {
    if (animation) {
      animation.reset();
      pressKey(window, "Digit2", 1);
      pressKey(window, "KeyC", 1);
      pressKey(window, "ArrowUp", 4);
      animation.draw();
    }
  }
);*/
/**
 * Tests up arrow in fps mode
 */
exports.mengerTests.integrationTest("Up Arrow Key (FPS Mode)", "./static/img/menger/up_arrow_fps_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        pressKey(window, "ArrowUp", 13);
        animation.draw();
    }
});
/**
 * Tests down arrow key in orbital mode
 */
/*mengerTests.integrationTest(
  "Down Arrow Key (Orbital Mode)",
  "./static/img/menger/down_arrow_orbital_ref.png",
  (animation) => {
    if (animation) {
      animation.reset();
      pressKey(window, "Digit2", 1);
      pressKey(window, "KeyC", 1);
      pressKey(window, "ArrowDown", 4);
      animation.draw();
    }
  }
);*/
/**
 * Tests down arrow in fps mode
 */
exports.mengerTests.integrationTest("Down Arrow Key (FPS Mode)", "./static/img/menger/down_arrow_fps_ref.png", function (animation) {
    if (animation) {
        animation.reset();
        pressKey(window, "Digit2", 1);
        pressKey(window, "ArrowDown", 10);
        animation.draw();
    }
});
//# sourceMappingURL=MengerTests.js.map