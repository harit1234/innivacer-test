//--------------modules------------------------------------------------------------------------//

var express = require ('express');
var app = express();
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken')
var process = require('process')

// middleware for tokenverify
var tokenverify = require('./middleware/tokenverify')

//adding middleware for body parsing [body-parser]

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

//listening on port 2000

if (process.env.PORT){
app.listen(process.env.PORT,()=>{console.log('listening ' + process.env.PORT)})
}
else{
app.listen(2000,()=>{console.log('listening ')})
}

var {check} = require('express-validator/check')


// login route configuration --------------------------------------------------------------

app.post('/login',[check('username').isLength({min:3})],(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var token = jwt.sign(username,'secret')
    res.json({token: token})
})

// jsonpatch endpoint -------------------------------------------------------------------------------

var jsonpatch = require('fast-json-patch')
app.post('/jsonpatch',(req,res)=>{
    var jsondoc = req.body.jsondoc
    var patch = req.body.jsonpatch
    var arr = []
    // var document = jsonpatch.applyPatch(jsondoc,patch).newDocument;
    // res.send(document)
    patch.forEach(element => {arr.push(JSON.parse(element))});
    console.log(jsonpatch.validate(arr, jsondoc))
    jsondoc = jsonpatch.applyPatch(arr, jsondoc).newDocument
    res.json({jsondoc:jsondoc})
})

//---------thumbnail-generation route ------------------------------------------------------------

var imgproc = require('./middleware/imgproc')

app.post('/thumbnail',[check('url').isURL()],tokenverify,imgproc,(req,res)=>{
    var url = req.body.url
    res.sendFile(req.thumbnailpath,{root:'/home/harit/programs'});
})
