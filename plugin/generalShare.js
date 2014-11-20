/** 
  *	@description weAPI.generalShare 新的分享接口 for ios wechat v>=6.0，可以weAPI.generalShare(data, {ready: xxx,done:xxx}) 或者 weAPI.generalShare(data).ready(func).done(func)进行调用
  * @author skipper 2014.10.15
  * @method generalShare
  * @param {object} data 分享出去的数据，支持img_url,link,title,desc等参数
  * @param {object} options 配置，可以用来挂架ready,cancel,fail,success,done
  */
weAPI.addPlugin({
	key: "generalShare",
	shareAction: true,
	dataFormater: function(data, shareTo) {
		// 由于是引用，因此避免直接写原对象
		var newData = {
			"appid":"",
            "img_url":"",
            "link":"",
            "desc":"",
            "title":"",
            "img_width":"640",
            "img_height":"640"
		}
		for(var i in data) {
			newData[i] = data[i]
		}
		// 分享到朋友圈，对字段进行一个交换
		if(shareTo == 'timeline') {
            var title = newData.title;
            newData.title = newData.desc || title;
            newData.desc = title;
        }
        return newData
	}

})