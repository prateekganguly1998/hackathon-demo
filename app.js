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
  res.sendFile(path.join(__dirname,'learn.html'));
  //__dirname : It will resolve to your project folder.
});
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');