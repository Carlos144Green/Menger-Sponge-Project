import { Camera } from "../lib/webglutils/Camera.js";
import { CanvasAnimation } from "../lib/webglutils/CanvasAnimation.js";
import { MengerSponge } from "./MengerSponge.js";
import { Mat4, Vec3, Vec4 } from "../lib/TSM.js";

/**
 * Might be useful for designing any animation GUI
 */
interface IGUI {
  viewMatrix(): Mat4;
  projMatrix(): Mat4;
  dragStart(me: MouseEvent): void;
  drag(me: MouseEvent): void;
  dragEnd(me: MouseEvent): void;
  onKeydown(ke: KeyboardEvent): void;
}

/**
 * Handles Mouse and Button events along with
 * the the camera.
 */
export class GUI implements IGUI {
  private static readonly rotationSpeed: number = 0.25;
  private static readonly zoomSpeed: number = 0.1;
  private static readonly rollSpeed: number = 0.1;
  private static readonly panSpeed: number = 0.1;

  private camera: Camera;
  private dragging: boolean;
  private fps: boolean;
  private prevX: number;
  private prevY: number;
  private X: number;
  private Y: number;

  private height: number;
  private width: number;

  private sponge: MengerSponge;
  private animation: CanvasAnimation;

  /**
   *
   * @param canvas required to get the width and height of the canvas
   * @param animation required as a back pointer for some of the controls
   * @param sponge required for some of the controls
   */
  constructor(
    canvas: HTMLCanvasElement,
    animation: CanvasAnimation,
    sponge: MengerSponge
  ) {
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
  public reset(): void {
    this.fps = false;
    this.dragging = false;
    /* Create camera setup */
    this.camera = new Camera(
      new Vec3([0, 0, -6]),
      new Vec3([0, 0, 0]),
      new Vec3([0, 1, 0]),
      45,
      this.width / this.height,
      0.1,
      1000.0
    );
  }

  /**
   * Sets the GUI's camera to the given camera
   * @param cam a new camera
   */
  public setCamera(
    pos: Vec3,
    target: Vec3,
    upDir: Vec3,
    fov: number,
    aspect: number,
    zNear: number,
    zFar: number
  ) {
    this.camera = new Camera(pos, target, upDir, fov, aspect, zNear, zFar);
  }

  /**
   * Returns the view matrix of the camera
   */
  public viewMatrix(): Mat4 {
    return this.camera.viewMatrix();
  }

  /**
   * Returns the projection matrix of the camera
   */
  public projMatrix(): Mat4 {
    return this.camera.projMatrix();
  }

  /**
   * Callback function for the start of a drag event.
   * @param mouse
   */
  public dragStart(mouse: MouseEvent): void {
    this.dragging = true;
    this.prevX = mouse.screenX;
    this.prevY = mouse.screenY;
  }

  /**
   * The callback function for a drag event.
   * This event happens after dragStart and
   * before dragEnd.
   * @param mouse
   */
    public drag(mouse: MouseEvent): void {
        if (this.dragging == true) {
            let xDelta = mouse.screenX - this.prevX;
            let yDelta = mouse.screenY - this.prevY;

            if (xDelta != 0 || yDelta != 0) {

                let delta = new Vec4([2 * xDelta / this.width, -2 * yDelta / this.height, 0.0, 0.0])
                let camVector = this.projMatrix().inverse().multiplyVec4(delta);
                let worldVector = this.viewMatrix().inverse().multiplyVec4(camVector);
                //This is a world cord function
                let newVec = new Vec3([worldVector.x, worldVector.y, worldVector.z]);
                this.camera.rotate(Vec3.cross(this.camera.forward().negate(), newVec), GUI.rotationSpeed);
            }
            this.prevX = mouse.screenX;
            this.prevY = mouse.screenY;
        }
    }

  /**
   * Callback function for the end of a drag event
   * @param mouse
   */
  public dragEnd(mouse: MouseEvent): void {
    this.dragging = false;
    this.prevX = 0;
    this.prevY = 0;
  }

  /**
   * Callback function for a key press event
   * @param key
   */
  public onKeydown(key: KeyboardEvent): void {
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
            this.camera.orbitTarget(new Vec3([0, 1, 0]), .5);
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
            this.camera.offset((this.camera.up()), GUI.panSpeed, true);  //i think this is working
            break;
        }
        case "ArrowDown": {
            this.camera.offset((this.camera.up().scale(-1)), GUI.panSpeed, true);  //i dont think this is working
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
        case "KeyE":{
            this.camera.orbitTarget(new Vec3([1, 0, 0]), 5);
        }
      default: {
        console.log("Key : '", key.code, "' was pressed.");
        break;
      }
    }
  }

  /**
   * Registers all event listeners for the GUI
   * @param canvas The canvas being used
   */
  private registerEventListeners(canvas: HTMLCanvasElement): void {
    /* Event listener for key controls */
    window.addEventListener("keydown", (key: KeyboardEvent) =>
      this.onKeydown(key)
    );

    /* Event listener for mouse controls */
    canvas.addEventListener("mousedown", (mouse: MouseEvent) =>
      this.dragStart(mouse)
    );

    canvas.addEventListener("mousemove", (mouse: MouseEvent) =>
      this.drag(mouse)
    );

    canvas.addEventListener("mouseup", (mouse: MouseEvent) =>
      this.dragEnd(mouse)
    );

    /* Event listener to stop the right click menu */
    canvas.addEventListener("contextmenu", (event: any) =>
      event.preventDefault()
    );
  }
}
