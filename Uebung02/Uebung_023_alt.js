"use strict";

var gl;
var points = [];
var colorsDrawing = [];

var NumPoints = 5000;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Cube
    //

    /*
    Hier werden die 8 Ecken eines Würfels definiert
    Vertex 4 ist nicht eingezeichnet

       7 _______ 6
       /       /|
      /       / |
    3/______2/  |
    |       |   /5
    |       |  /
    |       | /
    |_______|/
   0         1
   */

    var ecken = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 )
    ];

    // Define Colors 
    var colors = [ vec3( 1.0, 0.0, 0.0 ),
                   vec3( 0.0, 1.0, 0.0 ),
                   vec3( 0.0, 0.0, 1.0 ),
                   vec3( 1.0, 1.0, 0.0 ),
                   vec3( 1.0, 0.0, 1.0 ),
                   vec3( 0.0, 1.0, 1.0 ),
                   vec3( 1.0, 0.5, 0.0 ),
                   vec3( 1.0, 0.0, 0.5 )];

    //Die  Ecken werden um 15 Grad gedreht, so dass alle sichtbar sind.
    //Ohne die Drehung würden die hinteren Ecken verdeckt werden
    var rad = radians(15);
    var cos = Math.cos(rad);
    var sin = Math.sin(rad);

    //Berechnung einer Rotationsmatrix um die y-Achse
    var yRot = mat3(cos,  0, sin,
                    0,    1,   0,
                    -sin,  0, cos);

    //Berechnung einer Rotationsmatrix um die x-Achse
    var xRot = mat3(1,    0,    0,
                    0,  cos, -sin,
                    0,  sin,  cos);

    //Die beiden Rotationsmatritzen werden miteinander multipliziert,
    //so dass eine neue Rotationsmatrix entsteht, die beide Transformationen
    //auf einmal macht.
    var rotMat = mult(yRot,xRot);

    //Alle Ecken des Würfels werden mit der Rotationsmatrix multipliziert.
    for(var i = 0; i < ecken.length; i++){
        ecken[i] = mult(rotMat, ecken[i]);
    }

    //Das Array points wird nun mit den Würfelecken gefüllt
    //2 Einträge ergeben eine Linie

    //Die vordere Seite des Wüfels
    points.push(ecken[0]);
    colorsDrawing.push(colors[0]);
    points.push(ecken[1]);
    colorsDrawing.push(colors[1]);

    points.push(ecken[1]);
    colorsDrawing.push(colors[1]);
    points.push(ecken[2]);
    colorsDrawing.push(colors[2]);

    points.push(ecken[2]);
    colorsDrawing.push(colors[2]);
    points.push(ecken[3]);
    colorsDrawing.push(colors[3]);

    points.push(ecken[3]);
    colorsDrawing.push(colors[3]);
    points.push(ecken[0]);
    colorsDrawing.push(colors[0]);

    //Die hintere Seite des Würfels
    points.push(ecken[4]);
    colorsDrawing.push(colors[4]);
    points.push(ecken[5]);
    colorsDrawing.push(colors[5]);

    points.push(ecken[5]);
    colorsDrawing.push(colors[5]);
    points.push(ecken[6]);
    colorsDrawing.push(colors[6]);

    points.push(ecken[6]);
    colorsDrawing.push(colors[6]);
    points.push(ecken[7]);
    colorsDrawing.push(colors[7]);

    points.push(ecken[7]);
    colorsDrawing.push(colors[7]);
    points.push(ecken[4]);
    colorsDrawing.push(colors[4]);

    //Die Verbindungsstücke zwischen der Vorder- und der Hinterseite
    points.push(ecken[0]);
    colorsDrawing.push(colors[0]);
    points.push(ecken[4]);
    colorsDrawing.push(colors[4]);

    points.push(ecken[1]);
    colorsDrawing.push(colors[1]);
    points.push(ecken[5]);
    colorsDrawing.push(colors[5]);

    points.push(ecken[2]);
    colorsDrawing.push(colors[2]);
    points.push(ecken[6]);
    colorsDrawing.push(colors[6]);

    points.push(ecken[3]);
    colorsDrawing.push(colors[3]);
    points.push(ecken[7]);
    colorsDrawing.push(colors[7]);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    //Color
    var bufferColor = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferColor );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsDrawing), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.LINES, 0, points.length );
}
