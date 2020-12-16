let img;let img2;
let poseNet;let poseNet2; let poses = [],poses2=[];
let trainDirs=['tree','downdog','plank','goddess','warrior2'];
color_code = {
'nose': [0,0,0],
'leftEye': [0,0,0],
'rightEye': [0,0,0],
'leftEar': [0,0,0],
'rightEar': [0,0,0],
'leftShoulder': [255,255,0],
'rightShoulder': [255,255,0],
'leftElbow': [0,255,255],
'rightElbow': [0,255,255],
'leftWrist': [0,0,255],
'rightWrist': [0,0,255],
'leftHip': [100,100,0],
'rightHip': [100,100,0],
'leftKnee': [50,0,0],
'rightKnee': [50,0,0],
'leftAnkle': [255,0,0],
'rightAnkle': [255,0,0]
}
priority = {
'nose': 1,
'leftEye': 2,
'rightEye': 2,
'leftEar': 3,
'rightEar': 3,
'leftShoulder': 4,
'rightShoulder': 4,
'leftElbow': 5,
'rightElbow': 5,
'leftWrist': 6,
'rightWrist': 6,
'leftHip': 7,
'rightHip': 7,
'leftKnee': 8,
'rightKnee': 8,
'leftAnkle': 9,
'rightAnkle': 9
}
var PredictedVal = {}
let IdealVal = {
'nose': null,
'leftEye': null,
'rightEye': null,
'leftEar': null,
'rightEar': null,
'leftShoulder': null,
'rightShoulder': null,
'leftElbow': null,
'rightElbow':null ,
'leftWrist':null,
'rightWrist':null,
'leftHip': null,
'rightHip': null,
'leftKnee': null,
'rightKnee': null,
'leftAnkle': null,
'rightAnkle': null
}
var ComparisonResult = [];
var ValueStore = { 
    'pred' : {}, 
    'exp' : {} 
    } 
    color_code_keys = Object.keys(color_code); 
    //console.log(color_code_keys) 
    function setup() { 
    img = createImg('https://static.toiimg.com/photo/msid-69885314/69885314.jpg', imageReady); 
    img.size(640,480); 
    img.elt.crossOrigin="Anonymous"; 
    img.style('z-index','-5'); 
    img.style('position','absolute') 
    createCanvas(img.width,img.height); 
    // leftBuffer=createGraphics(640,480); 
    // rightBuffer=createGraphics(640,480); 
    img2=createImg('https://static.toiimg.com/photo/msid-69885314/69885314.jpg',image2Ready); 
    img2.size(640,480); 
    // img2.style('margin-left','640px'); 
    // img2.style('margin-top','-480px'); 
    img2.elt.crossOrigin="Anonymous"; 
    img2.style('position','absolute') 
    //img.hide(); // hide the image in the browser 
     frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case 
    } 
    function image2Ready() 
    { 
    /* let options = { 
    inputResolution: 513, 
    minConfidence: 0.1, 
    architecture:'ResNet50', 
    outputStride:32 
    } 
    */ 
    let options = { 
    imageScaleFactor: 1, 
    minConfidence: 0.1 
    } 
    // assign poseNet 
    poseNet2 = ml5.poseNet(model2Ready, options);
    // This sets up an event that listens to 'pose' events 
    poseNet2.on('pose', function (results) { 
    poses2 = results; 
    console.log('Image 2 ',poses2); 
    for (let i = 0; i < poses2.length; i++) { 
    let pose = poses2[i].pose;
    if(pose)
    {
        for (let j = 0; j < pose.keypoints.length; j++) { 
            let keypointj = pose.keypoints[j]; 
            console.log(keypointj);
            IdealVal[`${keypointj.part}`] = keypointj;
            console.log(IdealVal); 
            } 
    } 
    
    } 
    console.log('i',IdealVal) 
   
    }); 
    } 
    function model2Ready() { 
    //select('#status').html('Model Loaded'); 
    poseNet2.singlePose(img2);
    IdealVal = normalizeVectorCoord(IdealVal) 
    console.log('i',IdealVal) 
    comparePoses() 
    // When the model is ready, run the singlePose() function... 
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results // in the draw() loop, if there are any poses, then carry out the draw commands poseNet2.singlePose(img2) 
    } 
    // when the image is ready, then load up poseNet 
    function imageReady(){ 
    // set some options 
    let options = { 
    inputResolution: 513, 
    minConfidence: 0.1, 
    architecture:'ResNet50', 
    outputStride:32 
    } 
     
    // let options = { 
    // imageScaleFactor: 1, 
    // minConfidence: 0.1 
    // } 
    // assign poseNet 
    poseNet = ml5.poseNet(modelReady, options); 
    // This sets up an event that listens to 'pose' events 
    poseNet.on('pose', function (results) {
    poses = results; 
    console.log('Image 1 ',poses); 
    }); 
    } 
    // when poseNet is ready, do the detection 
    function modelReady() { 
    select('#status').html('Model Loaded'); 

    poseNet.singlePose(img);
    // When the model is ready, run the singlePose() function... 
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results // in the draw() loop, if there are any poses, then carry out the draw commands poseNet.singlePose(img) 
    } 
    // draw() will not show anything until poses are found 
    function draw() { 
    if (poses.length > 0) { 
    drawSkeleton(poses); 
    drawKeypoints(poses); 
    noLoop(); // stop looping when the poses are estimated 
    } 
    } 
    function drawKeypoints() { 
    // Loop through all the poses detected 
    for (let i = 0; i < poses.length; i++) { 
    // For each pose detected, loop through all the keypoints 
    let pose = poses[i].pose; 
    for (let j = 0; j < pose.keypoints.length; j++) { 
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j]; 
    PredictedVal[keypoint.part] = keypoint 
    // Only draw an ellipse is the pose probability is bigger than 0.2 
    Color = color_code[color_code_keys[j]]; 
    // 
    if (keypoint.score > 0.2) { 
    fill(Color[0],Color[1],Color[2]); 
    stroke(20); 
    strokeWeight(1); 
    ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8); 
    } 
    } 
    } 
    // console.log('p',PredictedVal) 
    PredictedVal = normalizeVectorCoord(PredictedVal) 
    // console.log('p',PredictedVal) 
    // comparePoses() 
    }
    // A function to draw the skeletons 
    function drawSkeleton() { 
    // Loop through all the skeletons detected 
    for (let i = 0; i < poses.length; i++) { 
    let skeleton = poses[i].skeleton; 
    // For every skeleton, loop through all body connections 
    for (let j = 0; j < skeleton.length; j++) { 
    let partA = skeleton[j][0]; 
    let partB = skeleton[j][1]; 
    stroke('red'); 
    strokeWeight(1); 
    line(partA.position.x, partA.position.y, partB.position.x, partB.position.y); } 
    } 
    } 
    function comparePoses() { 
    console.log("in"); 
    let epsilon = -99; 
    let i; 
    ComparisonResult = []; 
    let diffx = 0; 
    let diffy = 0; 
    let temp = []; 
    // [ priority , part , diffx , diffy ] 
    for(i = 0; i<17 ; i++){ 
    let temp = []; 
    temp.push(priority[color_code_keys[i]]); 
    // temp.push(color_code_keys[i]); 
    diffx = (IdealVal[color_code_keys[i]].position.x - PredictedVal[color_code_keys[i]].position.x ) 
    diffy = (IdealVal[color_code_keys[i]].position.y - PredictedVal[color_code_keys[i]].position.y) 
    // console.log(PredictedVal[color_code_keys[i]],IdealVal[color_code_keys[i]]) if(diffx > epsilon){ 
    temp.push(diffx) 
    } 
    // else{ 
    // diffx = 0 
    // temp.push(diffx) 
    // } 
    if(diffy > epsilon){ 
    temp.push(diffy) 
    } 
    else{ 
    diffy = 0 
    temp.push(diffy) 
    }
    if(diffy != 0 || diffx != 0){ 
    ComparisonResult.push(temp) 
    } 
    
    // console.log(ComparisonResult) 
    /* ComparisonResult = [ 
    [6,657], 
    [4,677], 
    [1,57], 
    [9,67] 
    ] 
    console.log(ComparisonResult) 
    */ 
    ComparisonResult = ComparisonResult.sort(function(a,b) { 
    return a[0] - b[0]; 
    }); 
    console.log(ComparisonResult) 
    } 
    function normalizeVectorCoord(Val) 
    { 
    // /console.log(Val) 
    let x,i,y; 
    x= 0; 
    y = 0; 
    for(i=0; i< 17;i++){ 
    // console.log(color_code_keys[i]) 
    if(Val[color_code_keys[i]])
    {
        x += Math.pow(Val[color_code_keys[i]].position.x,2) //*Val[color_code_keys[i]].position.x // console.log('Y',Val[color_code_keys[i]].position.y) 
        y += Math.pow(Val[color_code_keys[i]].position.y,2) ///Val[color_code_keys[i]].position.y } 
        let rootSumofSquares=Math.sqrt(x+y); 
        // console.log(rootSumofSquares,x,y) 
        // let tx=0,ty=0; 
        for(i=0; i< 17;i++){ 
        // console.log(color_code_keys[i]) 
        Val[color_code_keys[i]].position.x = Val[color_code_keys[i]].position.x/rootSumofSquares;
        Val[color_code_keys[i]].position.y = Val[color_code_keys[i]].position.y/rootSumofSquares // tx += Val[color_code_keys[i]].position.x*Val[color_code_keys[i]].position.x // ty += Val[color_code_keys[i]].position.y*Val[color_code_keys[i]].position.y // console.log(tx+ ' ' + ty) 
        // console.log('X',Val[color_code_keys[i]].position.x) 
        // console.log('Y',Val[color_code_keys[i]].position.y)
        } 
    }
   
    // console.log('TTTTT',tx,ty,tx+ty) // IdealVal = PredictedVal return Val 
    }
}   