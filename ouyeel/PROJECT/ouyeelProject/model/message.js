/**
 * Created by wangyi on 17/8/27.
 */
var config = require('../config');
var BCMessageObj = function(){
    return {
        "username":"Jim",
        "orgname":"org1",
        "peers":  ["localhost:7051"],
        "fcn": "调用方法",
        "args":["参数1", "参数2","参数3","参数4"]
    }
};

  
/**
 *
 * @param args 用户ID| 用户身份| 人民币余额| 欧冶币余额 
 * @returns {BCMessageObj}
 * @constructor
 */
function BCMessageOY (fcn,args) {
    var msg = new BCMessageObj();
    msg.fcn = fcn;
    msg.args = args;
    return msg;
}

function BCMessage(username, orgname, peers, fcn, args) {
    this.username = username;
    this.orgname = orgname;
    this.peers = peers;
    this.fcn = fcn;
    this.args = args;
    if ('undefined' == typeof BCMessage._initialized) {
        BCMessage.prototype.setPeers = function (p) {
            this.peers = p;
        }
        BCMessage.prototype.setFcn = function (f) {
            this.fcn = f;
        }
        BCMessage.prototype.setArgs = function (a) {
            this.args = a;
        }
    }
    BCMessage._initialized = true;
}

exports.BCMessageOY = BCMessageOY;