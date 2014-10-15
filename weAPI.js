/**
 * 	链式，weAPI是一个命名空间，weAPI.pluginName会创建一个plugin的实例，回调内的this都是这个plugin实例
 * 	
 */
(function() {
	"use strict"

	function each(tar, func) {
		for (var i in tar) {
			func(i, tar[i])
		}
	}

	function doNothing(d) {
		return d
	}

	function isFunction(func) {
		return typeof func === "function"
	}

	function excuteCBS(obj, arr, res) {
		if(obj) {
			each(arr, function(k, v) {
				if(obj[v]) each(obj[v], function(i, func) {
					func.call(obj, res)
				})
			})
		} 
	}

	var methods = ["ready", "cancel", "done", "success", "fail"]

	
	window.weAPI = {
		/**
		  *  @method addPlugin 用以添加新的插件
		  *  @param {OBJECT} options 配置
		  *  @p-options {string} key 插件名字
		  *  @p-options {string} cmd 调用的微信接口名
		  *  @p-options {function} resFormater 微信接口调用结束后，对响应数据的格式化函数，默认不做任何处理
		  *  @p-options {function} dataFormater 传递给微信接口数据的格式化函数，默认不做任何处理
		  *  @p-options {string} event 微信接口回调事件名，默认由cmd的驼峰形式转成:分隔
		  *  @p-options {string} errMsg 微信err_msg的:前半部分，默认是cmd由驼峰模式转为下划线分隔
		  */
		addPlugin: function(options) {
			var key = options.key,
				resFormater = options.resFormater || doNothing,
				dataFormater = options.dataFormater || doNothing,
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
					if(typeof WeixinJSBridge === "undefined") return
					var me = this
					me[key] = me.action
					me.cmd = cmd
					me.errMsg = errMsg
					me.dataFormater = dataFormater
					me.resFormater = resFormater
					// 关闭、隐藏之类的按钮
					if(notShareAction) {
						excuteCBS(me, ["_ready"])
						me.action(data)
						excuteCBS(me, ["_success", "_done"])
					} else {
						WeixinJSBridge.on(event, function(argv) {
			                // 就绪
			                if(me._ready.length) each(me._ready, function(index, readyFunc) {
			                	// 将data传递过去，方便在ready回调里面对data进行进一步处理
			                	readyFunc.call(me, data, argv)
			                })
			                // 非异步情况
			                // 异步数据通过回调内 this.action(newData)来调用微信接口
			                // 异步数据不会进入到ready回调内
			                if(!options || !options.async) me[key](data, argv);
						})
					}
				})
				return me
			}
		}
	}
	/**
	 *  @param {OBJECT} options 配置
	 *  @param {FUNCTION} action 操作主函数
	 */
	function classObject(options, action) {
		var me = this
		me._data = {}
		each(methods, function(index, value) {
			var cb = options && options[value]
			me["_" + value] = cb && isFunction(cb) ? [cb] : []
		})
		if (isFunction(action)) action.call(me) 
	}

	each(methods, function(index, value) {
		classObject.prototype[value] = function(callback) {
			this["_" + value].push(callback)
			return this
		}
	})

	classObject.prototype.action = function(defineData, general) {
		// 支出新的接口
		var me = this,
			general = general || me._general,
			exec = general && isFunction(general.generalShare) && general.generalShare,
			args = exec ? [] : [me.cmd],
			errMsg = me.errMsg
		exec = exec ||  WeixinJSBridge.invoke
		if(defineData) {
			// 格式化数据
			var newData = me.dataFormater(defineData, general && general.shareTo)
			if(newData) me._data = newData
		}
		// 修复iso下 link === location.href时候实际分享出去的url不对的bug
		if(me._data && me._data.link && location.href === me._data.link) {
			var s = location.search,
			xs = "?___=",
			ns = s.replace(/___=[^&#]/g, function(r) {
				var i = 0
				while(xs + i != r) {
					i++
				}
				return xs + i
			})
			if(ns && ns === s) ns += "&" + xs + "0"
			if(ns) {
				me._data.link = me._data.link.replace(s, ns)	
			} else {
				x
				var p = me._data.link.split("#")
				me._data.link = p[0] + ns + (p[1] || "")
			}
		}
		exec.apply(WeixinJSBridge, args.concat([me._data, function (resp) {
			var callbackArr = "success"
			if(resp.err_msg && resp.err_msg.indexOf(errMsg) === 0) {
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
			}
			// 格式化最终输出
			var res = me.resFormater(resp)
			excuteCBS(me, ["_" + callbackArr, "_done"], res)
		}]))
	}

	/**
	 *  @method ready
	 *  @param {FUNCTION} callback 微信js API ready后回调
	 *  @p-options {OBJECT} weAPI 传递给回调函数的weAPI对象
	 */
	weAPI.ready = function(callback) {
		if (isFunction(callback) && /MicroMessenger/i.test(navigator.userAgent)) {
			if (typeof window.WeixinJSBridge == "undefined") {
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
