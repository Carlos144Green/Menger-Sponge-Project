import {Mat4} from "../lib/TSM.js";
// straight from the menger 
interface IFloor {

    normalsFlat(): Float32Array;
    positionsFlat(): Float32Array;
    indicesFlat(): Uint32Array;
    
}
export class Floor implements IFloor {


    private bound: number = 1000.0;
    private point: number = -2.0
      
        public positionsFlat(): Float32Array {
            return new Float32Array([
                -this.bound, this.point, -this.bound, 1.0,
                -this.bound, this.point,  this.bound, 1.0,
                this.bound,  this.point, -this.bound, 1.0,
                this.bound,  this.point,  this.bound, 1.0,
                this.bound,  this.point, -this.bound, 1.0,
                -this.bound, this.point,  this.bound, 1.0
            ]);
        }
     
    public indicesFlat(): Uint32Array {
        return new Uint32Array([0,1,2,3,4,5]);
    } 
    public  normalsFlat():Float32Array{
        return new Float32Array([0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]);
    }
    public uMatrix(): Mat4{
        const ret: Mat4 = new Mat4().setIdentity();
        return ret;
    }
}