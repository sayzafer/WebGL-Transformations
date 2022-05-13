var canvas;
var gl;
var points = [];
var colors = [];
var mvLoc;
var translation;
var translationArray = [0, 0, 0, 0,];
var rotationArray = [0, 0, 0];
var scalerArray = [1, 1];



window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    
    var vertices = [
        vec3(0.0000,  0.0000, -1.0000),
        vec3(0.0000,  0.9428,  0.3333),
        vec3(-0.8165, -0.4714,  0.3333),
        vec3(0.8165, -0.4714,  0.3333)
    ]; 

    tetra(vertices[0], vertices[1], vertices[2], vertices[3]);


    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );  
    
    mvLoc = gl.getUniformLocation(program, "modelviewmatrix");
    translation = gl.getUniformLocation(program, "translation")

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    // sliders for viewing parameters
	document.getElementById("rotX").oninput = function(event) {
        rotationArray[0] = this.value;
        requestAnimFrame(render)
    };
	
    document.getElementById("rotY").oninput = function(event) {
        rotationArray[1] = this.value;
        requestAnimFrame(render)
    };

    document.getElementById("objRotationZSlider").oninput = function(event) {
        rotationArray[2] = this.value;
        requestAnimFrame(render)
    };
   
    document.getElementById("posX").oninput = function(event) {
        translationArray[0] = this.value;
        requestAnimFrame(render)
    };
	
    document.getElementById("posY").oninput = function(event) {
        translationArray[1] = this.value;
        requestAnimFrame(render)
    };
	
	document.getElementById("scaleX").oninput = function(event) {
        scalerArray[0] = this.value;
        requestAnimFrame(render)
    };
	
    document.getElementById("scaleY").oninput = function(event) {
        scalerArray[1] =this.value;
        requestAnimFrame(render)
    };
	   
	document.getElementById("ResetButton").addEventListener("click", function(){
		translationArray = [0, 0, 0, 0];
        rotationArray = [0, 0, 0];
        scalerArray = [1, 1];

        var el = document.querySelectorAll(".slider")
        el.forEach(i => i.value = 0)

        requestAnimFrame(render)
    });	
   
    render();
}


function triangle(a, b, c, color){
    var baseColors = [
        vec3(1.0, 0.0, 0.0), //Red
        vec3(0.0, 1.0, 0.0), //Green
        vec3(0.0, 0.0, 1.0), //Blue
        vec3(0.0, 0.0, 0.0)
    ];

    colors.push(baseColors[color]);
    points.push(a);
    colors.push(baseColors[color]);
    points.push(b);
    colors.push(baseColors[color]);
    points.push(c);
}


function tetra(a, b, c, d){
    triangle(a, c, b, 0);
    triangle(a, c, d, 1);
    triangle(a, b, d, 2);
    triangle(b, c, d, 3);
}


var render = function(){
    var modelviewmatrix = mat4();

    modelviewmatrix = mult(modelviewmatrix, rotate(rotationArray[2], 0, 0, 1))
    modelviewmatrix = mult(modelviewmatrix, rotate(rotationArray[1], 0, 1, 0))
    modelviewmatrix = mult(modelviewmatrix, rotate(rotationArray[0], 1, 0 ,0))

    modelviewmatrix = mult(modelviewmatrix, scalem(scalerArray[0], scalerArray[1], 0))
    
    gl.uniform4fv(translation, translationArray);
    gl.uniformMatrix4fv(mvLoc, false, flatten(modelviewmatrix));
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
    requestAnimFrame(render);
}