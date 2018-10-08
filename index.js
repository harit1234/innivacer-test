//--------------modules-------------------------------------------------------------------//

var express = require ('express');
var app = express();
var bodyparser = require('body-parser');
var jwt = require('jsonwebtoken')

// middleware for tokenverify
var tokenverify = require('./middleware/tokenverify')

//adding middleware for body parsing [body-parser]

app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

//listening on port 2000

app.listen(2000,()=>{console.log('listening')})

var {check} = require('express-validator/check')


// login route configuration --------------------------------------------------------------

app.post('/login',[check('username').isLength({min:3})],(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    var token = jwt.sign(username,'secret')
    res.json({token: token})
})

// jsonpatch endpoint -------------------------------------------------------------------------------

var jsonpatch = require('fast-json-patch')//module

app.post('jsonpatch',tokenverify,(req,res)=>{
    // seperating the patch and object
    var patchToApply = req.body.jsonpatch;
    var jsonDoc = req.body.jsondoc;
    //applying patch and generating patched json
    var changedDoc = jsonpatch.applyPatch(jsonDoc,patchToApply).newDocument; //new document after applying patch
    res.json({changeddoc: changedDoc})
})

//---------thumbnail-generation route ------------------------------------------------------------

var imgproc = require('./middleware/imgproc')

app.post('/thumbnail',[check('url').isURL()],tokenverify,imgproc,(req,res)=>{
    var url = req.body.url
    res.sendFile(req.thumbnailpath,{root:'/home/harit/programs'});
})
