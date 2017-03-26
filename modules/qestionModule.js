var connPool = require("./ConnPool");
var async = require('async');
module.exports={
    ask:function(req,res){
        loginbean = req.session.loginbean;
        pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function(err,conn){
            var userAddSql = 'insert into question (typeid,typename,title,content,uid,nickname,createtime) values(?,?,?,?,?,?,current_timestamp)';
            var param = [req.body['typeid'],req.body['typename'],req.body['title'],req.body['content'],loginbean.id,loginbean.nickname];

            conn.query(userAddSql,param,function(err,rs){
                if(err){
                    console.log(err);
                    //console.log('insert err:',err.message);
                    //res.send("数据库错误,错误原因:"+err.message);
                    return;
                }
                res.send("<script>alert('提问成功');location.href='/';</script>");
                //res.redirect('../');
            })
            conn.release();
        });
    },

    reply:function(req,res){
        loginbean = req.session.loginbean;
        pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function(err,conn){
            var sql1 = 'insert into replies (qid,content,uid,nickname) value(?,?,?,?)';
            var sql2 = 'update question set renum=renum+1 where qid = ?'
            var param1 = [req.body['qid'],req.body['content'],loginbean.id,loginbean.nickname];
            var param2 = [req.body['qid']];
            conn.beginTransaction(function (err) {
                if (err) {
                    console.log('有错111');
                    //return callback(err, null);
                    res.send('启动事物处理出错');
                    return;
                }
                async.series([ //串行series,并行parallel
                    function(callback) {
                        conn.query(sql1,param1,function(err,rs){
                            if(err){
                                console.log('有错'+err.message);
                                callback(err,1);
                                return;
                            }
                            //console.log('执行第1条完毕');
                            callback(err,rs);//没有则callback(null,1);第2个参数是返回结果
                        });
                    },
                    function(callback) {
                        conn.query(sql2,param2,function(err,rs){
                            if(err){
                                console.log('拿不到链接有错'+err.message);
                                callback(err,2);
                                return;
                            }
                            //console.log('执行第1条完毕');
                            callback(err,rs);//没有则callback(null,1);第2个参数是返回结果
                        });
                    }
                ],function(err, result) {
                    //console.log(result);
                    if(err) {
                        //console.log('调用回滚1');
                        conn.rollback(function() {
                            //throw err;
                        });
                        res.send('数据库错误:'+err);
                        return;
                    }
                    // 提交事务
                    conn.commit(function(err) {
                        if (err) {
                            console.log('调用回滚2');
                            conn.rollback(function() {
                                //throw err;
                            });
                            res.send('数据库错误:'+err);
                            console.log('提交事物出错');
                        }
                        res.redirect('./detail?qid='+req.body['qid']);
                        //console.log('success!');
                    });
                });

            });
            conn.release();
        });
    },

    queList: function (req,res,loginbean) {
        var pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function (err, conn) {
            if (err) {
                //console.log('insert err:',err.message);
                res.send("获取连接错误,错误原因:" + err.message);
                return;
            }
            var page = 1;

            if(req.query['page']!=undefined){
                page = parseInt(req.query['page']);
                if(page<1){
                    page=1;
                }
            }
            var pageSize = 2;
            var pointStart = (page -1)*pageSize;
            var listSql = 'select qid,title,looknum,renum,finished,updtime,createtime from question order by qid desc limit ?,?';
            var coutSql = 'select count(*) as count from question';
            var param = [pointStart,pageSize];
            var count = 0;
            var countPage = 0;
            async.series({
                one: function (callack) {
                    conn.query(coutSql, [], function (err, rs) {
                        count=rs[0]["count"];
                        countPage = Math.ceil(count/pageSize);
                        if(page>countPage){
                            page=countPage;
                            pointStart = (page-1)*pageSize;
                            param = [pointStart,pageSize];
                        }
                        callack(null,rs);
                    });
                },
                two: function(callback){
                    conn.query(listSql,param,function(err,rs){
                        callback(null, rs);
                    })
                }
            },function(err, rs) {
                //console.log(results);

                var result=rs['two'];
                res.render('index', {title: '问吧 模版',loginbean:loginbean,page:page,rs:result,count:count,countPage:countPage});
            });


            // console.log(req.body['email'] + req.body['pwd'])
            // conn.query(listSql, param, function (err, rs) {
            //     if (err) {
            //         //console.log('insert err:',err.message);
            //         res.send("数据库错误,错误原因:" + err.message);
            //         return;
            //     }
            //     console.log("rs:" + rs.toString());
            //     console.log("rs.length:" + rs.length);
            //     //console.log(rs.length);
            //     res.render('index', {title: '问吧 模版', loginbean: loginbean, rs: rs});
            // });

            conn.release();
        });
    },

    queDetail: function(req,res,loginbean){
        qid = req.query['qid'];
        if(qid!=undefined){
            var sqlupd = 'update question set looknum=looknum+1 where qid = ?';
            var sqldetail = "select qid,nickname,title,content,uid,looknum,renum,finished,updtime,date_format(createtime,'%Y-%c-%d') as createtime from question where qid=?";
            var sqlReply="select rpid,content,uid,nickname,date_format(createtime,'%Y-%c-%d') as createtime from replies where qid=?";
            var updParam = [qid];

        }else{
            res.send('no qid');
        }
        var pool = connPool();
        //从pool中获取连接(异步,取到后回调)
        pool.getConnection(function (err, conn) {
            if (err) {
                console.log('insert err:',err.message);
                res.send("获取连接错误,错误原因:" + err.message);
                return;
            }

            async.series({
                one: function (callack) {
                    conn.query(sqlupd,updParam, function (err, rs) {

                        callack(null,rs);
                    });
                },
                two: function(callback){
                    conn.query(sqldetail,updParam,function(err,rs){
                        callback(null, rs);
                    })
                },
                three: function(callback){
                    conn.query(sqlReply,updParam,function(err,rs){
                        callback(null, rs);
                    })
                }
            },function(err, rs) {
                if(err){
                    console.log(err);
                    return
                }
                console.log(rs);
                var loginbean = req.session.loginbean;
                var result=rs['two'];
                var rsReply=rs['three'];
                res.render('queDetail', {title: '问吧 模版',rs:result,rsReply:rsReply,loginbean:loginbean});
            });
        });
    }
}