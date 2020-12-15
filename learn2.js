const posenet =require('@tensorflow-models/posenet');
const tfnode= require('@tensorflow/tfjs-node');
const fs=require('fs');
const sharp=require('sharp');
require('@tensorflow/tfjs-node');
const imageScaleFactor = 0.50;
let trainDirs=['tree','downdog','plank','goddess','warrior2'];
const flipHorizontal = false;
const outputStride = 16;
let imageElements=[];
let inputs=[];

async function loadData()
{

  for(let i=0;i<trainDirs.length;i++)
  {
    const dataDir=`./public/DATASET/TRAIN/${trainDirs[i]}`;
    fs.readdir(dataDir, async(err, files) => {
     files.forEach(async file => {
       const data = fs.readFileSync(`${dataDir}/${file}`, 
             {flag:'r'}); 
             sharp(`${dataDir}/${file}`).resize({height:480,width:640}).toBuffer().then(results=>
              {
                let tfimage={};
                try
                {
                  if(file.split('.')[1]==="jpg")
                  {
                    tfimage = tfnode.node.decodeJpeg(results);
                   //console.log(file);
                   
                  }
                  else
                  {
                   tfimage = tfnode.node.decodePng(results);
                //  console.log(file);
                  }
                }
                catch(exc)
                {
                  console.log(exc);
                 
                }
              
              
            imageElements.push({image:tfimage,label:trainDirs[i]});
              })
           //  console.log(data);
           
     });
   
 
   });
  }
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: 513,
    multiplier: 0.75
    });
    for(let i=0;i<imageElements.length;i++)
    {
      try{
        const pose = await net.estimateSinglePose(imageElements[i].image, imageScaleFactor, flipHorizontal, outputStride);
       // console.log(pose.keypoints);
        inputs.push({pose:pose,label:imageElements[i].label});
      }
      catch(exc)
      {
        console.log(imageElements[i]);
      }
      
     
    
    }

    console.log(inputs);
    const inputsForModel=JSON.stringify(inputs);
    fs.writeFileSync('dataset2.json',inputsForModel);
   
}

// loadData();
async function makePosenet()
{
 const data= fs.readFileSync('dataset2.json',{flag:'r'});
 console.log(JSON.parse(data));
}

makePosenet();