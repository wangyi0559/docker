'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var cors = require('cors');
var config = require('./config.json');
var helper = require('./app/helper.js');
var channels = require('./app/create-channel.js');
var join = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var invoke = require('./app/invoke-transaction.js');
var query = require('./app/query.js');
var host = process.env.HOST || config.host;
var port = process.env.PORT || config.port;
///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// SET CONFIGURATONS ////////////////////////////
///////////////////////////////////////////////////////////////////////////////
app.options('*', cors());
app.use(cors());
//support parsing of application/json type post data
app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({
	extended: false
}));


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////// START SERVER /////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var server = http.createServer(app).listen(port,host, function() {});
server.timeout = 240000;

function getErrorMessage(field) {
	var response = {
		success: false,
		message: field + ' field is missing or Invalid in the request'
	};
	return response;
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////// REST ENDPOINTS START HERE ///////////////////////////
///////////////////////////////////////////////////////////////////////////////
// 1注册用户组织，每个必须
//  127.0.0.1:8080/api/users
app.get('/api/users', function(req, res) {
	helper.getRegisteredUsers(config.username, config.orgname, true).then(function(response) {
		if (response && typeof response !== 'string') {
			res.json({
				success: true
			});		
		} else {
			res.json({
				success: false
			});
		}
	});
});

// 2创建通道，只需要一次
//  127.0.0.1:8080/api/createChannel
app.get('/api/createChannel', function(req, res) {
	channels.createChannel(config.channelName, config.channelConfigPath, config.username, config.orgname)
	.then(function(message) {
		res.json({
			success: true
		});	
	});
});

// 3节点加入通道，每个必须
//  127.0.0.1:8080/api/joinchannel
app.get('/api/joinchannel', function(req, res) {
	join.joinChannel(config.channelName, config.peers, config.username, config.orgname)
	.then(function(message) {
		res.json({
			success: true
		});							
	});	
});

// 4安装智能合约，每个必须
//  127.0.0.1:8080/api/installChaincode
app.get('/api/installChaincode', function(req, res) {
	install.installChaincode(config.peers, config.chaincodeName, config.chaincodePath, config.chaincodeVersion, config.username, config.orgname)
	.then(function(message) {
		res.json({
			success: true
		});										
	});
});

// 5实例化智能合约,看需求
//  127.0.0.1:8080/api/instantiateChaincode
app.get('/api/instantiateChaincode', function(req, res) {
	instantiate.instantiateChaincode(config.channelName, config.chaincodeName, config.chaincodeVersion, config.instantiateFunctionName, config.instantiateArgs, config.username, config.orgname)
	.then(function(message) {
		res.json({
			success: true
		});
	});
});

// 发送请求，功能，1秒内执行num次transaction
//  127.0.0.1:8080/api/invokeCC?num=1
// app.get('/api/invokeCC', function(req, res) {
// 	let num = req.query.num;
// 	let a = (index,num)=>{
// 		invoke.invokeChaincode(config.peers, config.channelName, config.chaincodeName, config.invokeFunctionName, config.invokeArgs, config.username, config.orgname).then(function(message) {
// 			if(index < num){
// 				a(index+1,num);
// 			}else{
// 				res.json({
// 					success: true
// 				});
// 			}
// 		});
// 	}
// 	a(1,num);
// });
app.get('/api/invokeCC', function(req, res) {
	let num = req.query.num;
	var timeout = 1000/num;
	for( var i = 0;i<num;i++){
		setTimeout(function(){
			invoke.invokeChaincode(config.peers, config.channelName, config.chaincodeName, config.invokeFunctionName, config.invokeArgs, config.username, config.orgname)
			.then(function(message) {
			});
		},timeout*i);
	}
	res.json({
		success: true
	});
});
//  获得当前区块高度
//  127.0.0.1:8080/api/getAll
app.get('/api/getAll', function(req, res) {
	query.getInfo(config.peer, config.username, config.orgname)
	.then(function(response_payloads) {
		res.send({
			'success': true,
			'height':response_payloads.height.toString(),
		});
	});
});

//  查询本节点指定id的block详细信息
//  127.0.0.1:8080/api/getInfo?blockId=1
app.get('/api/getInfo', function(req, res) {
	query.getBlockByNumber(config.peer, req.query.blockId, config.username, config.orgname)
		.then(function(block) {
			res.json(block);
		});
});

//查询通道信息
app.get('/api/getChannels', function(req, res) {
	query.getChannels(config.peer, config.username, config.orgname)
		.then(function(message) {
			res.send(message);
		});
});