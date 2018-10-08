var router = require ('express').Router()

//file system module
var fs = require('fs')

//http request module
var request = require('request')

// image resize module
var sharp = require('sharp')

router.use((req,res,next)=>{
    //download image
    request.get({url:req.body.url}).on('response',(stream)=>{

        //if url contains image then download and resize else reject req with 415

        if(stream.headers['content-type'].split('/')[0] == 'image'){

            // file download
            var filepath = './' + stream.headers['date'] + '.' + stream.headers['content-type'].split('/')[1]
            stream.pipe(fs.createWriteStream(filepath))

            // resize directly from download stream from the stream
            var thumbnailpath = './' + stream.headers['date'] + '-thumbnail' + '.' + stream.headers['content-type'].split('/')[1]
            stream.pipe(sharp().resize(50,50)).pipe(fs.createWriteStream(thumbnailpath))
            req.thumbnailpath = thumbnailpath
            next()
        }

        else{
            res.status(415).end()
        }

    })
})
module.exports = router