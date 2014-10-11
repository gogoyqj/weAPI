/**
 *
 *
 */
(function() {
	"use strict"

	function each(tar, func) {
		for (var i in tar) {
			func(i, tar[i])
		}
	}

	function isFunction(func) {
		return typeof func === "function"
	}

	var methods = ["ready", "cancel", "done", "success", "fail", "dataLoaded"]

	
	window.weAPI = {
		/**
		  * @method addPlugin 用以添加新的插件
		  * @param {OBJECT} options 配置
		  * @p-options {string} key 插件名字
		  * @p-options {string} cmd 调用的微信接口名
		  * @p-options {string} event 微信接口回调事件名，默认由cmd的驼峰形式转成:分隔
		  * @p-options {object} dataList 传递给接口的数据格式字段默认值
		  * @p-options {string} errMsg 微信err_msg的:前半部分，默认是cmd由驼峰模式转为下划线分隔
		  */
		addPlugin: function(options) {
			var key = options.key,
				func = options.func || function() {},
				dataList = options.dataList || {},
				cmd = options.cmd || key,
				notShareAction = !options.shareAction,
				event = options.event || "menu:" + cmd.replace(/[A-Z]/g, function(mat) {
					return ":" + mat.toLowerCase()
				}),
				errMsg = options.errMsg || cmd.replace(/[A-Z]/g, function(mat) {
					return "_" + mat.toLowerCase()
				})
			if(!key) throw new Error("插件名字不能为空")
			weAPI[key] = function(data, options) {
				var me = new classObject(options, function() {
					var me = this
					me[key] = function(defineData) {
						var newData = {}
						defineData && each(dataList, function(key, value) {
							newData[key] = defineData[key] === void 0 ? value : defineData[key]
						})
						weAPI.exec(cmd, newData, function (resp) {
							var callbackArr
                			switch (resp.err_msg) {
                				// 用户取消
                				case errMsg + ':cancel':
			                        callbackArr = "cancel"
			                        break;
			                    // 发送成功
			                    case errMsg + ":confirm":
			                    case errMsg + ":ok":
			                        callbackArr = "success"
			                        break;
			                    // 发送失败
			                    case errMsg + ":fail":
			                    default:
			                        callbackArr = "fail"
			                        break;
                			}
                			callbackArr = me["_" + callbackArr]
                			each(callbackArr, function(index, cb) {
                				cb(resp)
                			})
						})
					}
					weAPI.on(event, function(argv) {
		                // 就绪
		                if(me._ready.length) each(me._ready, function(index, func) {
		                	func(argv)
		                })
		                me[key](data);
					})
				}, notShareAction && key)
				return me
			}
		},
		on: function(event, callback) {
			var api
			if (!isFunction(callback)) callback = function() {}
			return (api = window.WeixinJSBridge) != null ? api.on(event, callback) : void 0;
		},
		exec: function(cmd, data, callback) {
			var api
			if (data == null) data = {}
			if (!isFunction(callback)) callback = function() {}
			return (api = window.WeixinJSBridge) != null ? api.invoke(cmd, data, callback) : void 0;
		}
	}
	weAPI.addPlugin({
		key: "shareTimeline",
		shareAction: true,
		//cmd: "hareTimeline", // 默认取同key
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
	/**
	 * @param {OBJECT} options 配置
	 * @param {FUNCTION} action 操作主函数
	 */
	function classObject(options, action, notShareAction) {
		var me = this
		each(methods, function(index, value) {
			var cb = options && options[value]
			me["_" + value] = cb && isFunction(cb) ? [cb] : []
		})
		if (isFunction(action)) action.call(me) 
		if(notShareAction) me[notShareAction]()
	}

	each(methods, function(index, value) {
		classObject.prototype[value] = function(callback) {
			this["_" + value].push(callback)
			return this
		}
	})

	/**
	 * @method ready
	 * @param {FUNCTION} callback 微信js API ready后回调
	 * @p-options {OBJECT} weAPI 传递给回调函数的weAPI对象
	 */
	weAPI.ready = function(callback) {
		if (isFunction(callback)) {
			if (typeof window.WeixinJSBridge == "undefined" && /MicroMessenger/i.test(navigator.userAgent)) {
				var newCallback = function() {
					callback(weAPI)
				}
				if (document.addEventListener) {
					document.addEventListener('WeixinJSBridgeReady', newCallback, false);
				} else if (document.attachEvent) {
					document.attachEvent('WeixinJSBridgeReady', newCallback);
					document.attachEvent('onWeixinJSBridgeReady', newCallback);
				}
			} else {
				callback(weAPI)
			}
		}
	}
})()
