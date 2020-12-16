let img2;
let video;
let poseNet;let poseNet2; 
let poses2=[];
let pose;
function setup() {
    
    // img = createImg('https://static.toiimg.com/thumb/msid-7647039,width-800,height-600,resizemode-75/7647039.jpg', imageReady);
    // img.size(640,480);
    // img.elt.crossOrigin="Anonymous";
    // img.style('z-index','-5');
    // img.style('position','absolute')

    createCanvas(640,480);
    video=createCapture(VIDEO);
    video.hide();
    let poseNetOptions={
        
        inputResolution: 513,
        minConfidence: 0.1,
        architecture:'ResNet50',
        outputStride:32,
        flipHorizontal: true,
        scoreThreshold: 0.4,
        nmsRadius: 20,
        detectionType: 'single',
        multiplier: 1.0,
       }
    poseNet=ml5.poseNet(video,modelLoaded,poseNetOptions);
    poseNet.on('pose',gotPoses);
    // leftBuffer=createGraphics(640,480);
    // rightBuffer=createGraphics(640,480);
    img2=createImg('https://static.toiimg.com/photo/msid-69885314/69885314.jpg',image2Ready);
    img2.size(640,480);
    // img2.style('margin-left','640px');
    // img2.style('margin-top','-480px');
    img2.elt.crossOrigin="Anonymous";
    img2.style('position','absolute');
  
    // assign poseNet
    
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
   // poseNet = ml5.poseNet(modelReady, options);

    // This sets up an event that listens to 'pose' events
   // poseNet.on('pose',gotPoses);
}
function gotPoses(poses)
{
  //  console.log(poses);
    if(poses.length>0)
    {
        pose=poses[0].pose;
        skeleton=poses[0].skeleton;
    }
}
function modelLoaded()
{
    console.log(`Posenet is ready`);
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
//    poseNet.singlePose(video)
   
}
// draw() will not show anything until poses are found

function draw()
{
    //move image by the width of image to the left
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
    image(video,0,0);
    if(pose)
    {
        // let eyeR=pose.rightEye;
        // let eyeL=pose.leftEye;
        // let  d=dist(eyeR.x,eyeR.y,eyeL.x,eyeL.y)



        // fill(255,0,0);
        // ellipse(pose.nose.x,pose.nose.y,d);
        // fill(0,0,255)
        // ellipse(pose.rightWrist.x,pose.rightWrist.y,32);
        // ellipse(pose.leftWrist.x,pose.leftWrist.y,32);

        for (let i=0;i<pose.keypoints.length;i++)
        {
            let x=pose.keypoints[i].position.x;
            let y=pose.keypoints[i].position.y;
            fill(237,191,76);
            ellipse(x,y,12,12)
        }
        for(let i=0;i<skeleton.length;i++)
        {
            let cord1=skeleton[i][0];
            let cord2=skeleton[i][1];
            strokeWeight(3);
            stroke('red');
            line(cord1.position.x,cord1.position.y,cord2.position.x,cord2.position.y)
        }
    }
    
}
// The following comes from https://ml5js.org/docs/posenet-webcam // A function to draw ellipses over the detected keypoints
function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < pose.length; i++) {
        // For each pose detected, loop through all the keypoints
        let pose = pose[i].pose;
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
    for (let i = 0; i < pose.length; i++) {
        let skeleton = pose[i].skeleton;
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
