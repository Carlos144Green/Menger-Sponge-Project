"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Floor = void 0;
var TSM_js_1 = require("../lib/TSM.js");
var Floor = /** @class */ (function () {
    function Floor() {
        this.bound = 1000.0;
        this.point = -2.0;
    }
    Floor.prototype.positionsFlat = function () {
        return new Float32Array([
            -this.bound, this.point, -this.bound, 1.0,
            -this.bound, this.point, this.bound, 1.0,
            this.bound, this.point, -this.bound, 1.0,
            this.bound, this.point, this.bound, 1.0,
            this.bound, this.point, -this.bound, 1.0,
            -this.bound, this.point, this.bound, 1.0
        ]);
    };
    Floor.prototype.indicesFlat = function () {
        return new Uint32Array([0, 1, 2, 3, 4, 5]);
    };
    Floor.prototype.normalsFlat = function () {
        return new Float32Array([0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
    };
    Floor.prototype.uMatrix = function () {
        var ret = new TSM_js_1.Mat4().setIdentity();
        return ret;
    };
    return Floor;
}());
exports.Floor = Floor;
//# sourceMappingURL=Floor.js.map