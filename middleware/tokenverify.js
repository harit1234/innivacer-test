var router = require('express').Router()
var jwt = require('jsonwebtoken')

router.use((req,res,next)=>{
    if(req.headers.token){
    var token = jwt.verify(req.headers.token,'secret');
    //authenticate
    next();
    }

    else{
        res.status(401).end()
    }
})

module.exports = router