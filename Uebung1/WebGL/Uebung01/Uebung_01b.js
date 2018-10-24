"use strict";

var gl;
var pointsA;
var pointsB;


var kochAnzahl = 3;

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Sierpinski Gasket
    //

    // First, initialize the corners of our gasket with three points.

    pointsA = [
        vec2( -1, 0 ),
        vec2(  1, 0 )
    ];
    pointsB = [];


    // AB HIER BITTE EIGENEN CODE EINFUEGEN
    for( var k = 0; k<kochAnzahl;k++){
        for( var i = 0; i<=pointsA.length-2;i=i+1){
            computeTri(pointsA[i],pointsA[i+1]);
        }
        pointsA = pointsB;
        pointsB=[];
    }



    // ENDE DES EIGENEN CODES
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsA), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};
function computeTri(p1,p2){
    var pmid1  = mix(p1,p2,1/3);
    var pmid2 = mix(p1,p2,2/3);
    var dis = Math.sqrt(3)/2;
    var disx = pmid2[0]-pmid1[0];
    var disy = pmid2[1]-pmid1[1];
    var ptri = add(mix(pmid1,pmid2,1/2),vec2(-disy*dis,disx*dis))

    pointsB.push(p1); 
    pointsB.push(pmid1);
    pointsB.push(ptri);
    pointsB.push(pmid2);
    pointsB.push(p2);


}



function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_STRIP, 0, pointsA.length );
}
