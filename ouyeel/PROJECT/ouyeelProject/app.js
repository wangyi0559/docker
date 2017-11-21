var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var CoreDataModel = require('./model/coredatamodel');
var assert = require('assert');
var db = require('./model/datebase');
var LocalModel = require('./model/localapplicationmodel');
var BC = require('./blockchain/bcoperation');

// database connection.
// mongoose.connect(config.mongoUrl);
// var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error: '));
db.once('open',function () {
    console.log('Mongoose Server connected.');
    //初始化先删除所有本地申请信息和病历信息。
    CoreDataModel.remove({}, function (err) {

    });
    LocalModel.remove({}, function (err) {

    });
    //初始化本地申请信息和病历信息。
var dateTemp = new Date().toLocaleString();
dateTemp1=dateTemp+"1";
dateTemp2=dateTemp+"2";
dateTemp3=dateTemp+"3";
    /************* 病历信息 ***************/
    var coreData1 = new CoreDataModel({
        state: '未售出', //状态                state
        bianhao: dateTemp1,
        userId: 1001,
        cangdanId: '872102028982',  //仓单编号
        type: '大宗实物',//类型（大宗实物、票据、产能、实物）
        money: 8888,
        //       userId: name,//用户ID
        pinming: '镀铝锌板卷', //品名
        guige: '2.0*1250*C', //
        caizhi: 'DC51D+AZ', //
        chandi: '梅钢', //
        shuliang: '336件', //
        zhongliang: '826.332吨', //
        jianshu: '336件', //
        cangku: '辽宁国储物流股份有限公司沈阳分公司（二三九处）...'  //交割仓库
    });
    var coreData2 = new CoreDataModel({
        state: '未售出', //状态                state
        bianhao: dateTemp2,
        userId: 1001,
        cangdanId: '160602021121',  //仓单编号
        type: '票据',//类型（大宗实物、票据、产能、实物）
        money: 8945,
        //       userId: name,//用户ID
        pinming: '螺纹钢', //品名
        guige: '1.0*1250*C', //
        caizhi: 'DC51D+AZ(HZ)', //
        chandi: '梅钢', //
        shuliang: '2手', //
        zhongliang: '588.462吨', //
        jianshu: '200件', //
        cangku: '上海欧冶物流股份有限公司江西巨华一号库'  //交割仓库
    });
    var coreData3 = new CoreDataModel({
        state: '未售出', //状态                state
        bianhao: dateTemp3,
        userId: 1002,
        cangdanId: '023602023426',  //仓单编号
        type: '产能',//类型（大宗实物、票据、产能、实物）
        money: 100,
        //       userId: name,//用户ID
        pinming: '酸洗', //品名
        guige: '2.5*1250*C', //
        caizhi: 'SPHC', //
        chandi: '湛江钢铁', //
        shuliang: '2手', //
        zhongliang: '350吨', //
        jianshu: '66件', //
        cangku: '上海新通豪国际物流有限公司一号库'  //交割仓库
    });

    coreData1.save(function(err, result){
        assert.equal(err, null);
        console.log("coredata 1 saved");
        console.log(result.cangdanId);
        // 本地数据上传区块链
        
 /**
 * Modify by wangyi on 17/8/27.
 */
var mytimeout=setTimeout(function(){
    BC.createDigitalAssets({ 
        "bianhao": result.bianhao, 
        "userId": result.userId, 
        "money": result.money, 
        "type": result.type, 
        "state": result.state, 
        "buyer": "0", 
        "pinming": result.pinming, 
        "guige": result.guige, 
        "caizhi": result.caizhi, 
        "chandi": result.chandi, 
        "shuliang": result.shuliang, 
        "zhongliang": result.zhongliang, 
        "jianshu": result.jianshu, 
        "cangku": result.cangku 
        }, function (err, response) {
            if(err == null){
                console.log("save in block");
                console.log(response);
                CoreDataModel.update({ "bianhao": result.bianhao }, { $set: { "txid": response } }, function (err, up) {
                    console.log(up);
                });
            } else {
                console.log("error-------");
                console.log(err);
            }
        });
},3000);



    });
    coreData2.save(function(err, result){
        assert.equal(err, null);
        console.log("coredata 2 saved");
        console.log(result.cangdanId);
        // 本地数据上传区块链
 /**
 * Modify by wangyi on 17/8/27.
 */
var mytimeout=setTimeout(function(){
    BC.createDigitalAssets({ 
        "bianhao": result.bianhao, 
        "userId": result.userId, 
        "money": result.money, 
        "type": result.type, 
        "state": result.state, 
        "buyer": "0", 
        "pinming": result.pinming, 
        "guige": result.guige, 
        "caizhi": result.caizhi, 
        "chandi": result.chandi, 
        "shuliang": result.shuliang, 
        "zhongliang": result.zhongliang, 
        "jianshu": result.jianshu, 
        "cangku": result.cangku 
        }, function (err, response) {
            if(err == null){
                console.log("save in block");
                console.log(response);
                CoreDataModel.update({ "bianhao": result.bianhao }, { $set: { "txid": response } }, function (err, up) {
                    console.log(up);
                });
            } else {
                console.log("error-------");
                console.log(err);
            }
        });
},6000);


    });
    coreData3.save(function(err, result){
        assert.equal(err, null);
        console.log("coredata 3 saved");
        // 本地病历上传区块链
        console.log(result.cangdanId);
 /**
 * Modify by wangyi on 17/8/27.
 */
var mytimeout=setTimeout(function(){
    BC.createDigitalAssets({ 
        "bianhao": result.bianhao, 
        "userId": result.userId, 
        "money": result.money, 
        "type": result.type, 
        "state": result.state, 
        "buyer": "0", 
        "pinming": result.pinming, 
        "guige": result.guige, 
        "caizhi": result.caizhi, 
        "chandi": result.chandi, 
        "shuliang": result.shuliang, 
        "zhongliang": result.zhongliang, 
        "jianshu": result.jianshu, 
        "cangku": result.cangku 
        }, function (err, response) {
            if(err == null){
                console.log("save in block");
                console.log(response);
                CoreDataModel.update({ "bianhao": result.bianhao }, { $set: { "txid": response } }, function (err, up) {
                    console.log(up);
                });
            } else {
                console.log("error-------");
                console.log(err);
            }
        });
},9000);


    });
    /***************** 本地申请信息 ******************/
});
// routers.
var routes = require('./routes/index');
var users = require('./routes/users');
var check = require('./routes/check');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//passport config
var User = require('./model/user');
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    res.set('Access-Control-Allow-Origin','*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
// use routers.
app.use('/', routes);
app.use('/users', users);
app.use('/check', check);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});

module.exports = app;
