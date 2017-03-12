/**
 * Created by maggie on 2017/3/7.
 */
var mongoose=require('mongoose');
var setting= require('../setting');
var models = require('./models');
var   Schema = mongoose.Schema;

mongoose.connect(setting.url);
mongoose.model("User",new Schema(models.User));
mongoose.model("Article",new Schema(models.Article));

//提供了一个根据名称获得数据模型的方法
global.Model=function (type) {
     return mongoose.model(type);
}


