"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUI = void 0;
var Camera_js_1 = require("../lib/webglutils/Camera.js");
var TSM_js_1 = require("../lib/TSM.js");
/**
 * Handles Mouse and Button events along with
 * the the camera.
 */
var GUI = /** @class */ (function () {
    /**
     *
     * @param canvas required to get the width and height of the canvas
     * @param animation required as a back pointer for some of the controls
     * @param sponge required for some of the controls
     */
    function GUI(canvas, animation, sponge) {
        this.height = canvas.height;
        this.width = canvas.width;
        this.prevX = 0;
        this.prevY = 0;
        this.sponge = sponge;
        this.animation = animation;
        this.reset();
        this.registerEventListeners(canvas);
    }
    /**
     * Resets the state of the GUI
     */
    GUI.prototype.reset = function () {
        this.fps = false;
        this.dragging = false;
        /* Create camera setup */
        this.camera = new Camera_js_1.Camera(new TSM_js_1.Vec3([0, 0, -6]), new TSM_js_1.Vec3([0, 0, 0]), new TSM_js_1.Vec3([0, 1, 0]), 45, this.width / this.height, 0.1, 1000.0);
    };
    /**
     * Sets the GUI's camera to the given camera
     * @param cam a new camera
     */
    GUI.prototype.setCamera = function (pos, target, upDir, fov, aspect, zNear, zFar) {
        this.camera = new Camera_js_1.Camera(pos, target, upDir, fov, aspect, zNear, zFar);
    };
    /**
     * Returns the view matrix of the camera
     */
    GUI.prototype.viewMatrix = function () {
        return this.camera.viewMatrix();
    };
    /**
     * Returns the projection matrix of the camera
     */
    GUI.prototype.projMatrix = function () {
        return this.camera.projMatrix();
    };
    /**
     * Callback function for the start of a drag event.
     * @param mouse
     */
    GUI.prototype.dragStart = function (mouse) {
        this.dragging = true;
        this.prevX = mouse.screenX;
        this.prevY = mouse.screenY;
    };
    /**
     * The callback function for a drag event.
     * This event happens after dragStart and
     * before dragEnd.
     * @param mouse
     */
    GUI.prototype.drag = function (mouse) {
        if (this.dragging == true) {
            var xDelta = mouse.screenX - this.prevX;
            var yDelta = mouse.screenY - this.prevY;
            if (xDelta != 0 || yDelta != 0) {
                var delta = new TSM_js_1.Vec4([2 * xDelta / this.width, -2 * yDelta / this.height, 0.0, 0.0]);
                var camVector = this.projMatrix().inverse().multiplyVec4(delta);
                var worldVector = this.viewMatrix().inverse().multiplyVec4(camVector);
                //This is a world cord function
                var newVec = new TSM_js_1.Vec3([worldVector.x, worldVector.y, worldVector.z]);
                this.camera.rotate(TSM_js_1.Vec3.cross(this.camera.forward().negate(), newVec), GUI.rotationSpeed);
            }
            this.prevX = mouse.screenX;
            this.prevY = mouse.screenY;
        }
    };
    /**
     * Callback function for the end of a drag event
     * @param mouse
     */
    GUI.prototype.dragEnd = function (mouse) {
        this.dragging = false;
        this.prevX = 0;
        this.prevY = 0;
    };
    /**
     * Callback function for a key press event
     * @param key
     */
    GUI.prototype.onKeydown = function (key) {
        switch (key.code) {
            case "KeyW": {
                this.camera.offset(this.camera.forward(), -GUI.zoomSpeed, true);
                break;
            }
            case "KeyA": {
                this.camera.offset(this.camera.right().scale(-1), GUI.panSpeed, true);
                break;
            }
            case "KeyS": {
                this.camera.offset(this.camera.forward(), GUI.zoomSpeed, true);
                break;
            }
            case "KeyD": {
                this.camera.offset(this.camera.right(), GUI.panSpeed, true);
                break;
            }
            case "KeyR": {
                this.camera.orbitTarget(new TSM_js_1.Vec3([0, 1, 0]), .5);
                break;
            }
            case "ArrowLeft": {
                this.camera.roll(GUI.rollSpeed);
                break;
            }
            case "ArrowRight": {
                this.camera.roll(GUI.rollSpeed, true);
                break;
            }
            case "ArrowUp": {
                this.camera.offset((this.camera.up()), GUI.panSpeed, true); //i think this is working
                break;
            }
            case "ArrowDown": {
                this.camera.offset((this.camera.up().scale(-1)), GUI.panSpeed, true); //i dont think this is working
                break;
            }
            case "Digit1": {
                console.log("Key : '", key.code, "' was pressed.");
                this.sponge.setLevel(1);
                //this.sponge.dirty=true;
                break;
            }
            case "Digit2": {
                console.log("Key : '", key.code, "' was pressed.");
                this.sponge.setLevel(2);
                //this.sponge.dirty=true;
                break;
            }
            case "Digit3": {
                console.log("Key : '", key.code, "' was pressed.");
                this.sponge.setLevel(3);
                //this.sponge.dirty=true;
                break;
            }
            case "Digit4": {
                console.log("Key : '", key.code, "' was pressed.");
                this.sponge.setLevel(4);
                //this.sponge.dirty=true;
                break;
            }
            case "KeyE": {
                this.camera.orbitTarget(new TSM_js_1.Vec3([1, 0, 0]), 5);
            }
            default: {
                console.log("Key : '", key.code, "' was pressed.");
                break;
            }
        }
    };
    /**
     * Registers all event listeners for the GUI
     * @param canvas The canvas being used
     */
    GUI.prototype.registerEventListeners = function (canvas) {
        var _this = this;
        /* Event listener for key controls */
        window.addEventListener("keydown", function (key) {
            return _this.onKeydown(key);
        });
        /* Event listener for mouse controls */
        canvas.addEventListener("mousedown", function (mouse) {
            return _this.dragStart(mouse);
        });
        canvas.addEventListener("mousemove", function (mouse) {
            return _this.drag(mouse);
        });
        canvas.addEventListener("mouseup", function (mouse) {
            return _this.dragEnd(mouse);
        });
        /* Event listener to stop the right click menu */
        canvas.addEventListener("contextmenu", function (event) {
            return event.preventDefault();
        });
    };
    GUI.rotationSpeed = 0.25;
    GUI.zoomSpeed = 0.1;
    GUI.rollSpeed = 0.1;
    GUI.panSpeed = 0.1;
    return GUI;
}());
exports.GUI = GUI;
//# sourceMappingURL=Gui.js.map