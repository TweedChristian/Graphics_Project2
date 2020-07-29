let canvas;
let gl;
let program;
let points;
let colors;

function main(){
    webGLInit();
    render();
}

function webGLInit(){
    canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl');
    if(!gl){
        alert('WebGL could not be loaded, please try on an updated browser');
        return;
    }
    function createShader(gl,type,source){
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(success){
            return shader;
        }
        if(type = gl.VERTEX_SHADER){
           console.log('The Vertex Shader Failed to Compile');
            let error = gl.getShaderInfoLog(shader);
        }
        if(type = gl.FRAGMENT_SHADER){
           console.log('The Fragment Shader Failed to Compile');
        }
        let error = gl.getShaderInfoLog(shader);
        console.log(error);
        gl.deleteShader(shader);
        return;
    }

    function createProgram(gl, vertexShader, fragmentShader){
        let program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        let success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(success){
            return program;
        }
        console.log('The Program could not be initialized');
        gl.deleteProgram(program);
        return;
    }

    let vertexShaderSrc = document.getElementById('vertexShader').text;
    let fragmentShaderSrc = document.getElementById('fragmentShader').text;
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);

    program = createProgram(gl, vertexShader, fragmentShader);
    if(program){
        gl.viewport(0,0,gl.canvas.width, gl.canvas.height);
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);
    }
}

function render(){
    points = [
        vec4(0,0,0,1),
        vec4(1,0,0,1),
        vec4(0,0.5,0,1)
    ];

    colors = [
        vec4(1,0,0,1),
        vec4(0,1,0,1),
        vec4(0,1,0,1)
    ]
    let colorAttributeLocation = gl.getAttribLocation(program, 'vColor');
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    let positionAttributeLocation = gl.getAttribLocation(program, 'vPosition');
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
   
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 4, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}