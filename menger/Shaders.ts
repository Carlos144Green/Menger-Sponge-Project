export let defaultVSText = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;   
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
		//  Convert vertex to camera coordinates and the NDC
        gl_Position = mProj * mView * mWorld * vec4 (vertPosition, 1.0);
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vec4(vertPosition, 1.0);
		
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
    }
`;

// TODO: Write the fragment shader

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;    
	
    
    void main () {
        vec4 newNormal = normal;
        if ((abs(normal)).x == 1.0) {
            newNormal.x = - normal.x;
        }
        if ((abs(normal)).z == 1.0) {
            newNormal.z = - normal.z;
        }
        gl_FragColor = dot(normalize(newNormal), normalize(lightDir)) * normalize(abs(normal));
        gl_FragColor[3] = 1.0; 
    }
`;

// TODO: floor shaders

export let floorVSText = `
    precision mediump float;
    attribute vec3 vertPosition;
    attribute vec3 vertColor;
    attribute vec4 aNorm;
    varying vec4 lightDir;
    varying vec4 normal;
    varying vec3 vertPos;
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;
    void main () {
        //  Convert vertex to camera coordinates and the NDC
        vec4 vertVec = vec4(vertPosition, 1.0);
        gl_Position = mProj * mView * mWorld * vertVec;
        
        //  Compute light direction (world coordinates)
        lightDir = lightPosition - vertVec;
        
        //  Pass along the vertex normal (world coordinates)
        normal = aNorm;
        vertPos = vertPosition;
    }
`;

export let floorFSText = `
    precision mediump float;
    varying vec4 lightDir;
    varying vec4 normal;
    varying vec3 vertPos;
    void main () {
        vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
        float floorSize = 1.0 / 5.0;
        if (mod(floor(vertPos.x * floorSize) + floor(vertPos.z * floorSize), 2.0) < 0.5) { 
            color = vec4(0.0, 0.0, 0.0, 1.0); 
        }
        gl_FragColor = max(min(dot(normalize(normal), normalize(lightDir)), 1.0), 0.0) * color;
        gl_FragColor[3] = 1.0;
    }
`;

