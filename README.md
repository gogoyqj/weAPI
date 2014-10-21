# 微信公众平台Js API(weAPI)
-------------------------


----------

demo

###静态啊数据
[![image](demo.png)](http://gogoyqj.github.io/weAPI/)

###异步数据

[![image](async.png)](http://gogoyqj.github.io/weAPI/async.html)


## 1. 包含哪些功能？
-----------------

1. 隐藏右上角菜单入口
2. 显示右上角菜单入口
3. 隐藏底部工具条
4. 显示底部工具条
5. 打开二维码扫描
6. 关闭公众平台Web页面
7. 获得网络状态
8. 调用微信客户端的图片预览
9. 分享至朋友圈
10. 发送给微信上的好友
	
## 2. 如何使用？
--------------

*	**隐藏/显示右上角菜单入口**
``` javascript
weAPI.ready(function(){
    
        //无回调
        //隐藏右上角菜单入口
	    weAPI.hideOptionMenu();
	
    	//显示右上角菜单入口
    	//weAPI.showOptionMenu();
});
```

*	**隐藏/显示底部工具条**
``` javascript
weAPI.ready(function(){

        //无回调
    	//隐藏底部工具条
    	weAPI.hideToolbar();
    	
    	//显示底部工具条
    	//weAPI.showToolbar();
});
```

*	**打开二维码扫描**
``` javascript
weAPI.ready(function(){

    	//打开二维码扫描
    	//支持回调
    	weAPI.scanQRCode()
    		.success(function(){
    			alert('打开二维码扫描成功');
    		})
    		.done(function(){
    			alert('打开二维码扫描完成');
    		})
    		.fail(function(){
    			alert('打开二维码扫描失败');
    		});
});
```

*	**关闭公众平台Web页面**
``` 
weAPI.ready(function(){

    	//关闭公众平台Web页面
    	//支持回调
    	weAPI.closeWindow()
    		.success(function(){
    			alert('关闭公众平台Web页面成功');
    		})
    		.done(function(){
    			alert('关闭公众平台Web页面完成');
    		})
    		.fail(function(){
    			alert('关闭公众平台Web页面失败');
    		});
});
```

*	**获得网络状态**
``` javascript
weAPI.ready(function(){

    	//获得网络状态
    	//支持回调
    	//返回msg是个枚举类型
    	//	network_type:wifi   wifi
    	//	network_type:wwan	2G/3G
    	//	network_type:fail	失败
    	//	network_type:edge	2G/3G
    	weAPI.getNetworkType()
    		.success(function(msg){
    			alert('获取网络状态成功:'+msg);						
    		})
    		.done(function(msg){
    			alert('获取网络状态完成：'+msg);
    		})
    		.fail(function(msg){
    			alert('获取网络状态失败：'+msg);
    		});
});
```

*	**调用微信客户端的图片预览**
``` javascript
weAPI.ready(function(){

        //无回调
    	//调用微信图片预览
    	var imgData = {
    		//当前图片
    		current:'http://placehold.it/300x200&text=Image3',
    		//图片列表
    		urls : ['http://placehold.it/300x200&text=Image1',
    		    'http://placehold.it/300x200&text=Image2',
    		    'http://placehold.it/300x200&text=Image3',
    		    'http://placehold.it/300x200&text=Image4']
    	};
    	weAPI.imagePreview(imgData);
});
```

*	**分享相关操作**
``` javascript
weAPI.ready(function(){
 
        //分享数据
    	var shareData = {
    		appId : '', //服务号可以填写appId
    		imgUrl : 'http://placehold.it/300x200&text=shareData',
    		link : 'http://g.cn',
    		title : '分享数据',
    		desc : '分享数据描述'
    	};
    
    	//用户点开右上角popup菜单后，会执行下面这个代码
    	//点击：分享给朋友圈
    	//支持回调
    	weAPI.shareTimeline(shareData)
    		.success(function(rsp){
    			alert('shareTimeline成功：'+rsp.err_msg);
    		})
    		.done(function(rsp){
    			alert('shareTimeline完成：'+rsp.err_msg);
    		})
    		.cancel(function(rsp){
    			alert('shareTimeline取消：'+rsp.err_msg);
    		})
    		.fail(function(rsp){
    			alert('shareTimeline失败：'+rsp.err_msg);
    		});
    
    	//点击：发送给朋友
    	weAPI.shareToFriend(shareData)
    		.success(function(rsp){
    			alert('shareToFriend成功：'+rsp.err_msg);
    		})
    		.done(function(rsp){
    			alert('shareToFriend完成：'+rsp.err_msg);
    		})
    		.cancel(function(rsp){
    			alert('shareToFriend取消：'+rsp.err_msg);
    		})
    		.fail(function(rsp){
    			alert('shareToFriend失败：'+rsp.err_msg);
    		});
});
```

## 3. 备注
----------

除了隐藏/显示右上角菜单入口，隐藏/显示底部工具条和调用微信客户端的图片预览接口外，其余接口均有回调函数（done,success,fail,cancel）。
	
分享接口不能在页面中直接调用，需使用微信菜单调用(右上角popup菜单)。
