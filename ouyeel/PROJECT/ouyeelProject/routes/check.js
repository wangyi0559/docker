/**
 * Created by jimin on 17/5/2.
 */
var express = require('express');
var router = express.Router();
var LocalModel = require('../model/localapplicationmodel');
var CoreData = require('../model/coredatamodel');
var assert = require('assert');
var BC = require('../blockchain/bcoperation');
var AccountBalance = require('../model/accountbalance');
var ChangeModel = require('../model/changeapplicationmodel');
var TransferModel = require('../model/transferapplicationmodel');
var ReceiptModel = require('../model/receiptapplicationmodel');
var User = require('../model/user');

/**
 * 根据类型查询在售资产
 * 
 * 
 * type
 */

router.post('/unsold/query/by_type/', function (req, res, next) {
    CoreData.find({ 'state': "未售出", 'type': req.body.type }, function (err, docs) {
        res.json(docs);
    })
});

//查询在售数字资产
router.post('/onsell/query/', function (req, res, next) {
    CoreData.find({ 'state': "未售出", 'userId': req.body.userId }, function (err, docs) {
        res.json(docs);
    })
});

//查询未售出的的资产
router.post('/unsold/query', function (req, res, next) {
    CoreData.find({ 'state': "未售出" }, function (err, docs) {
        res.json(docs);
    })
});


/**
 * 已购买的资产查询
 * buyer
 */
router.post('/bought/query', function (req, res, next) {
    CoreData.find({ "buyer": req.body.userId, "state": '已售出' }, function (err, docs) {
        res.json(docs);
    })
});

/**
 * 已售出资产查询
 * buyer
 */
router.post('/sold/query', function (req, res, next) {
    CoreData.find({ "userId": req.body.userId, "state": '已售出' }, function (err, docs) {
        res.json(docs);
    })
});

//查询数字资产申请记录
router.post('/zichanApply/user/query', function (req, res, next) {
    ReceiptModel.find({ 'userId': req.body.userId }, function (err, docs) {
        res.json(docs);
    })
});

//购买数字资产
router.post('/buy/application', function (req, res, next) {
    var body = req.body;
    var dateTemp = new Date().toLocaleString();
    CoreData.findOne({ "bianhao": body.bianhao }, function (err, my_doc) {

        AccountBalance.findOne({ "username": body.userId }, function (err, ver) {

            if (ver != null && ver.balance != null) {
                //买方扣钱	
                AccountBalance.findOne({ "username": req.body.buyer }, function (err, ver1) {

                    if (ver1.balance < Number(my_doc.money)) {
                        return res.json({ status: "余额不足" });
                    }
                    if (ver1 != null && ver1.balance != null) {
                        AccountBalance.update({ "username": req.body.buyer }, { $set: { "balance": ver1.balance - Number(my_doc.money) } }, function (err, up1) {
                            if (err == null) {
                                console.log("/**************** buyer - 100 *******************/");
                            }
                        });
                        //卖方加钱
                        AccountBalance.update({ "username": body.userId }, { $set: { "balance": ver.balance + Number(my_doc.money) } }, function (err, up) {
                            if (err == null) {
                                console.log("/**************** userId + 100 *******************/");
                            }
                        });
                        //修改仓单状态	
                        CoreData.update({ "bianhao": req.body.bianhao }, { $set: { "state": "已售出", "buyer": req.body.buyer } }, function (err, upstate) {
                            /**
                             * Modify by wangyi on 17/8/27.
                             */
                            BC.changeOwner({ "bianhao": req.body.bianhao, "userId": body.buyer }, function (err, data) {
                                console.log(data);
                                CoreData.update({ "bianhao": req.body.bianhao }, { $set: { "changeTxid": data } }, function (err, up) {
                                    console.log(up);
                                    res.json({ status: "购买成功！放入您的已购资产，" + "区块链追踪号:\n" + data });
                                });
                            });
                            /**
                            * Modify by wangyi on 17/8/27.
                            */
                            BC.C2CPayCoin({ "userId": req.body.buyer, "payee": req.body.userId, "amount": my_doc.money, "userIdBalance": ver1.balance - Number(my_doc.money), "payeeBalance": ver.balance + Number(my_doc.money), "payDate": dateTemp }, function (err, data) {
                                console.log(data);
                                TransferModel.update({ "userId": req.body.userId }, { $set: { "txid": data } }, function (err, up) {
                                    console.log(up);

                                });
                            });

                        });

                    } else {
                        console.log("app balance is null");
                    }
                });

            } else {
                console.log("app balance is null");
            }
        });
    });
    // }

});  //my_doc.money 为金额


// });



/**
 * 增加充值申请单。
 */

router.post('/chongzhi/app', function (req, res, next) {
    var body = req.body;
    var dateTemp = new Date().toLocaleString();
    console.log(dateTemp);
    if (Number(body.amount) <= 0) {
        return res.json({ status: "请输入正确的金额" });
    }
    var app = new ChangeModel({
        userId: body.userId,
        amount: body.amount,
        type: "人民币兑换欧冶币",
        changedate: dateTemp,
        changeAgree: '3'
    });
    app.save(function (err, result) {
        assert.equal(err, null);
        console.log("local data 1 saved");
        console.log(result);
        /**
         * Modify by wangyi on 17/8/27.
         */


        res.json({ status: "充值申请已提交" });
    });
});

/**
 * 增加兑换申请单。
 */

router.post('/duihuan/app', function (req, res, next) {
    var body = req.body;
    var dateTemp = new Date().toLocaleString();
    console.log(dateTemp);
    if (Number(body.amount) <= 0) {
        return res.json({ status: "请输入正确的金额" });
    }
    var app = new ChangeModel({
        userId: body.userId,
        amount: body.amount,
        type: "欧冶币兑换人民币",
        changedate: dateTemp,
        changeAgree: '3'
    });
    app.save(function (err, result) {
        assert.equal(err, null);
        console.log("local data 1 saved");
        console.log(result);
        /**
         * Modify by wangyi on 17/8/27.
         */


        res.json({ status: "兑换申请已提交" });
    });
});
/**
 * 轮询充值申请单数据库
 * userId
 */
router.post('/chongzhi/query', function (req, res, next) {
    ChangeModel.find({ 'type': "人民币兑换欧冶币" }, function (err, docs) {
        res.json(docs);
    })
});
/**
 * 轮询兑换申请单数据库
 * userId
 */
router.post('/duihuan/query', function (req, res, next) {
    ChangeModel.find({ 'type': "欧冶币兑换人民币" }, function (err, docs) {
        res.json(docs);
    })
});

/**
 * 轮询查看自己相关的转账记录
 * userId
 */
router.post('/transfer/query', function (req, res, next) {
    TransferModel.find({ $or: [{ 'userId': req.body.userId }, { 'payee': req.body.userId }] }, function (err, docs) {
        res.json(docs);
    })
});

//兑换处理响应

router.post('/change/verify', function (req, res, next) {
    var dateTemp = new Date().toLocaleString();
    ChangeModel.findByIdAndUpdate(req.body._id, { $set: { 'changeAgree': req.body.agree } }, function (err, doc) {
        console.log(doc); //MDragon
        res.json(doc);

        if (req.body.agree == "1") {

            //申请方加钱
            AccountBalance.findOne({ "username": doc.userId }, function (err, ver) {

                if (ver != null && ver.balance != null && doc.type == "人民币兑换欧冶币") {
                    AccountBalance.update({ "username": doc.userId }, { $set: { "balance": ver.balance + Number(doc.amount) } }, function (err, up) {
                        if (err == null) {
                            console.log("/**************** userId + + *******************/");

                        }
                    })
                } else if (ver != null && ver.balance != null && doc.type == "欧冶币兑换人民币") {
                    AccountBalance.update({ "username": doc.userId }, { $set: { "balance": ver.balance - Number(doc.amount) } }, function (err, up) {
                        if (err == null) {
                            console.log("/**************** userId + + *******************/");

                        }
                    })
                } else {
                    console.log("app balance is null");
                }
            });
            ChangeModel.findById(req.body._id, function (err, ver1) {
                BC.B2CPayCoin({ "userId": ver1.userId, "amount": ver1.amount, "type": ver1.type, "changedate": dateTemp, "changeAgree": req.body.agree }, function (err, data) {
                    console.log(data);
                    ChangeModel.findByIdAndUpdate(req.body._id, { $set: { "txid": data } }, function (err, up) {
                        console.log(up);
                    });
                });
            });

        }

    });
});

//兑换处理响应

router.post('/change/verify2', function (req, res, next) {
    ChangeModel.findByIdAndUpdate(req.body._id, { $set: { changeAgree: req.body.agree } }, function (err, doc) {
        console.log(doc); //MDragon
        res.json(doc);

    });
});

/**
 * 增加转账记录；并完成转账
 */
router.post('/transfer/Money', function (req, res, next) {
    var body = req.body;
    var _id;
    var dateTemp = new Date().toLocaleString();
    var app = new TransferModel({
        userId: body.userId,
        payee: body.payee,
        transferdate: dateTemp,
        // userIdBalance: _userIdBalance,
        // payeeBalance: _payeeBalance,
        amount: body.amount,
    });
    if (Number(body.amount) <= 0) {
        return res.json({ status: "请输入正确的金额" });
    }
    if (body.userId == body.payee) {
        return res.json({ status: "请勿向自己转账" });
    }
    if (Number(body.amount <= 0)) {
        return res.json({ status: "欧冶币余额不足，请充值" });
    }

    //查找收款人
    AccountBalance.findOne({ "username": body.payee }, function (err, ver) {
        if (ver == null) {
            return res.json({ status: "收款人不存在" });
        }
        if (ver != null && ver.balance != null) {
            app.save(function (err, result) {
                assert.equal(err, null);
                _id = result._id;
                console.log("transfer data 1 saved");
                console.log(result);
                //res.json(result);
            });

            //查找付款人	
            AccountBalance.findOne({ "username": body.userId }, function (err, ver1) {
                if (ver1.balance < Number(body.amount)) {
                    return res.json({ status: "余额不足" });
                }
                if (ver1 != null && ver1.balance != null) {
                    //付款人扣钱
                    AccountBalance.update({ "username": body.userId }, { $set: { "balance": ver1.balance - Number(body.amount) } }, function (err, up1) {
                        if (err == null) {
                            console.log("/**************** payer -  *******************/");
                        }
                    });
                    //收款人加钱
                    AccountBalance.update({ "username": body.payee }, { $set: { "balance": ver.balance + Number(body.amount) } }, function (err, up) {
                        if (err == null) {
                            console.log("/**************** payee +  *******************/");
                        }
                    });
                    /**
                     * Modify by wangyi on 17/8/27.
                     */
                    BC.C2CPayCoin({ "userId": req.body.userId, "payee": req.body.payee, "amount": req.body.amount, "userIdBalance": ver1.balance - Number(body.amount), "payeeBalance": ver.balance + Number(body.amount), "payDate": dateTemp }, function (err, data) {
                        console.log(data);
                        TransferModel.findByIdAndUpdate(_id, { $set: { "txid": data } }, function (err, up) {
                            console.log(up);
                            res.json({ status: "转账成功！" + "区块链追踪号:\n" + data });
                        });
                    });


                } else {
                    console.log("app balance is null");
                }
            });
        } else {
            console.log("app balance is null");
        }
    });



});

/**
 * 增加仓单申请单。
 */

router.post('/zichanApply/app', function (req, res, next) {
    var body = req.body;
    var app = new ReceiptModel({
        state: '未售出', //状态                state
        adminAgree: '3',
        userId: body.userId,
        cangdanId: body.cangdanId,  //仓单编号
        type: body.type,//类型（大宗实物、票据、产能、实物）
        money: body.money,
        //       userId: name,//用户ID
        pinming: body.pinming, //品名
        guige: body.guige, //
        caizhi: body.caizhi, //
        chandi: body.chandi, //
        shuliang: body.shuliang, //
        zhongliang: body.zhongliang, //
        jianshu: body.jianshu, //
        cangku: body.cangku  //交割仓库

    });
    app.save(function (err, result) {
        assert.equal(err, null);
        console.log("local data 1 saved");
        console.log(result);
        res.json(result);
    });
});

/**
 * 轮询数字资产申请单数据库
 * userId
 */
router.post('/zichanApply/admin/query', function (req, res, next) {
    ReceiptModel.find({ 'adminAgree': '3' }, function (err, docs) {
        res.json(docs);
    })
});

/**
 * 轮询已处理数字资产申请单数据库
 * userId
 */
router.post('/zichanApplyDone/admin/query', function (req, res, next) {
    ReceiptModel.find({ "$or": [{ 'adminAgree': '1' }, { 'adminAgree': '2' }] }, function (err, docs) {
        res.json(docs);
    })
});


//管理员对仓单申请处理

router.post('/zichanApply/verify', function (req, res, next) {
    ReceiptModel.findByIdAndUpdate(req.body._id, { $set: { adminAgree: req.body.adminAgree } }, function (err, doc) {
        console.log(doc); //MDragon
        res.json(doc);

        var app = new CoreData({
            state: '未售出',//状态                state
            //            adminAgree: req.body.adminAgree,
            bianhao: req.body._id,//数字资产编号
            userId: doc.userId,
            cangdanId: doc.cangdanId,  //仓单编号
            type: doc.type,//类型（大宗实物、票据、产能、实物）
            money: doc.money,
            pinming: doc.pinming, //品名
            guige: doc.guige, //
            caizhi: doc.caizhi, //
            chandi: doc.chandi, //
            shuliang: doc.shuliang, //
            zhongliang: doc.zhongliang, //
            jianshu: doc.jianshu, //
            cangku: doc.cangku  //交割仓库

        });
        //管理员同意，将其插入仓单数据库
        if (req.body.adminAgree == '1') {
            app.save(function (err, result) {
                assert.equal(err, null);
                console.log("coredata 1 saved");
                console.log(result._id);
                // 本地数据上传区块链

                /**
                 * Modify by wangyi on 17/8/27.
                 */
                BC.createDigitalAssets({ "bianhao": result.bianhao, "userId": result.userId, "money": result.money, "type": result.type, "state": result.state, "buyer": "0", "pinming": result.pinming, "guige": result.guige, "caizhi": result.caizhi, "chandi": result.chandi, "shuliang": result.shuliang, "zhongliang": result.zhongliang, "jianshu": result.jianshu, "cangku": result.cangku }, function (err, data) {
                    console.log(data);
                    CoreData.update({ "bianhao": result.bianhao }, { $set: { "txid": data } }, function (err, up) {
                        console.log(up);
                    });
                });
            }
            )
        }

        //	  }

    });
});

//二维码支付

router.post('/qrcode', function (req, res, next) {
    User.findOne({ "username": req.body.username }, function (err, ver2) {
        console.log(ver2);
        if (ver2 == null || req.body.password != ver2.password) {
            return res.status(200).json({ status: '用户名或密码错误！' });
        }
        else {
            var dateTemp = new Date().toLocaleString();
            var app = new TransferModel({
                userId: req.body.username,
                payee: req.body.payee,
                transferdate: dateTemp,
                amount: req.body.amount,
            });

            //收款人加钱
            AccountBalance.findOne({ "username": req.body.payee }, function (err, ver) {
                var dateTemp = new Date().toLocaleString();
                var _id;
                AccountBalance.findOne({ "username": req.body.username }, function (err, ver1) {
                    if (ver1.balance < Number(req.body.amount)) {
                        return res.json({ status: "余额不足" });
                    }
                    if (Number(req.body.amount) <= 0) {
                        return res.json({ status: "请输入正确的金额" });
                    }

                    app.save(function (err, result) {
                        _id = result._id;
                        assert.equal(err, null);
                        console.log("transfer data 1 saved");
                        console.log(result);
                    });
                    if (ver1 != null && ver1.balance != null) {
                        //付款人扣钱
                        AccountBalance.update({ "username": req.body.username }, { $set: { "balance": ver1.balance - Number(req.body.amount) } }, function (err, up1) { });
                        //收款人加钱
                        AccountBalance.update({ "username": req.body.payee }, { $set: { "balance": ver.balance + Number(req.body.amount) } }, function (err, up) { });
                        /**
                         * Modify by wangyi on 17/8/27.
                         */
                        BC.C2CPayCoin({ "userId": req.body.username, "payee": req.body.payee, "amount": req.body.amount, "userIdBalance": ver1.balance - Number(req.body.amount), "payeeBalance": ver.balance + Number(req.body.amount), "payDate": dateTemp }, function (err, data) {
                            TransferModel.findByIdAndUpdate(_id, { $set: { "txid": data } }, function (err, up) {
                                console.log(up);
                                return res.status(200).json({ status: "转账成功！" + "区块链追踪号:\n" + data });
                            });

                        });

                    }
                });

            });


        }
    });
});



module.exports = router;