(function() {
	function formaterShareData(data){
		var ret = {
			'appid' : data.appId ? data.appId : '',
			'img_url' : data.imgUrl,
			'link' : data.link,
			'desc' : data.desc,
			'title' : data.title,
			'img_width':'640',
			'img_height':'640'
		};
		return ret;
	}
	//隐藏右上角菜单入口
	weAPI.addPlugin({
		key: 'hideOptionMenu'
	});
	//显示右上角菜单入口
	weAPI.addPlugin({
		key: 'showOptionMenu'
	});
	//隐藏底部工具条
	weAPI.addPlugin({
		key: 'hideToolbar'
	});
	//显示底部工具条
	weAPI.addPlugin({
		key: 'showToolbar'
	});
	//打开二维码扫描
	weAPI.addPlugin({
		key: 'scanQRCode'
	});
	//关闭公众平台Web页面
	weAPI.addPlugin({
		key: 'closeWindow'
	});
	//获得网络状态
	weAPI.addPlugin({
		key: 'getNetworkType',
		resFormater : function(res){
			return res.err_msg;
		}
	});
	//调用weixin客户端的图片预览
	weAPI.addPlugin({
		key: 'imagePreview',
		dataFormater : function(data){
			return data;
		}
	});
	//分享至朋友圈
	weAPI.addPlugin({
		key:'shareTimeline',
		shareAction : true,
		dataFormater : formaterShareData
	});
	//发送给微信上的好友
	weAPI.addPlugin({
		key: 'shareToFriend',
		cmd: 'sendAppMessage',
		shareAction : true,
		event: "menu:share:appmessage",
		errMsg: "send_app_msg",
		dataFormater: formaterShareData
	});
	//分享腾讯微博
	weAPI.addPlugin({
		key: 'shareWeibo',
		shareAction : true,
		dataFormater : function(data){
			var ret = {
				'content':data.content,
				'url':data.link
			};
			return ret;
		}
	});
})()