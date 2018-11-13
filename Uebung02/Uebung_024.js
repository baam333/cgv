"use strict";

var gl;
var points = [];
var colorsDrawing = [];

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

    var dreiecke = [
        [0,1,2],
        [0,2,3],// vorne
        [4,5,7],
        [5,6,7],//hinten
        [2,3,7],
        [2,7,6],// oben
        [0,1,4],
        [1,4,5],// unten
        [2,1,6],
        [1,6,5],//rechts
        [0,3,7],
        [0,4,7]//links
    ];


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
    draw_Side([ecken[4],ecken[5],ecken[0],ecken[1]]);
    draw_Side([ecken[3],ecken[2],ecken[0],ecken[1]]);
    draw_Side([ecken[7],ecken[6],ecken[3],ecken[2]]);
    draw_Side([ecken[7],ecken[3],ecken[4],ecken[0]]);
    draw_Side([ecken[7],ecken[6],ecken[4],ecken[5]]);
    draw_Side([ecken[2],ecken[6],ecken[1],ecken[5]]);

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
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );
    render();
};
function add_dreiecke(item,color){
    for( var i = 0 ; i<item.length;i++){
        points.push(item[i]);
        colorsDrawing.push(color);
    }
}
function draw_Side(corners){

    var mid0 = [];
    var mid1 = [];
    var j;
    var midZwich;

    mid0[0]=corners[0];
    mid0[1]=mix(corners[0],corners[1],1/3);
    mid0[2]=mix(corners[0],corners[1],2/3);
    mid0[3]=corners[1];
    for (var i = 1; i<4;i++){
        mid1[0] = mix(corners[0],corners[2],i/3);
        midZwich = mix(corners[1],corners[3],i/3);
        mid1[1] = mix(mid1[0],midZwich,1/3);
        mid1[2] = mix(mid1[0],midZwich,2/3);
        mid1[3] = midZwich;

        for (j = 0; j<3;j=j+1){
            draw_quadrat([mid0[j],mid0[j+1],mid1[j],mid1[j+1]]);
        }
        mid0[0] = mid1[0];
        mid0[1] = mid1[1];
        mid0[2] = mid1[2];
        mid0[3] = mid1[3];
    }

}
function draw_quadrat(corners){
    var color = vec4(Math.random(),Math.random(),Math.random(),1.0);
    add_dreiecke([corners[0],corners[1],corners[2]],color);
    add_dreiecke([corners[1],corners[2],corners[3]],color);

}


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
}
