var express = require('express');
var router = express.Router();
var usermodule = require("../modules/Usermodule");

/* GET users listing. */
router.all('/login', function(req, res) {
    var subflag = req.body["subflag"];
    if(subflag == undefined){
        res.render('login',{});
    }else{
        usermodule.login(req,res);
    }

});
router.get('/logout',function(req,res){
    req.session.destroy(function (err) {
        //console.log("logout+"+req.query['urlink']);
        res.redirect("/");
    })
});
router.post('/signup', function(req, res) {
    usermodule.signup(req,res);

});
module.exports = router;
