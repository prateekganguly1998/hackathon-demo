let video;
let pose;
let poseNet;
let skeleton;
function setup()
{
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
    let options={
        inputs:34,
        outputs:5,
        task:'classification',
        debug:true

    }
    brain=ml5.neuralNetwork(options);
    const modelInfo={
        model:'model/model.json',
        metadata:'model/model_meta.json',
        weights:'model/model.weights.bin'
    }
    brain.load(modelInfo,brainLoaded);
}
function brainLoaded()
{
    console.log(`pose classfication ready`);
    classifyPose();
}
function classifyPose()
{
    let inputs=[];
    if(pose)
    {
        for (let i=0;i<pose.keypoints.length;i++)
    {
        let x=pose.keypoints[i].position.x;
        let y=pose.keypoints[i].position.y;
        inputs.push(x);
        inputs.push(y);
    }
   
    brain.classify(inputs,gotResult);

    }
    else{
        setTimeout(classifyPose,100);
    }
    
}
function gotResult(err,results)
{
    console.log(results[0].label);
    classifyPose();
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