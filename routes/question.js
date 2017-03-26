var express = require('express');
var router = express.Router();
var checkSession = require('../jsbean/CheckSession');
var questionModel = require('../modules/qestionModule');
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

router.all('/ask', function(req, res) {
    var check = checkSession.check(req,res);

    if(!check){
        return;
    }
    var subflag = req.body['subflag'];
    if(subflag==undefined){
        res.render('ask', {title:'提问题',loginbean: check});
    }else{
        //发提问
        questionModel.ask(req,res);
    }
    /*var loginbean = req.session.loginbean;
    if(loginbean==undefined){
        res.send("<script>alert('登录过期,请重新登录');location.href='/';</script>");
        return;
    }
    console.log("ask question");*/
    //res.render('ask',{ title: '问吧 模版',loginbean:check });
    //res.render('ask', { title: '问吧 模版',loginbean:loginbean });
});

router.all('/reply',function (req,res) {
    var check = checkSession.check(req,res);

    if(!check){
        return;
    }
    if(req.body['subflag']!=undefined){
        questionModel.reply(req,res);
    }

});

router.get('/detail', function(req, res) {

    questionModel.queDetail(req,res);
});

router.post('/uploadImg', function(req, res) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./uploadtemp/";
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
        var uploadurl='/images/upload/'
        var file1 = files['filedata'];
        //var paraname = file1[0].fieldName;  //参数名filedata
        var originalFilename = file1[0].originalFilename; //原始文件名
        var tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
        //var fileSize = file1[0].size; //文件大小

        var timestamp=new Date().getTime(); //获取当前时间戳
        uploadurl += timestamp+"_"+originalFilename;
        var newPath= './public'+uploadurl;

        var fileReadStream = fs.createReadStream(tmpPath);
        var fileWriteStream = fs.createWriteStream(newPath);
        fileReadStream.pipe(fileWriteStream); //管道流
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
            console.log('copy over');
            res.send('{"err":"","msg":"'+uploadurl+'"}')
        });
    });
    //-----------------------------------------
    //res.send('上传');
});

router.post('/uploadFile', function(req, res) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./uploadtemp/";
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
        var uploadurl='/zipfile/upload/'
        var file1 = files['filedata'];
        //var paraname = file1[0].fieldName;  //参数名filedata
        var originalFilename = file1[0].originalFilename; //原始文件名
        var tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
        //var fileSize = file1[0].size; //文件大小

        var timestamp=new Date().getTime(); //获取当前时间戳
        uploadurl += timestamp+"_"+originalFilename;
        var newPath= './public'+uploadurl;

        var fileReadStream = fs.createReadStream(tmpPath);
        var fileWriteStream = fs.createWriteStream(newPath);
        fileReadStream.pipe(fileWriteStream); //管道流
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
            console.log('copy over');
            res.send('{"err":"","msg":"'+uploadurl+'"}')
        });
    });
    //-----------------------------------------
    //res.send('上传');
});

router.post('/uploadFlash', function(req, res) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./uploadtemp/";
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
        var uploadurl='/flash/upload/'
        var file1 = files['filedata'];
        //var paraname = file1[0].fieldName;  //参数名filedata
        var originalFilename = file1[0].originalFilename; //原始文件名
        var tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
        //var fileSize = file1[0].size; //文件大小

        var timestamp=new Date().getTime(); //获取当前时间戳
        uploadurl += timestamp+"_"+originalFilename;
        var newPath= './public'+uploadurl;

        var fileReadStream = fs.createReadStream(tmpPath);
        var fileWriteStream = fs.createWriteStream(newPath);
        fileReadStream.pipe(fileWriteStream); //管道流
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
            console.log('copy over');
            res.send('{"err":"","msg":"'+uploadurl+'"}')
        });
    });
    //-----------------------------------------
    //res.send('上传');
});

router.post('/uploadMedia', function(req, res) {
    var form = new multiparty.Form();
    //设置编码
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = "./uploadtemp/";
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    //form.maxFields = 1000;  设置所以文件的大小总和

    form.parse(req, function(err, fields, files) {
        var uploadurl='/media/upload/'
        var file1 = files['filedata'];
        //var paraname = file1[0].fieldName;  //参数名filedata
        var originalFilename = file1[0].originalFilename; //原始文件名
        var tmpPath = file1[0].path;//uploads\mrecQCv2cGlZbj-UMjNyw_Bz.txt
        //var fileSize = file1[0].size; //文件大小

        var timestamp=new Date().getTime(); //获取当前时间戳
        uploadurl += timestamp+"_"+originalFilename;
        var newPath= './public'+uploadurl;

        var fileReadStream = fs.createReadStream(tmpPath);
        var fileWriteStream = fs.createWriteStream(newPath);
        fileReadStream.pipe(fileWriteStream); //管道流
        fileWriteStream.on('close',function(){
            fs.unlinkSync(tmpPath);    //删除临时文件夹中的图片
            console.log('copy over');
            res.send('{"err":"","msg":"'+uploadurl+'"}')
        });
    });
    //-----------------------------------------
    //res.send('上传');
});


module.exports = router;