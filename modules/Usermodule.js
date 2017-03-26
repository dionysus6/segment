var connPool = require("./ConnPool");
var LoginBean = require("../jsbean/LoginBean");
module.exports = {
    signup: function (req,res) {
        pool = connPool();
        pool.getConnection(function (err,conn) {
            if(err){
                res.send("error database");
                console.log(err);
                return;
            }
            var userAddSql = 'insert into user (email,pwd,nickname,createtime) values(?,?,?,current_timestamp)';
            var param = [req.body['email'],req.body['pwd'],req.body['nickname']];
            conn.query(userAddSql,param,function(err,rs){
                if(err){
                    //console.log('insert err:',err.message);
                    //res.send("signup错误,错误原因:"+err.message);
                    var errstr = err.message;
                    var sendstr = "<script>";
                    console.log(errstr);
                    if(errstr.indexOf('emailuniq')>-1){
                        sendstr += "alert('email has existed')";
                    }else if(errstr.indexOf('nichenguiq')>-1){
                        sendstr += "alert('nickname has existed')";
                    }else{
                        sendstr += "alert('database error')";
                    }
                    sendstr +=";location.href='/'</script>";
                    res.send(sendstr);
                    return;
                }
                //res.send("<script>alert('signup success');location.href='/';</script>");
                res.redirect(307,"./login");
            });
            conn.release();
        });
    },
    login: function (req,res) {
        pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function(err,conn)
        {
            if(err)
            {
                //console.log('insert err:',err.message);
                res.send("获取连接错误,错误原因:"+err.message);
                return;
            }
            var userSql = 'select uid,nickname from user where email=? and pwd=?';
            var param = [req.body['email'],req.body['pwd']];
            console.log(req.body['email']+req.body['pwd'])
            console.log("url+"+req.body['urlink']);
            conn.query(userSql,param,function(err,rs){
                if(err){
                    //console.log('insert err:',err.message);
                    res.send("数据库错误,错误原因:"+err.message);
                    return;
                }
                console.log("rs:"+rs.toString());
                console.log("rs.length:"+rs.length);
                //console.log(rs.length);
                if(rs.length>0){
                    var loginbean = new LoginBean();
                    loginbean.id=rs[0].uid;
                    loginbean.nickname = rs[0].nickname;
                    req.session.loginbean = loginbean;
                    res.redirect(req.body['urlink']);// return to index page
                    //res.send('登录成功');
                }else{
                    var sendStr = "<script>alert('email/密码错误');history.back()</script>";
                    res.send(sendStr);
                }
            });
            conn.release();
        });

    }
}