let img;let img2;
 let poseNet;let poseNet2; let poses = [],poses2=[];
let trainDirs=['tree','downdog','plank','goddess','warrior2'];
function setup() {
    
    img = createImg('https://static.toiimg.com/thumb/msid-7647039,width-800,height-600,resizemode-75/7647039.jpg', imageReady);
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
   // frameRate(1); // set the frameRate to 1 since we don't need it to be running quickly in this case
}

function image2Ready()
{
    console.log(img2);
    let options = {
        inputResolution: 513,
        minConfidence: 0.1,
        architecture:'ResNet50',
        outputStride:32
    }
    
    // assign poseNet
    poseNet2 = ml5.poseNet(model2Ready, options);

    // This sets up an event that listens to 'pose' events
    poseNet2.on('pose', function (results) {
        poses2 = results;
        console.log(poses2);
        console.log(normalizeVectorCoord(3,4))
    });
}
function model2Ready() {
    //select('#status').html('Model Loaded');
    
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet2.singlePose(img2)
   
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
    
    // assign poseNet
    poseNet = ml5.poseNet(modelReady, options);

    // This sets up an event that listens to 'pose' events
    poseNet.on('pose', function (results) {
        poses = results;
        console.log(poses);
        console.log(normalizeVectorCoord(3,4))
    });
}
function normalizeVectorCoord(x,y)
{
    let rootSumofSquares=Math.sqrt(x*x+y*y);  
    let newX=x/rootSumofSquares;
    let newY=y/rootSumofSquares;
    return {x:newX,y:newY};
}
// when poseNet is ready, do the detection
function modelReady() {
    select('#status').html('Model Loaded');
    
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet.singlePose(img)
   
}
// draw() will not show anything until poses are found
function draw() {
    if (poses.length > 0) {
        drawSkeleton(poses);
        drawKeypoints(poses);
        noLoop(); // stop looping when the poses are estimated
    }
}
// The following comes from https://ml5js.org/docs/posenet-webcam // A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = poses[i].pose;
        for (let j = 0; j < pose.keypoints.length; j++) {
            // A keypoint is an object describing a body part (like rightArm or leftShoulder)
            let keypoint = pose.keypoints[j];
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                fill(255);
                stroke(20);
                strokeWeight(4);
                ellipse(round(keypoint.position.x), round(keypoint.position.y), 8, 8);
            }
        }
    }
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
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}
