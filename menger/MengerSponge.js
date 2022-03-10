"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MengerSponge = void 0;
var TSM_js_1 = require("../lib/TSM.js");
/**
 * Represents a Menger Sponge
 */
var MengerSponge = /** @class */ (function () {
    // TODO: sponge data structures
    function MengerSponge(level) {
        this.setLevel(level);
        this.cubesMade = 0;
        // TODO: other initialization	
    }
    MengerSponge.prototype.makeCube = function (min1, max1) {
        //slice(start?: number, end?: number): Float32Array;
        var x;
        var y;
        var z;
        var num;
        num = 0;
        var output = new Float32Array(32);
        //var cubePoint; 
        var cubePoint;
        //console.log("all coords for points: ");
        for (var i = 0; i < 2; i++)
            for (var j = 0; j < 2; j++)
                for (var k = 0; k < 2; k++) {
                    if (i == 0)
                        x = min1[0];
                    else
                        x = max1[0];
                    if (j == 0)
                        y = min1[1];
                    else
                        y = max1[1];
                    if (k == 0)
                        z = min1[2];
                    else
                        z = max1[2];
                    output[num + 0] = x;
                    output[num + 1] = y;
                    output[num + 2] = z;
                    output[num + 3] = 1;
                    num += 4;
                }
        //console.log(output);
        return output;
    };
    /**
     * Returns true if the sponge has changed.
     */
    MengerSponge.prototype.isDirty = function () {
        return this.dirty;
    };
    MengerSponge.prototype.setClean = function () {
        this.dirty = false;
        this.cubesMade = 0;
    };
    MengerSponge.prototype.setLevel = function (level) {
        this.level = level;
        this.positionsFlat();
        this.dirty = true;
        this.cubesMade = 0;
        // TODO: initialize the cube
    };
    MengerSponge.prototype.createMenger = function (min1, max1, level) {
        var curMin = [min1[0], min1[1], min1[2]];
        var curMax = [max1[0], max1[1], max1[2]];
        var curDif = [max1[0] - min1[0], max1[1] - min1[1], max1[2] - min1[2]];
        var numCubes = Math.pow(27, (this.level - level));
        var toRet = new Float32Array(36 * numCubes);
        if (numCubes > 1) {
            //console.log(toRet);
        }
        //let addingArr : number[];
        if (level == this.level) {
            //console.log("Making cube at min = " + min1+ "    max=  "+max1);
            toRet = this.makeCube(min1, max1);
            this.cubesMade++;
            for (var i = 0; i < 32; i++) {
                this.allCubes[i + this.curCubeInd] = toRet[i];
            }
            this.curCubeInd += 32;
            //for(var num of toRet){
            //addingArr.concat(num);
            //}
        }
        else {
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    for (var k = 0; k < 3; k++) {
                        if (!((i == 1 && j == 1) || (i == 1 && k == 1) || (j == 1 && k == 1))) {
                            var minX = curMin[0] + (curDif[0] * (i / 3.0));
                            var minY = curMin[1] + (curDif[1] * (j / 3.0));
                            var minZ = curMin[2] + (curDif[2] * (k / 3.0));
                            var maxX = curMin[0] + (curDif[0] * (i + 1) / 3.0);
                            var maxY = curMin[1] + (curDif[1] * (j + 1) / 3.0);
                            var maxZ = curMin[2] + (curDif[2] * (k + 1) / 3.0);
                            var getNums = new Float32Array(32 * numCubes / 21);
                            //console.log(minX,minY,minZ,maxX,maxY,maxZ);
                            getNums = this.createMenger(new Float32Array([minX, minY, minZ]), new Float32Array([maxX, maxY, maxZ]), level + 1);
                            if (level == 1) {
                                console.log(getNums.length);
                                console.log(getNums);
                                var emptyCubes = 0;
                                for (var numsInd = 0; numsInd < getNums.length - 3; numsInd += 3) {
                                    if (getNums[numsInd] == 0 && getNums[numsInd + 1] == 0 && getNums[numsInd + 2] == 0) {
                                        emptyCubes++;
                                    }
                                }
                                console.log("empty cubes: ", emptyCubes);
                            }
                            for (var ind = 0; ind < getNums.length; ind++) {
                                //console.log(i+(3*j));
                                var index = (i + (3 * j) + (9 * k)) * 32 + ind;
                                //console.log(ind);
                                //console.log(index);
                                toRet[index] = getNums[ind];
                                //addingArr.concat(num);
                            }
                            //console.log(getNums);
                        }
                    }
                }
            }
        }
        //console.log(addingArr);
        //console.log(toRet);
        if (numCubes > 1) {
            //console.log(toRet);
        }
        return toRet;
    };
    /* Returns a flat Float32Array of the sponge's vertex positions */
    MengerSponge.prototype.positionsFlat = function () {
        //console.log("HELLLLOOOOOOOOO");
        var numCubes = Math.pow(27, (this.level - 1));
        //console.log(numCubes);
        var toRet = new Float32Array(36 * numCubes);
        // TODO: right now this makes a single triangle. Make the cube fractal instead.
        //console.log(this.level);
        this.curCubeInd = 0;
        this.allCubes = new Float32Array(32 * numCubes);
        toRet = this.createMenger(new Float32Array([-0.5, -0.5, -0.5, 1.0,]), new Float32Array([0.5, 0.5, 0.5, 1.0]), 1);
        //console.log(toRet);
        console.log("Cubes made: ", this.cubesMade);
        var arrayCount = 0;
        for (var i = 0; i < toRet.length; i++) {
            if (toRet[i] != 0) {
                arrayCount++;
                if (i == toRet.length - 4) {
                    i += 31;
                }
                else {
                    i += 32;
                }
            }
        }
        console.log("cubes in Positions array: ", arrayCount);
        console.log(this.allCubes);
        return this.allCubes;
        //return new Float32Array([   0.0, 0.0, 0.0, 1.0, 
        //                            0.0, 1.0, 0.0, 1.0,
        //                            1.0, 1.0, 0.0, 1.0,
        //                            1.0, 0.0, 0.0, 1.0,]);
    };
    /**
     * Returns a flat Uint32Array of the sponge's face indices
     */
    MengerSponge.prototype.indicesFlat = function () {
        // TODO: right now this makes a single triangle. Make the cube fractal instead.
        var numCubes = Math.pow(27, this.level - 1);
        var toRet = new Uint32Array(36 * numCubes);
        var toCopy = new Uint32Array([0, 1, 3,
            3, 2, 0,
            0, 4, 5,
            5, 1, 0,
            0, 2, 6,
            6, 4, 0,
            7, 6, 2,
            2, 3, 7,
            7, 3, 1,
            1, 5, 7,
            7, 5, 4,
            4, 6, 7
        ]);
        for (var i = 0; i < numCubes; i++) {
            for (var j = 0; j < toCopy.length; j++) {
                //console.log()
                toRet[i * 36 + j] = toCopy[j] + 8 * i;
            }
        }
        //console.log(toRet);
        return toRet;
    };
    /**
     * Returns a flat Float32Array of the sponge's normals
     */
    MengerSponge.prototype.normalsFlat = function () {
        //console.log("HELP IM IN THE NORMALSFLAT FUNCTION");
        var numCubes = Math.pow(27, (this.level - 1));
        var toRet = new Float32Array(48 * numCubes);
        var toCopy = new Float32Array([-1.0, 0.0, 0.0, 0.0,
            -1.0, 0.0, 0.0, 0.0,
            0.0, -1.0, 0.0, 0.0,
            0.0, -1.0, 0.0, 0.0,
            0.0, 0.0, -1.0, 0.0,
            0.0, 0.0, -1.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            1.0, 0.0, 0.0, 0.0,
            1.0, 0.0, 0.0, 0.0]);
        for (var i = 0; i < numCubes; i++) {
            for (var j = 0; j < toCopy.length; j++) {
                //console.log()
                toRet[i * 48 + j] = toCopy[j];
            }
        }
        //console.log("HELP IM IN THE NORMALSFLAT FUNCTION");
        console.log(toRet);
        return toRet;
    };
    /**
     * Returns the model matrix of the sponge
     */
    MengerSponge.prototype.uMatrix = function () {
        // TODO: change this, if it's useful
        var ret = new TSM_js_1.Mat4().setIdentity();
        return ret;
    };
    return MengerSponge;
}());
exports.MengerSponge = MengerSponge;
//# sourceMappingURL=MengerSponge.js.map