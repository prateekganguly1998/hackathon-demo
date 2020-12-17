const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
router.get('/',function(req,res){
  res.render(path.join(__dirname,'practice.ejs'));
  //__dirname : It will resolve to your project folder.
});
router.get('/train',function(req,res){
  return res.render(path.join(__dirname,'learn.ejs'),{data:'https://g9y8d2h3.rocketcdn.me/wp-content/uploads/2019/05/Awkward-Pose-1-1024x576.jpg'});
  //__dirname : It will resolve to your project folder.
});
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');