(function() {
	'use strict';
	//if exist return, else construct
	if(!window.comcgm) {
		window.comcgm = {};
	}
	if(!window.comcgm.extension) {
		window.comcgm.extension = {};
	}
	if ('undefined' !== typeof window.comcgm.extension.ad) {
		return ;
	}
	/*
	function addEvent(element, type, handler) {
		// 为每一个事件处理函数分派一个唯一的ID
		if (!handler.$$guid)
			handler.$$guid = addEvent.guid++;
		// 为元素的事件类型创建一个哈希表
		if (!element.events)
			element.events = {};
		// 为每一个'元素/事件'对创建一个事件处理程序的哈希表
		var handlers = element.events[type];
		if (!handlers) {
			handlers = element.events[type] = {};
			// 存储存在的事件处理函数(如果有)
			if (element['on' + type]) {
				handlers[0] = element['on' + type];
			}
		}
		// 将事件处理函数存入哈希表
		handlers[handler.$$guid] = handler;
		// 指派一个全局的事件处理函数来做所有的工作
		element['on' + type] = handleEvent;
	}
	;
	// 用来创建唯一的ID的计数器
	addEvent.guid = 1;
	function removeEvent(element, type, handler) {
		// 从哈希表中删除事件处理函数
		if (element.events && element.events[type]) {
			delete element.events[type][handler.$$guid];
		}
	}
	;
	function handleEvent(event) {
		var returnValue = true;
		// 抓获事件对象(IE使用全局事件对象)
		event = event || fixEvent(window.event);
		// 取得事件处理函数的哈希表的引用
		var handlers = this.events[event.type];
		// 执行每一个处理函数
		for ( var i in handlers) {
			this.$$handleEvent = handlers[i];
			if (this.$$handleEvent(event) === false) {
				returnValue = false;
			}
		}
		return returnValue;
	}
	;
	// 为IE的事件对象添加一些“缺失的”函数
	function fixEvent(event) {
		// 添加标准的W3C方法
		event.preventDefault = fixEvent.preventDefault;
		event.stopPropagation = fixEvent.stopPropagation;
		return event;
	}
	;
	fixEvent.preventDefault = function() {
		this.returnValue = false;
	};
	fixEvent.stopPropagation = function() {
		this.cancelBubble = true;
	};
	*/
	var $,doc,that = {
		params: {
			statics: {
				root: 'caigoumiLayer',
				server: 'http://static.caigoumi.com',
				jquery: '/js/jquery-1.8.3.min.js',
				ads: {
					10000: {
						url: 'http://t.cn/z8Ygqmm',
						pic: 'http://t.cn/z8YkvQc',
						width: '350px',
						height: '250px'
					},
					10001: {
						url: 'http://t.cn/z8YDD6f',
						pic: 'http://t.cn/z8YDFIH',
						width: '350px',
						height: '250px'
					}
				}
			},
			cookie: {
				limit: 5,
				expires: {
					day: 3600 * 24 * 1,
					click: 3600 * 24 * 7,
					close: 3600 * 24 * 1
				}
			},
			isAdClicked: {}
		},
		keys: {
			cookie: {
				topBar: 'topBar',
				slideBar: 'slideBar',
				bottomBar: 'bottomBar'
			},
			isAdClicked: 'isAdClicked'
		},
		utils: {
			A: function(a, b){
				if (typeof b == 'string') {
					a.innerHTML = b;
				} else {
					a.appendChild(b);
				}
			},
			C: function(name){
				return document.createElement(name);
			},
			T: function(name, no){
				return document.getElementsByTagName(name)[no];
			},
			getSuffix: function() {
				var d = new Date();
				var suffix = '?t=' + d.getFullYear() + (d.getMonth() + 1) + d.getDate();
				return suffix;
			},
			getRealPath: function(path) {
				var url = that.params.statics.server + path + that.utils.getSuffix();
				return url;
			},
			addScript: function(content, inline, callback) {
				var head = that.utils.T('head', 0);
				var script = that.utils.C('script');
				script.type = 'text/javascript';
				script.charset = 'utf-8';
				if (inline) {
					script.text = content;
				} else {
					script.src = content;
					script.onload = script.onreadystatechange = function(){
						if (script.readyState && script.readyState != 'loaded' && script.readyState != 'complete') {
							return;
						} else {
							if (callback) {
								callback();
							}
							script.onload = script.onreadystatechange = null;
						}
					}
				}
				that.utils.A(head, script);
				if (inline && callback) {
					callback();
				}
			},
			loadJQuery: function(callback) {
				if (typeof(window.jQuery) == 'undefined' || parseFloat(window.jQuery.fn.jquery) < 1.8) {
					that.utils.addScript(that.utils.getRealPath(that.params.statics.jquery), false, function() {
						that.$ = $ = jQuery.noConflict(true);
						callback();
					});
				} else {
					that.$ = $ = window.jQuery;
					callback();
				}
			}
		},
		api: {
			_init: function(url, data, callback) {
				$.ajax({
					'url': that.params.statics.server + url,
					'data': data,
					'dataType': 'jsonp',
					'jsonp': 'callback',
					'async': false,
					'success': function(json){
						if('undefined' !== typeof callback) {
						   callback(json);
						}
					}
				});
			},
			setCookie: function(key, val, expire, callback){
				var url = '/api/cookie/';
				var data = {'key': key, 'val': val, 'expire': expire};
				this._init(url, data, callback);
			},
			getCookie: function(key, callback){
				var url = '/api/cookie/';
				var data = {'key': key, 'op': 'get'};
				this._init(url, data, callback);
			},
			removeCookie: function(key, callback){
				expire = -1;
				this.set(key, null, expire, callback);
			}
		},
		createWrapLayer: function(callback) {
			var elem = that.utils.C('div'),
				body = that.utils.T('body', 0);

			elem.id = that.params.statics.root;
			body.insertBefore(elem, body.firstChild);

			doc = document.getElementById(that.params.statics.root);
			callback();
		},
		loadAd: function(position, data, option) {

			var ww = document.body.clientWidth,
				goldWidth = 1000,
				rt = [];

			switch(position) {
				case that.keys.cookie.slideBar:
					//check left,right
					if(!data.left || !data.right) {
						return [];
					}
					var width = option && option.width ? option.width : 126,
						height = option && option.height ? option.height : 360,
						tw = ww - goldWidth - 2 * width,
						top = 150,
						offset = 0,
						eleLeft= that.utils.C('div'),
						eleRight = that.utils.C('div'),
						css = 'width: ' + width + 'px; height:' + height + 'px; line-height: ' + height + 'px; padding: 0px; display: block; visibility: visible; border: none; background-image: none; float: none; overflow: hidden; position: fixed; _position: absolute; z-index: 2147483647; background-position: initial initial; background-repeat: initial initial;';

					if(tw >= 0) {
						offset = Math.floor(tw / 2);
					}


					eleLeft.className = 'ad';
					eleRight.className = 'ad';
					eleLeft.style.cssText = css + 'top: ' + top + 'px;left: ' + offset + 'px;';
					eleRight.style.cssText = css + 'top: ' + top + 'px;right: ' + offset + 'px;';
					//fix ad position on resize window
					window.onresize = function() {
						ww = document.body.clientWidth;
						tw = ww - goldWidth - 2 * width;

						if(tw >= 0) {
							offset = Math.floor(tw / 2);
						} else {
							offset = 0;
						}
						//console.log(ww,tw,offset);
						eleLeft.style.left = offset + 'px';
						eleRight.style.right = offset + 'px';
					}

					that.utils.A(eleLeft, that.loadAdData(data.left));
					that.utils.A(eleRight, that.loadAdData(data.right));

					rt = [eleLeft, eleRight];
					break;
				case that.keys.cookie.topBar:
					var width = option && option.width ? option.width : goldWidth,
						height = option && option.height ? option.height : 50,
						ele = that.utils.C('div'),
						css = 'width: ' + goldWidth + 'px; height: ' + height + 'px; position: relative; margin: 0 auto; display: block; visibility: visible; border: none; background-image: none; float: none; overflow: hidden; ';

					ele.className = 'ad';
					ele.style.cssText = css;

					that.utils.A(ele, that.loadAdData(data));

					rt = [ele];
					break;
				case that.keys.cookie.bottomBar:
					var width = option && option.width ? option.width : 350,
						height = option && option.height ? option.height : 250,
						ele = that.utils.C('div'),
						eleClose = that.utils.C('button'),
						css = 'width: ' + width + 'px; height: ' + height + 'px; right: 0px; bottom: 0px; background-color: transparent; position: fixed;  _position: absolute; z-index: 2147483647; background-position: initial initial; background-repeat: initial initial;';

					ele.className = 'ad';
					ele.style.cssText = css;

					eleClose.className = 'close';
					eleClose.href = 'javascript:void(0);';
					eleClose.innerHTML = '&times;';
					eleClose.style.cssText = 'position: absolute;top: 5px;right: 5px;text-decoration: none;padding: 0;margin: 0;text-align: center;letter-spacing: normal;word-spacing: normal;text-shadow: none;display: inline-block;vertical-align: middle;cursor: pointer;background: transparent;border: 0;float: right;font-size: 20px;font-weight: bold;line-height: 20px;color: #000000;text-shadow: 0 1px 0 #ffffff;opacity: 0.2;filter: alpha(opacity=20);font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;';

					eleClose.onmouseover = (function() {
						eleClose.style.opacity = '0.4';
						eleClose.style.filter = 'alpha(opacity=40)';
					});

					eleClose.onmouseout = (function() {
						eleClose.style.opacity = '0.2';
						eleClose.style.filter = 'alpha(opacity=20)';
					});

					that.utils.A(ele, eleClose);
					that.utils.A(ele, that.loadAdData(data));

					rt = [ele];
				default:
					break;
			};
			return rt;
		},
		loadAdData: function(id) {
			var ad = that.params.statics.ads[id],
				wrapper = that.utils.C('div'),
				content = '<a href="' + ad.url + '" target="_blank">' +
						'<img src="' + ad.pic + '" width="' + ad.width + '" height="' + ad.height + '" border="0" />' +
					'</a>';

			wrapper.className = 'content';
			wrapper.setAttribute('data-id', id);
			that.utils.A(wrapper, content);

			return wrapper;
		},
		getAdCookieKey: function (id) {
			return that.keys.isAdClicked + '_' + id;
		},
		getAdIdFromCookieKey: function (key) {
			var temp = key.split('_');
			if(temp && temp.length) {
				return key.split('_')[1];
			} else {
				return false;
			}
		},
		inject: function(ads) {
			for(var i in ads) {
				var rt = that.loadAd(i, ads[i]);
				for(var j=0,length=rt.length;j<length;j++) {
					that.utils.A(doc, rt[j]);
				}
			}
		},
		delegateEvent: function() {
			$(doc).delegate('.ad > .content', 'click', function() {
				var e = $(this),
					id = e.attr('data-id');
				if(!that.params.isAdClicked[id]) {
					var key = that.getAdCookieKey(id),
						val = 0,
						expire = that.params.cookie.expires.click;

					that.api.setCookie(key, val, expire, function(json) {
						that.params.isAdClicked[id] = true;
					});
				}
			});
			$(doc).delegate('.ad > .close', 'click', function() {
				var e = $(this),
					id = e.parent().find('.content').attr('data-id');
				if(!that.params.isAdClicked[id]) {
					var key = that.getAdCookieKey(id),
						val = 0,
						expire = that.params.cookie.expires.close;

					that.api.setCookie(key, val, expire, function(json) {
						e.parent().hide();
						that.params.isAdClicked[id] = true;
					});
				} else {
					e.parent().hide();
				}
			});
		},
		runAd: function(ads) {
			var keys = [],params = {};
			for(var id in ads) {
					keys.push(that.getAdCookieKey(id));
					that.params.isAdClicked[id] = false;
			}
			that.api.getCookie(keys.join(','), function(json) {
				var keys = [],params = {},showAds = [];
				for(var id in ads) {
					keys.push(that.getAdCookieKey(id));
					that.params.isAdClicked[id] = false;
				}
				if(json.result) {
					for(var i=0,length=keys.length;i<length;i++) {
						var key = keys[i],
							times = json[key];

						times = times ? times : that.params.cookie.limit;
						if(times > 0) {
							showAds.push(that.getAdIdFromCookieKey(key));
							//decrease show times
							times--;
							var val = times,
								expire = that.params.cookie.expires.day;
							that.api.setCookie(key, val, expire);
						}
					}
				}
				if(showAds.length) {
					var temp = {};
					for(var j=0,length=showAds.length;j<length;j++) {
						var id = showAds[j],
							ad = ads[id];

						if(ad.position) {
							if(typeof temp[ad.type] == 'undefined') {
								temp[ad.type] = {};
							}
							temp[ad.type][ad.position] = id;
						} else {
							temp[ad.type] = id
						}
					}
					that.inject(temp);
					that.delegateEvent();
				}
			});
		},
		init: function() {
			//slide bar must have a pair of values
			//@param position: false, 'left', 'right'
			var	ads = {
				// 10000: {
				// 	type: that.keys.cookie.bottomBar,
				// 	position: false
				// },
				10001: {
					type: that.keys.cookie.bottomBar,
					position: false
				}
			};
			//is ad cookie effective
			that.createWrapLayer(function(){
				that.utils.loadJQuery(function(){
					that.runAd(ads);
				});
			});
		}
	};
	//that.init();

	window.comcgm.extension.ad = that;
})();