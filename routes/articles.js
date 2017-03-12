var express = require('express');
var router = express.Router();
var markdown = require('markdown').markdown;
var middleware = require('../middleware/index');


//打开添加文章的页面
router.get('/add',middleware.checkLogin, function(req, res, next) {
    console.log("打开添加文章页面");
    res.render("articles/addArticle",{title:"发表文章"});

});

router.post("/add",middleware.checkLogin,function (req,res,next) {
   console.log("提交新博客的信息");
    var article = req.body;
        article.user = req.session.user._id;
        new Model('Article')(article).save(function (err,art) {
            if(err)
            {
                console.log(err);
                //发表文章失败,转到发表页面
                return res.redirect("/articles/add");
            }
            //发表成功后转到首页
            return res.redirect("/")

        })

});
router.post("/edit/:_id",middleware.checkLogin,function (req,res,next) {
    console.log("修改博客的信息");
    var article = req.body;

     Model('Article').update({_id:req.params._id},
        article,
        function (err,art) {
        if(err)
        {
            console.log(err);
            req.flash("error","修改失败");
        }
        console.log(art);
        //发表文章失败,转到发表页面
            console.log("更新成功");
            req.flash("success","修改成功");
        return res.redirect("/articles/detail/"+req.params._id);
    })
});

router.get("/detail/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
       var articleId= req.params._id;
       Model('Article').findOne({_id:articleId},function (err,article) {
           article.content = markdown.toHTML(article.content);
           res.render('articles/detail',{title:'查看文章',art:article});
       })
    
})

router.get("/edit/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
    var articleId= req.params._id;




    Model('Article').findOne({_id:articleId},function (err,article) {

        //添加权限判断,判断当前的登陆人和文章发表人是否一致
        //如果不一致转回详情页面,并显示错误信息
        if(req.session.user && req.session.user._id!= article.user)
        {
            req.flash("error","您没有权限修改此文章");
            return res.redirect("/articles/detail/"+article._id);
        }


        console.log("_id="+articleId);
        console.log(article);
        res.render('articles/editArticle',{title:'查看文章',art:article});
    })

})


router.get("/delete/:_id",function (req,res,next) {
    //路径参数中如果参数是id,那么名字必须是_id
    var articleId= req.params._id;
    Model('Article').remove({_id:articleId},function (err,art) {

        console.log(art)
        if(err)
        {
            req.flash("error","删除失败");
        }
        req.flash("success","删除成功");
        res.redirect("/");
    })
})


module.exports = router;
