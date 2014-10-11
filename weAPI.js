<html>
	<head>
		<meta charset="UTF-8">
		<title>wechat js api test - weAPI</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no,minimal-ui" name="viewport" />
		<script src="weAPI.js"></script>
		<style type="text/css">
			body{
				font-size: 20px;
			}
		</style>
	</head>
	<body>
		<a href="#" onclick="weAPI.hideOptionMenu({},{done:function(){alert(3)}})">隐藏hideOptionMenu</a>
		<a href="#" onclick="weAPI.hideToolbar({},{done:function(){alert(3)}})">隐藏toolbar</a>
		<a href="#" onclick="weAPI.scanQRCode({},{done:function(){alert(3)}})">scan</a>
		<a href="#" onclick="weAPI.closeWindow({},{done:function(){alert(3)}})">关闭</a>
	</body>
	<script>
	 	function _log(msg) {
	 		alert(msg)
	 	}
		weAPI.ready(function() {
			weAPI.addPlugin({
				key: "hideOptionMenu"
			})
			weAPI.addPlugin({
				key: "hideToolbar"
			})
			// 这玩意也是有回调的
			weAPI.addPlugin({
				key: "closeWindow",
				shareAction: true
			})
			weAPI.addPlugin({
				key: "scanQRCode"
			})
			weAPI.addPlugin({
				key: "shareWeibo",
				shareAction: true,
				dataList: {
					content: "你好",
					url: "http://qunar.com/"
				}
			})
			weAPI.addPlugin({
				key: "getNetworkType"
			})
			weAPI.addPlugin({
				key: "shareTimeline",
				shareAction: true,
				dataList: {
					"appid":"",
		            "img_url":"",
		            "link":"",
		            "desc":"",
		            "title":"",
		            "img_width":"640",
		            "img_height":"640"
				}

			})
			weAPI.shareTimeline({
				title:"yiwanpicaonima",
				img_url: "http://file5.u148.net/2014/10/images/1412934017UEH.jpg",
				link: "http://file5.u148.net/2014/10/images/1412934017UEH.jpg"
			}).ready(function(){
				_log("朋友圈ready")
			}).done(function() {
				_log("朋友圈done")
			})
			weAPI.shareWeibo({}).ready(function(){
				_log("weibo ready")
			}).done(function() {
				_log("weibo done")
			})
			weAPI.getNetworkType({}).done(function(arg) {
				alert(arg)
			})
 		})
	</script>
</html>
