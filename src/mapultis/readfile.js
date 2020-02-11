const request = require('./request')
const createGraph = require('ngraph.graph');


module.exports = {
    loadGraphs,
    testFunction
};


function loadGraphs(){
    return request('/graph.co.bin',{
        responseType: 'arraybuffer',
    })
    .then(processNodes)
    .then(()=>{
        console.log("done processing")
    })
}

function processNodes(buffer){
    console.log(buffer)
    let points = new Float32Array(buffer)
    for (let i = 0; i < points.length; i++){
        console.log(points[i])
    }
    console.log("Downloaded nodes: "+points.length)
}
function testFunction(){
    console.log("test")
}