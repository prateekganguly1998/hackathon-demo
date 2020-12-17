let img2;
let video;
let poseNet;let poseNet2; 
let poses2=[];
let isPartProper=[];
let chartData=[];
let epsilon=0.05;
let pose;
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
    let PredictedVal={
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
    };
    var ComparisonResult = [];
    var ValueStore = { 
        'pred' : {}, 
        'exp' : {} 
        } 
        color_code_keys = Object.keys(color_code); 
    
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
    img2=createImg('https://www.gaia.com/wp-content/uploads/ChairPose-NicoLuce.jpg',image2Ready);
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
   // console.log(img2);
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
        let currentPose = poses2[0].pose;
        for (let j = 0; j < Object.keys(currentPose).length-1; j++) { 
            let keypointj = Object.keys(currentPose)[j+2];
            if(keypointj)
            {
            IdealVal[`${keypointj}`] = currentPose.keypoints[j];
            
            }
        
            } 
            IdealVal=normalizeVectorCoord(IdealVal);
    });
}
function model2Ready() {
    //select('#status').html('Model Loaded');
    
    // When the model is ready, run the singlePose() function...
    // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
    // in the draw() loop, if there are any poses, then carry out the draw commands
    poseNet2.singlePose(img2)
   
    // comparePoses() 
}
// when the image is ready, then load up poseNet

function gotPoses(poses)
{
  //  console.log(poses);
    if(poses.length>0)
    {
        pose=poses[0].pose;
        skeleton=poses[0].skeleton;
      
    }
    
    for(let i=0;i<17;i++)
    {
         PredictedVal[pose.keypoints[i].part]=pose.keypoints[i]
       // console.log(pose.keypoints);
    }
    
    // // console.log(PredictedVal);
    // 
  
}
//calculate distance for chart//

function modelLoaded()
{ select('#status').html('Model Loaded');
    console.log(`Posenet is ready`);
    //IdealVal is valid here//
   
   //console.log(IdealVal);
   
   setInterval(function()
   { 
    PredictedVal=normalizeVectorCoord(PredictedVal);
    //console.log(PredictedVal);
   let comparePosePromise= comparePoses();
   comparePosePromise.then(result=>
    {
      //  console.log(result);
        isPartProper=[];
        for(let i=0;i<17;i++)
        {
          
            //console.log(result[i][2], epsilon);
            console.log(result[i][2],result[i][3],epsilon);
            if(result[i][2]>epsilon ||result[i][2]<-epsilon&&result[i][3]>epsilon||result[i][3]<-epsilon)
            {
                
                isPartProper.push({part:result[i][1],value:false});
            }
            else
            {
                isPartProper.push({part:result[i][1],value:true});
            }
        }
       // console.log(isPartProper);
    })
   },3000);
 
    
}
function normalizeVectorCoord(Val) 
{ 
   
 console.log(Val) 
        let x,y; 
        x= 0; 
        y = 0; 
        for(let i=0; i< 17;i++){ 
        // console.log(color_code_keys[i]) 
            x += Math.pow(Val[color_code_keys[i]].position.x,2) //*Val[color_code_keys[i]].position.x // console.log('Y',Val[color_code_keys[i]].position.y) 
            y += Math.pow(Val[color_code_keys[i]].position.y,2) ///Val[color_code_keys[i]].position.y 
        } 
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
    

        // console.log('TTTTT',tx,ty,tx+ty) // IdealVal = PredictedVal return Val 
       // console.log(Val);
        return Val;
}   
// when poseNet is ready, do the detection

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
        

        for (let i=0;i<pose.keypoints.length;i++)
        {
            let x=pose.keypoints[i].position.x;
            let y=pose.keypoints[i].position.y;
            //console.log(isPartProper[i])
            if(isPartProper.length>0)
            {
                if(isPartProper[i].value)
            {
                fill(0,255,0);
            }
            else
            {
                fill(255,0,0);
            }  
            }
            else
            { 
                fill(237,191,76);

            }
           
           
            ellipse(x,y,12,12)
        }

        // for(let i=0;i<skeleton.length;i++)
        // {

        //     let cord1=skeleton[i][0];
        //     let cord2=skeleton[i][1];
        //     strokeWeight(3);
        //     stroke('red');
        //     line(cord1.position.x,cord1.position.y,cord2.position.x,cord2.position.y)
        // }
       // PredictedVal=normalizeVectorCoord(PredictedVal);
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
           // PredictedVal[keypoint.part]=keypoint;
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


//pose comparison code
function comparePoses() { 
   
    return new Promise((resolve,reject)=>{
        let i; 
        ComparisonResult = []; 
        let diffx = 0; 
        let diffy = 0; 
        let temp = []; 
        // [ priority , part , diffx , diffy ] 
        for(i = 0; i<17 ; i++){ 
        let temp = []; 
        temp.push(priority[color_code_keys[i]]); 
         temp.push(color_code_keys[i]); 
        diffx = (IdealVal[color_code_keys[i]].position.x - PredictedVal[color_code_keys[i]].position.x ) 
        diffy = (IdealVal[color_code_keys[i]].position.y - PredictedVal[color_code_keys[i]].position.y) 
        // console.log(PredictedVal[color_code_keys[i]],IdealVal[color_code_keys[i]]) 
        if(diffx){ 
        temp.push(diffx) 
        } 
        else{ 
        diffx = 0 
        temp.push(diffx) 
        } 

        if(diffy){ 
        temp.push(diffy) 
        } 
        else{ 
        diffy = 0 
        temp.push(diffy) 
        }

        if(diffy != 0 || diffx != 0){ 
        ComparisonResult.push(temp) 
        } 
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
       return resolve(ComparisonResult);
    })
        // let epsilon = -99; 
       // console.log(Object.keys(PredictedVal));
       
    
   
    }
