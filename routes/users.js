var express = require('express');
var router = express.Router();
var middleware = require("../middleware/index");


//访问登陆页面
router.get('/login', function(req, res, next) {

     console.log("打开登陆页面");
    res.render("users/login",{"title":"登陆"})
});

//使用post方式提交登陆信息
router.post('/login', function(req, res,next) {
  console.log("提交登陆信息");
    var user = req.body;
    user.password= md5(user.password);
    //查询数据库,找到是否有匹配的记录
    Model("User").findOne(user,function (err,u) {
        console.log(u);
        if(u)
        {
            //用户登陆成功  将用户的登陆信息保存到session中
            req.flash("success","登陆成功");
            req.session.user =u;
            return res.redirect("/");
        }
        req.flash("error","登陆失败,用户名或密码错");
        return res.redirect("/users/login");

    })
});

//打开注册页面
router.get('/reg',middleware.checkNotLogin,function (req,res,next) {
  console.log("打开注册页面");
    res.render("users/reg",{title:"注册"});
});
//提交注册信息
router.post('/reg',function (req,res,next) {

    console.log("提交注册信息");

    //获得用户提交的表单数据
    var user = req.body;
    if(user.password != user.pwd2)
    {
        //密码和确认密码不一致
        req.flash('error',"两次密码不一致");
        //重定向到注册页面
        return res.redirect("/users/reg");
    }
    //删除确认密码的属性
    delete user.pwd2;
    //把密码用md5加密
    user.password = md5(user.password);
    //根据邮箱生成头像地址
    user.avatar="http://s.gravatar.com/avatar/"+md5(user.email)+"?s=80";
    //将user对象保存到数据库中
    new Model("User")(user).save(function (err,user) {
        if(err)
        {
            req.flash("error","注册失败");
            res.redirect("/users/reg");
        }
        //在session中保存用户的登陆信息
        req.flash("success","注册成功");
        req.session.user=user;
        res.redirect("/");
    })
});
//注销用户登陆
router.get('/logout',function (req,res,next) {

    req.session.user=null;
    console.log("退出登陆");
    req.flash("success","用户登陆已注销");
    res.redirect("/");

});


function md5(val){
    return require('crypto').createHash('md5').update(val).digest('hex');
}
module.exports = router;
