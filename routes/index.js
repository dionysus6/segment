var express = require('express');
var router = express.Router();
var questionmodule = require('../modules/qestionModule');
/* GET home page. */

router.get('/', function(req, res) {
  var loginbean = req.session.loginbean;
  questionmodule.queList(req,res,loginbean);
  //console.log(req.session);
  //console.log(loginbean.nickname);
  //res.render('index', { title: '问吧 模版',loginbean:loginbean });
   // res.send('hello index');
});

module.exports = router;
