"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCanvas = exports.MengerAnimation = void 0;
var CanvasAnimation_js_1 = require("../lib/webglutils/CanvasAnimation.js");
var Gui_js_1 = require("./Gui.js");
var MengerSponge_js_1 = require("./MengerSponge.js");
var MengerTests_js_1 = require("./tests/MengerTests.js");
var Shaders_js_1 = require("./Shaders.js");
var TSM_js_1 = require("../lib/TSM.js");
var Floor_js_1 = require("./Floor.js");
var MengerAnimation = /** @class */ (function (_super) {
    __extends(MengerAnimation, _super);
    function MengerAnimation(canvas) {
        var _this = _super.call(this, canvas) || this;
        /* The Menger sponge */
        _this.sponge = new MengerSponge_js_1.MengerSponge(1);
        /* Menger Sponge Rendering Info */
        _this.mengerVAO = -1;
        _this.mengerProgram = -1;
        /* Menger Buffers */
        _this.mengerPosBuffer = -1;
        _this.mengerIndexBuffer = -1;
        _this.mengerNormBuffer = -1;
        /* Menger Attribute Locations */
        _this.mengerPosAttribLoc = -1;
        _this.mengerNormAttribLoc = -1;
        /* Menger Uniform Locations */
        _this.mengerWorldUniformLocation = -1;
        _this.mengerViewUniformLocation = -1;
        _this.mengerProjUniformLocation = -1;
        _this.mengerLightUniformLocation = -1;
        /* Global Rendering Info */
        _this.lightPosition = new TSM_js_1.Vec4();
        _this.backgroundColor = new TSM_js_1.Vec4();
        //Floor Structure
        _this.floor = new Floor_js_1.Floor();
        _this.floorVAO = -1;
        _this.floorProgram = -1;
        _this.floorPosBuffer = -1;
        _this.floorIndexBuffer = -1;
        _this.floorNormBuffer = -1;
        _this.floorPosAttribLoc = -1;
        _this.floorNormAttribLoc = -1;
        _this.floorWorldUniformLocation = -1;
        _this.floorViewUniformLocation = -1;
        _this.floorProjUniformLocation = -1;
        _this.floorLightUniformLocation = -1;
        _this.gui = new Gui_js_1.GUI(canvas, _this, _this.sponge);
        /* Setup Animation */
        _this.reset();
        return _this;
    }
    /**
     * Setup the animation. This can be called again to reset the animation.
     */
    MengerAnimation.prototype.reset = function () {
        /* debugger; */
        this.lightPosition = new TSM_js_1.Vec4([-10.0, 10.0, -10.0, 1.0]);
        this.backgroundColor = new TSM_js_1.Vec4([0.0, 0.37254903, 0.37254903, 1.0]);
        this.initMenger();
        this.initFloor();
        this.gui.reset();
    };
    /**
     * Initialize the Menger sponge data structure
     */
    MengerAnimation.prototype.initMenger = function () {
        this.sponge.setLevel(1);
        /* Alias context for syntactic convenience */
        var gl = this.ctx;
        /* Compile Shaders */
        this.mengerProgram = CanvasAnimation_js_1.WebGLUtilities.createProgram(gl, Shaders_js_1.defaultVSText, Shaders_js_1.defaultFSText);
        gl.useProgram(this.mengerProgram);
        /* Create VAO for Menger Sponge */
        this.mengerVAO = this.extVAO.createVertexArrayOES();
        this.extVAO.bindVertexArrayOES(this.mengerVAO);
        /* Create and setup positions buffer*/
        // Returns a number that indicates where 'vertPosition' is in the shader program
        this.mengerPosAttribLoc = gl.getAttribLocation(this.mengerProgram, "vertPosition");
        /* Ask WebGL to create a buffer */
        this.mengerPosBuffer = gl.createBuffer();
        /* Tell WebGL that you are operating on this buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
        /* Fill the buffer with data */
        gl.bufferData(gl.ARRAY_BUFFER, this.sponge.positionsFlat(), gl.STATIC_DRAW);
        /* Tell WebGL how to read the buffer and where the data goes */
        gl.vertexAttribPointer(this.mengerPosAttribLoc /* Essentially, the destination */, 4 /* Number of bytes per primitive */, gl.FLOAT /* The type of data */, false /* Normalize data. Should be false. */, 4 *
            Float32Array.BYTES_PER_ELEMENT /* Number of bytes to the next element */, 0 /* Initial offset into buffer */);
        /* Tell WebGL to enable to attribute */
        gl.enableVertexAttribArray(this.mengerPosAttribLoc);
        /* Create and setup normals buffer*/
        this.mengerNormAttribLoc = gl.getAttribLocation(this.mengerProgram, "aNorm");
        this.mengerNormBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.mengerNormAttribLoc, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(this.mengerNormAttribLoc);
        /* Create and setup index buffer*/
        this.mengerIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sponge.indicesFlat(), gl.STATIC_DRAW);
        /* End VAO recording */
        this.extVAO.bindVertexArrayOES(this.mengerVAO);
        /* Get uniform locations */
        this.mengerWorldUniformLocation = gl.getUniformLocation(this.mengerProgram, "mWorld");
        this.mengerViewUniformLocation = gl.getUniformLocation(this.mengerProgram, "mView");
        this.mengerProjUniformLocation = gl.getUniformLocation(this.mengerProgram, "mProj");
        this.mengerLightUniformLocation = gl.getUniformLocation(this.mengerProgram, "lightPosition");
        /* Bind uniforms */
        gl.uniformMatrix4fv(this.mengerWorldUniformLocation, false, new Float32Array(this.sponge.uMatrix().all()));
        gl.uniformMatrix4fv(this.mengerViewUniformLocation, false, new Float32Array(TSM_js_1.Mat4.identity.all()));
        gl.uniformMatrix4fv(this.mengerProjUniformLocation, false, new Float32Array(TSM_js_1.Mat4.identity.all()));
        gl.uniform4fv(this.mengerLightUniformLocation, this.lightPosition.xyzw);
    };
    /**
     * Sets up the floor and floor drawing
     */
    MengerAnimation.prototype.initFloor = function () {
        /* Alias context for syntactic convenience */
        var gl = this.ctx;
        /* Compile Shaders */
        this.floorProgram = CanvasAnimation_js_1.WebGLUtilities.createProgram(gl, Shaders_js_1.floorVSText, Shaders_js_1.floorFSText);
        gl.useProgram(this.floorProgram);
        this.floorVAO = this.extVAO.createVertexArrayOES();
        this.extVAO.bindVertexArrayOES(this.floorVAO);
        /* Create and setup positions buffer*/
        // Returns a number that indicates where 'vertPosition' is in the shader program
        this.floorPosAttribLoc = gl.getAttribLocation(this.floorProgram, "vertPosition");
        this.floorPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.floorPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.floor.positionsFlat(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.floorPosAttribLoc /* Essentially, the destination */, 4 /* Number of bytes per primitive */, gl.FLOAT /* The type of data */, false, 4 *
            Float32Array.BYTES_PER_ELEMENT /* Number of bytes to the next element */, 0 /* Initial offset into buffer */);
        /* Tell WebGL to enable to attribute */
        gl.enableVertexAttribArray(this.floorPosAttribLoc);
        this.floorNormAttribLoc = gl.getAttribLocation(this.floorProgram, "aNorm");
        this.floorNormBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.floorNormBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.floor.normalsFlat(), gl.STATIC_DRAW);
        gl.vertexAttribPointer(this.floorNormAttribLoc, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.enableVertexAttribArray(this.floorNormAttribLoc);
        /* Create and setup index buffer*/
        this.floorIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.floorIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.floor.indicesFlat(), gl.STATIC_DRAW);
        /* End VAO recording */
        this.extVAO.bindVertexArrayOES(this.floorVAO);
        /* Get uniform locations */
        this.floorWorldUniformLocation = gl.getUniformLocation(this.floorProgram, "mWorld");
        this.floorViewUniformLocation = gl.getUniformLocation(this.floorProgram, "mView");
        this.floorProjUniformLocation = gl.getUniformLocation(this.floorProgram, "mProj");
        this.floorLightUniformLocation = gl.getUniformLocation(this.floorProgram, "lightPosition");
        /* Bind uniforms */
        gl.uniformMatrix4fv(this.floorWorldUniformLocation, false, new Float32Array(this.floor.uMatrix().all()));
        gl.uniformMatrix4fv(this.floorViewUniformLocation, false, new Float32Array(TSM_js_1.Mat4.identity.all()));
        gl.uniformMatrix4fv(this.floorProjUniformLocation, false, new Float32Array(TSM_js_1.Mat4.identity.all()));
        gl.uniform4fv(this.floorLightUniformLocation, this.lightPosition.xyzw);
    };
    /**
     * Draws a single frame
     */
    MengerAnimation.prototype.draw = function () {
        var gl = this.ctx;
        /* Clear canvas */
        var bg = this.backgroundColor;
        gl.clearColor(bg.r, bg.g, bg.b, bg.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        /* Menger - Update/Draw */
        var modelMatrix = this.sponge.uMatrix();
        gl.useProgram(this.mengerProgram);
        this.extVAO.bindVertexArrayOES(this.mengerVAO);
        /* Update menger buffers */
        if (this.sponge.isDirty()) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerPosBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.sponge.positionsFlat(), gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.mengerPosAttribLoc, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(this.mengerPosAttribLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.mengerNormBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.sponge.normalsFlat(), gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.mengerNormAttribLoc, 4, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
            gl.enableVertexAttribArray(this.mengerNormAttribLoc);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mengerIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.sponge.indicesFlat(), gl.STATIC_DRAW);
            this.sponge.setClean();
        }
        /* Update menger uniforms */
        gl.uniformMatrix4fv(this.mengerWorldUniformLocation, false, new Float32Array(modelMatrix.all()));
        gl.uniformMatrix4fv(this.mengerViewUniformLocation, false, new Float32Array(this.gui.viewMatrix().all()));
        gl.uniformMatrix4fv(this.mengerProjUniformLocation, false, new Float32Array(this.gui.projMatrix().all()));
        /* Draw menger */
        gl.drawElements(gl.TRIANGLES, this.sponge.indicesFlat().length, gl.UNSIGNED_INT, 0);
        // TODO: draw the floor
        /* Floor - Update/Draw */
        gl.useProgram(this.floorProgram);
        this.extVAO.bindVertexArrayOES(this.floorVAO);
        /* Update floor uniforms */
        gl.uniformMatrix4fv(this.floorWorldUniformLocation, false, new Float32Array(modelMatrix.all()));
        gl.uniformMatrix4fv(this.floorViewUniformLocation, false, new Float32Array(this.gui.viewMatrix().all()));
        gl.uniformMatrix4fv(this.floorProjUniformLocation, false, new Float32Array(this.gui.projMatrix().all()));
        /* Draw floor */
        gl.drawElements(gl.TRIANGLES, this.floor.indicesFlat().length, gl.UNSIGNED_INT, 0);
    };
    MengerAnimation.prototype.setLevel = function (level) {
        this.sponge.setLevel(level);
    };
    MengerAnimation.prototype.getGUI = function () {
        return this.gui;
    };
    return MengerAnimation;
}(CanvasAnimation_js_1.CanvasAnimation));
exports.MengerAnimation = MengerAnimation;
function initializeCanvas() {
    var canvas = document.getElementById("glCanvas");
    /* Start drawing */
    var canvasAnimation = new MengerAnimation(canvas);
    MengerTests_js_1.mengerTests.registerDeps(canvasAnimation);
    MengerTests_js_1.mengerTests.registerDeps(canvasAnimation);
    canvasAnimation.start();
}
exports.initializeCanvas = initializeCanvas;
//# sourceMappingURL=App.js.map