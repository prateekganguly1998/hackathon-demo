// let output = [];
// let poses=[];
// let trainDirs=['tree','downdog','plank','goddess','warrior2'];
// let posenetInput=[];
// let dataset;
// let imgList=[];
// let brain;
// function setup()
// {
   
//     frameRate(1);
//     // document.getElementById('tree').addEventListener('change', handleTreeSelect, false);
//     // document.getElementById('warrior2').addEventListener('change', handleWarriorSelect, false);
//     // document.getElementById('downdog').addEventListener('change', handleDownDogSelect, false);
//     // document.getElementById('plank').addEventListener('change', handlePlankSelect, false);
//     // document.getElementById('goddess').addEventListener('change', handleGoddessSelect, false);
//     document.getElementById('loadDataset').addEventListener('change', handleJSON, false);
//     document.getElementById('getData').addEventListener('click', handleLoadJSON, false);
    
//     let options={
//         inputs:34,
//         outputs:5,
//         task:'classification',
//         debug:true

//     }
//    brain=ml5.neuralNetwork(options,brainLoaded);
    
// }
// function handleJSON(evt) {
//     var files = evt.target.files; // FileList object
//     //dataset=JSON.parse(files);
//     console.log(files[0]);
//     var reader=new FileReader();
//     reader.onload = function (evt) {
//         //console.log(evt.target.result);
//         let poseList=JSON.parse(evt.target.result);
//         handleLoadJSON(poseList);
//       //  document.getElementById("editor").value = evt.target.result;
//       };

//       reader.onerror = function (evt) {
//         console.error("An error ocurred reading the file",evt);
//       };

//       reader.readAsText(files[0], "UTF-8");

//     // files is a FileList of File objects. List some properties.
       
   

// }
// function handleLoadJSON(poseList)
// {
//     console.log(poseList);
//         for(let i=0;i<poseList.length;i++)
//         {
//                      let inputs=[];
//             let currentPose=poseList[i].pose;
//             //console.log(currentPose);
//             for(j=0;j<currentPose.keypoints.length;j++)
//             {
//                 let x=currentPose.keypoints[j].position.x;
//                 let y=currentPose.keypoints[j].position.y;
//                 inputs.push(x);
//                 inputs.push(y);
    
//             }
//             let target=[poseList[i].label];
//            console.log(target,inputs);
//            brain.addData(inputs,target);   
//         }

//         brain.saveData();
// }
// function brainLoaded()
// {
//     console.log('Brain Loaded');
// }
// function handleData()
// {
    
//     //console.log(output);
//     for(let i=0;i<output.length;i++)
//     {
//         let currentDir=output[i].label;
//         for(let j=0;j<output[i].images.length;j++)
//         {
//             let imageName=output[i].images[j].name;
//            let img = createImg(`DATASET/TRAIN/${currentDir}/${imageName}`, 'Kuch na krna');
//            img.size(640,480);
//            img.style('z-index','-5');
//           // img.style('position','absolute')
//            //createCanvas(img.width,img.height);
//             img.hide();
//             imgList.push({img:img,label:currentDir});
//         }
        
//         // posenetInput.push({imageList:imgList,label:currentDir});

//     }
//     makePosenet(imgList);
//    // console.log(imgList)
//    // console.log(poses);
// }
// function modelReady() {
//     select('#status').html('Model Loaded');
//     // When the model is ready, run the singlePose() function...
//     // If/When a pose is detected, poseNet.on('pose', ...) will be listening for the detection results 
//     // in the draw() loop, if there are any poses, then carry out the draw commands
//     for(let i=0;i<imgList.length;i++)
//     {
//         //console.log(imgList[i]);
//         let img=imgList[i].img;
//        // console.log(img);
//         poseNet.singlePose(img);
//     }
 
    
//     makeInputs(poses);

  

   
// }
// function makeInputs(poseList)
// {
//     setTimeout(function()
//     {

//         for(let i=0;i<poseList.length;i++)
//         {
//             let inputs=[];
//             let currentPose=poseList[i].poses[0].pose;
//             //console.log(currentPose);
//             for(j=0;j<currentPose.keypoints.length;j++)
//             {
//                 let x=currentPose.keypoints[j].position.x;
//                 let y=currentPose.keypoints[j].position.y;
//                 inputs.push(x);
//                 inputs.push(y);
    
//             }
//             let target=[imgList[i].label];
//            console.log(target,inputs);
//            brain.addData(inputs,target);
//        }
//        brain.saveData();
//      //  console.log(brain);
//     },10000)
    
   
   
// }
// function makePosenet(imgList)
// {
//     console.log(imgList);
//     let options = {
//         imageScaleFactor: 1,
//         minConfidence: 0.1
//     }
    
//     // assign poseNet
//     poseNet = ml5.poseNet(modelReady, options);


//         poseNet.on('pose', function (results) {
//             poses.push({poses:results}); 
//         });
    
  
    
    
// }

// function handleTreeSelect(evt) {
//     var files = evt.target.files; // FileList object
//     output.push({images:files,label:'tree'});

//     // files is a FileList of File objects. List some properties.
       
   

// }
// function handleWarriorSelect(evt) {
//     var files = evt.target.files; // FileList object
//     console.log(files.length);
//     output.push({images:files,label:'warrior2'});
//     // files is a FileList of File objects. List some properties.
       
   

// }
// function handleDownDogSelect(evt) {
//     var files = evt.target.files; // FileList object
//     console.log(files.length);
//     output.push({images:files,label:'downdog'});
//     // files is a FileList of File objects. List some properties.
       
   

// }
// function handlePlankSelect(evt) {
//     var files = evt.target.files; // FileList object
//     console.log(files.length);
//     output.push({images:files,label:'plank'});
//     // files is a FileList of File objects. List some properties.
       
   

// }
// function handleGoddessSelect(evt) {
//     var files = evt.target.files; // FileList object
//     console.log(files.length);
//     output.push({images:files,label:'goddess'});
//     // files is a FileList of File objects. List some properties.
       
   

// }
let brain;
function setup()
{
    let options={
        inputs:34,
        outputs:5,
        task:'classification',
        debug:true

    }
    brain=ml5.neuralNetwork(options);
    brain.loadData('dataset.json',dataready);
}

function dataready()
{
    brain.normalizeData();
    brain.train({epochs:200},finished);
}

function finished()
{
    console.log('Model trained');
    brain.save();
}