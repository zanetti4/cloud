// JavaScript Document
var mainCon = $('.main-con');
var divPath = $('.main-right-top');
var content = $('.main-right-content');
var all = $('span', divPath);
var bar = $('.main-right-content-bar');
var del = $('.main-deal-delete');
var tipsLayer = $('.main-top-time');
var tipsDel = $('.delete');
var deleting = $('.deleting');
var sonDel = deleting.find('span:first');
var successDel = $('.main-top-success');
var isNaming = false;
var isNewing = false;
var timerTips = null;
//提示的类名常量
var SUCCESS = 'main-top-success';
var WARN = 'main-top-choose';
//初始化
mainCon.prepend(cloudTool.createTreeHtml(-1));
divPath.append(cloudTool.createPathHtml(1));
content.append(cloudTool.createFileHtml(1));
mainCon.children('ul').addClass('main-tree');
$('.main-tree li[custom-id="1"] > span').addClass('main-tree-cur');

//无内容
function empty(){
	if(content.children().last().is('div.main-right-content-bar')){
		content.addClass('main-right-content-empty');
		$('.main-right-content-empty-con').show();
		//取消全选
		all.removeClass('main-right-top-all');
	}
};

empty();

//生成路径导航和文件夹
function pathFile(id){
	$('.main-right-top span').nextAll().remove();
	divPath.append(cloudTool.createPathHtml(id));
	bar.nextAll().remove();
	content.append(cloudTool.createFileHtml(id));
	all.removeClass('main-right-top-all');

	if(content.children().last().is('div.main-right-content-bar')){
		//无内容
		content.addClass('main-right-content-empty');
		$('.main-right-content-empty-con').show();
	}else{
		content.removeClass('main-right-content-empty');
		$('.main-right-content-empty-con').hide();
	}

	//重新渲染后取消数据的选中状态
	data.forEach(function(item){
		if(item.checked === true){
			item.checked = false;
		}
	});
};

//点击文档树
mainCon.on('click', 'span.main-tree-title', function(){
	var that = $(this);
	var id = Number(that.parent().attr('custom-id'));

	$('.main-tree span.main-tree-cur').removeClass('main-tree-cur');
	that.addClass('main-tree-cur');
	pathFile(id);
});

//点击路径导航
divPath.on('click', 'a', function(){
	var that = $(this);
	var id = Number(that.attr('custom-id'));

	$('.main-tree span.main-tree-cur').removeClass('main-tree-cur');
	$('.main-tree li[custom-id="'+ id +'"] > span').addClass('main-tree-cur');
	pathFile(id);
});

//点击文件夹
content.on('click', 'div.main-right-content-file', function(event){
	var tar = $(event.target);
	
	if(tar.is('div.main-right-content-file-checkde') || tar.is('span') || tar.is('input')){
		return;
	}

	var that = $(this);
	var id = Number(that.attr('custom-id'));

	$('.main-tree span.main-tree-cur').removeClass('main-tree-cur');
	$('.main-tree li[custom-id="'+ id +'"] > span').addClass('main-tree-cur');
	pathFile(id);
});

//单选
content.on('click', 'div.main-right-content-file-checkde', function(){
	var that = $(this);
	var file = that.parent();
	var id = Number(file.attr('custom-id'));
	var lenSameLevel = cloudTool.getSameLevelById(id).length;

	that.toggleClass('main-right-content-file-checked');
	file.toggleClass('main-right-content-filecheck');

	data.forEach(function(item){
		if(item.id === id && that.hasClass('main-right-content-file-checked')){
			//选中数据
			item.checked = true;
		}else if(item.id === id){
			//取消选中
			item.checked = false;
		}
	});

	var lenChoose = content.find('div.main-right-content-file-checked').length;

	if(lenChoose === lenSameLevel){
		//全部选中了
		all.addClass('main-right-top-all');
	}else{
		//取消全选
		all.removeClass('main-right-top-all');
	}
});

//全选
all.on('click', function(){
	var that = $(this);
	var id = Number(that.nextAll('a:last').attr('custom-id'));
	var children = cloudTool.getChildrenById(id);

	if(children.length && that.hasClass('main-right-top-all')){
		//取消全选
		children.forEach(function(item){
			item.checked = false;
		});

		bar.nextAll().remove();
		content.append(cloudTool.createFileHtml(id));
		content.find('div.main-right-content-file-checkde').removeClass('main-right-content-file-checked');
		$('.main-right-content-file').removeClass('main-right-content-filecheck');
		that.removeClass('main-right-top-all');
	}else if(children.length){
		//全部选中
		children.forEach(function(item){
			item.checked = true;
		});

		bar.nextAll().remove();
		content.append(cloudTool.createFileHtml(id));
		content.find('div.main-right-content-file-checkde').addClass('main-right-content-file-checked');
		$('.main-right-content-file').addClass('main-right-content-filecheck');
		that.addClass('main-right-top-all');
	}
});

//框选
content.on('mousedown', function(event){
	var tar = $(event.target);

	$('<div class="main-right-content-rect"></div>').prependTo(content).hide();

	var rectJq = $('.main-right-content-rect');

	if(!tar.is('div.main-right-content-empty-con') && !tar.is('div.main-right-content-bar') && !tar.is('div.main-right-content-file') && !tar.is('span') && !tar.is('div.main-right-content-file-checkde') && !tar.is('input') && !tar.is('h1')){
		//排除不能出现选框的元素
		var downL = event.pageX;
		var downT = event.pageY;

		content.on('mousemove', function(event){
			var moveL = event.pageX;
			var moveT = event.pageY;
			var wid = Math.abs(moveL-downL)-2;
			var hei = Math.abs(moveT-downT)-2;

			if(Math.abs(moveL-downL) > 10 || Math.abs(moveT-downT) > 10){
				var contentL = content.offset().left;
				var contentT = content.offset().top;

				rectJq.css({
					'width': wid+'px',
					'height': hei+'px',
					'left': Math.min(downL-contentL, moveL-contentL)+'px',
					'top': Math.min(downT-contentT, moveT-contentT)+'px'
				}).show();

				var rect = document.querySelector('.main-right-content-rect');
				var files = document.querySelectorAll('.main-right-content-file');

				files.forEach(function(item){
					if(cloudTool.collision(rect, item)){
						//选框碰到文件
						var id = Number(item.getAttribute('custom-id'));
						var lenSameLevel = cloudTool.getSameLevelById(id).length;

						item.children[0].classList.add('main-right-content-file-checked');
						item.classList.add('main-right-content-filecheck');

						data.forEach(function(item){
							if(item.id === id){
								//选中数据
								item.checked = true;
							}
						});

						var lenChoose = content.find('div.main-right-content-file-checked').length;

						if(lenChoose === lenSameLevel){
							//全部选中了
							all.addClass('main-right-top-all');
						}
					}else{
						//选框没碰到文件
						var id = Number(item.getAttribute('custom-id'));
						var lenSameLevel = cloudTool.getSameLevelById(id).length;
						
						item.children[0].classList.remove('main-right-content-file-checked');
						item.classList.remove('main-right-content-filecheck');

						data.forEach(function(item){
							if(item.id === id){
								//取消选中
								item.checked = false;
							}
						});

						var lenChoose = content.find('div.main-right-content-file-checked').length;

						if(lenChoose !== lenSameLevel){
							//取消全选
							all.removeClass('main-right-top-all');
						}
					}
				});
			}
		});
	}

	content.on('mouseup', function(){
		rectJq.remove();
		content.off('mousemove mouseup');
	});

	if(!tar.is('input')){
		event.preventDefault();
	}
});

//出现提示
function tips(txt, cls){
	tipsLayer.attr('class', 'main-top-time').addClass(cls).text(txt).show().css('margin-left', '-'+ tipsLayer.innerWidth()/2 +'px').stop().animate({
		opacity: '1',
		top: '15px'
	});

	clearTimeout(timerTips);

	timerTips = setTimeout(function(){
		tipsLayer.stop().animate({
			opacity: '0',
			top: '0'
		}, function(){
			$(this).hide();
		});
	}, 3000);
};

//删除
del.on('click', function(){
	var lenDel = $('.main-right-content-file-checked').length;

	if(lenDel === 0){
		//没有选中任何文件
		tips('请选择文件', WARN);
	}else{
		//选中了文件
		var topDel = ($(window).height()-tipsDel.outerHeight())/2;
		var topDe = topDel-15;
		var cancel = tipsDel.find('div button.delete-btns-cancel');
		var close = tipsDel.children('span');
		var ok = tipsDel.find('div button:first');
		var filesChecked = $('.main-right-content-filecheck');
		var id = Number($('.main-tree-cur').parent().attr('custom-id'));

		tipsDel.show().css('top', topDe+'px').animate({
			opacity: '1',
			top: topDel+'px'
		});

		//取消删除
		function cancelDel(){
			tipsDel.animate({
				opacity: '0',
				top: topDe+'px'
			}, function(){
				$(this).hide();
			});
		};

		cancel.on('click', cancelDel);
		close.on('click', cancelDel);
		ok.off('click');

		ok.on('click', function(){
			var topDeleting = ($(window).height()-deleting.outerHeight())/2;
			var topDeDeleting = topDeleting-15;
			var nDeleting = 0;

			sonDel.text(nDeleting);
			cancelDel();
			deleting.find('span:last').text(lenDel);
			deleting.show().css('top', topDeDeleting+'px').animate({
				opacity: '1',
				top: topDeleting+'px'
			}, 'slow', function(){
				var timer = setInterval(function(){
					nDeleting++;
					sonDel.text(nDeleting);

					if(nDeleting === lenDel){
						//选中的都删了
						setTimeout(function(){
							deleting.animate({
								opacity: '0',
								top: topDeDeleting+'px'
							}, function(){
								$(this).hide();
								filesChecked.remove();
								empty();
								//删除数据
								for(var i = 0; i < data.length; i++){
									if(data[i].checked){
										var childrenAll = cloudTool.getChildrenAllById(data[i].id);

										for(var j = 0; j < childrenAll.length; j++){
											if(data[i].id === childrenAll[j].id){
												data.splice(i, 1);
											}
										};

										i--;
									}
								};

								$('.main-tree').remove();
								mainCon.prepend(cloudTool.createTreeHtml(-1));
								mainCon.children('ul').addClass('main-tree');
								$('.main-tree li[custom-id="'+ id +'"] > span').addClass('main-tree-cur');

								//删除成功提示
								tips('删除文件成功', SUCCESS);
							});

							clearInterval(timer);
							nDeleting = 0;
						}, 500);
					}
				}, 1000);
			});
		});
	}
})

//重命名
$('.main-deal-name').on('click', function(){
	var lenName = $('.main-right-content-file-checked').length;

	if(lenName === 0){
		//没有选中任何文件
		tips('请选择文件', WARN);
	}else if(lenName > 1){
		//选中了多个文件
		tips('只能给一个文件重命名', WARN);
	}else{
		//开始重命名
		var name = $('.main-right-content-filecheck span');
		var input = $('.main-right-content-filecheck input');
		var curFile = $('.main-right-content-filecheck');
		var id = Number(curFile.attr('custom-id'));

		name.hide();
		input.val(name.text()).show().select();
		isNaming = true;
	}
});

//点击空白处确认文件名
$(document).mousedown(function(event){
	var tar = $(event.target);
	var input = $('.main-right-content-filecheck input');

	if(isNaming && !tar.is(input)){
		//正在重命名
		var name = $('.main-right-content-filecheck span');
		var curFile = $('.main-right-content-filecheck');
		var id = Number(curFile.attr('custom-id'));
		var idParent = Number($('.main-right-top a:last').attr('custom-id'));
		var sameLevel = cloudTool.getSameLevelById(id, true);
		var txt = $.trim(input.val());
		var isRepeat = false;

		sameLevel.forEach(function(item){
			if(item.title === txt){
				//重名了
				isRepeat = true;
			}
		});

		if(isRepeat){
			//重名了
			tips('同级中不能有重名文件', WARN);
		}else{
			//没重名
			if(txt === ''){
				//空文件名
				tips('请输入文件名', WARN);
			}else{
				//非空
				input.hide();
				name.text(txt).show();
				curFile.removeClass('main-right-content-filecheck');
				$('.main-right-content-file-checked').removeClass('main-right-content-file-checked');

				data.forEach(function(item){
					if(item.id === id){
						//修改数据
						item.title = txt;
						item.checked = false;
					}
				});

				$('.main-tree').remove();
				mainCon.prepend(cloudTool.createTreeHtml(-1));
				mainCon.children('ul').addClass('main-tree');
				$('.main-tree li[custom-id="'+ idParent +'"] > span').addClass('main-tree-cur');

				isNaming = false;
			}
		}
	}
});

//新建
$('.main-deal-new').on('click', function(){
	var newFile = $('<div class="main-right-content-file" custom-id="">\
							      <div class="main-right-content-file-checkde"></div>\
							      <span></span>\
							      <input value="" class="main-right-content-file-txt" />\
							    </div>');
	var input = newFile.find('input');
	var name = newFile.find('span');
	var idParent = Number($('.main-right-top a:last').attr('custom-id'));
	var children = cloudTool.getChildrenById(idParent);

	//无内容
	if(content.children().last().is('div.main-right-content-bar')){
		content.removeClass('main-right-content-empty');
		$('.main-right-content-empty-con').hide();
	}

	newFile.appendTo(content).find('span').hide();
	input.show().focus();
	isNewing = true;

	window.newing = {
		newFile: newFile,
		input: input,
		name: name,
		idParent: idParent,
		children: children
	};
});

//确认新建
$(document).on('mousedown', function(event){
	var tar = $(event.target);

	if(isNewing && !tar.is('input.main-right-content-file-txt')){
		//正在新建且点的不是文本框
		var txt = $.trim(newing.input.val());
		var isRepeat = false;
		var arr = [0];

		newing.children.forEach(function(item){
			if(item.title === txt){
				//重名了
				isRepeat = true;
			}
		});

		if(txt === ''){
			//空文件名
			tips('请输入文件名', WARN);
		}else if(isRepeat){
			//重名了
			tips('同级中不能有重名文件', WARN);
		}else{
			//新建这个文件
			newing.input.hide();
			newing.name.text(txt).show();

			data.forEach(function(item){
				if(item.id > arr[0]){
					arr.splice(0, 1, item.id);
				}
			});

			arr[0]++;

			data.push({
		    title: txt,
		    id: arr[0],
		    pid: newing.idParent,
		    checked: false
		  });

		  newing.newFile.attr('custom-id', arr[0]);
		  $('.main-tree').remove();
			mainCon.prepend(cloudTool.createTreeHtml(-1));
			mainCon.children('ul').addClass('main-tree');
			$('.main-tree li[custom-id="'+ newing.idParent +'"] > span').addClass('main-tree-cur');
			isNewing = false;
		}
	}
});

//移动
$('.main-deal-move').on('click', function(){
	var lenChoose = $('.main-right-content-file-checked').length;

	if(lenChoose === 0){
		//没有选中任何文件
		tips('请选择文件', WARN);
	}else{
		//出现移动层
		var titles = $.map($('.main-right-content-filecheck span'), function(item){
			return $(item).text();
		});

		var place = $('.place');
		var treePlace = $('.place-tree');
		var idParent = Number($('.main-right-top a:last').attr('custom-id'));
		var tipsPlace = $('.place-tips');
		var cancelPlaceBtn = $('.delete-btns-cancel');
		var okPlace = cancelPlaceBtn.prev();
		
		$('.place-file').text(titles.join('，'));
		treePlace.html(cloudTool.createTreeHtml(-1));
		treePlace.children('ul').addClass('place-tree-ul');
		$('.place-tree-ul li[custom-id="'+ idParent +'"] > span').addClass('main-tree-cur');
		place.show();

		var topPlace = ($(window).height()-place.outerHeight())/2;

		place.css('top', topPlace+'px');

		//隐藏移动层
		function cancelPlace(){
			place.hide();
			tipsPlace.hide();
		};

		$('.place-x').on('click', cancelPlace);
		cancelPlaceBtn.on('click', cancelPlace);

		//点击移动文档树
		$('.place-tree-ul span').on('click', function(){
			var ids = $.map($('.main-right-content-filecheck'), function(item){
				return Number($(item).attr('custom-id'));
			});

			var names = $.map($('.main-right-content-filecheck'), function(item){
				return $(item).find('span').text();
			});

			var childrenAll = cloudTool.getChildsAllByIds(ids);
			var that = $(this);
			var idTarget = Number(that.parent().attr('custom-id'));
			var childrenTarget = cloudTool.getChildrenById(idTarget);
			var isSelfDescendant = false;
			var isRepeat = false;

			childrenAll.forEach(function(item){
				if(that.text() === item.title && idTarget === item.id){
					//点击的是自己及后代
					isSelfDescendant = true;
				}
			});

			childrenTarget.forEach(function(item){
				names.forEach(function(itemName){
					if(item.title === itemName){
						//有重名文件
						isRepeat = true;
					}
				});
			});

			if(that.hasClass('main-tree-cur') && !isSelfDescendant){
				//就在当前层级
				tipsPlace.show();
				okPlace.off('click');
			}else if(isSelfDescendant || isRepeat){
				//点击的是自己及后代
				tipsPlace.show();
				$('.place-tree-ul span.place-tree-ul-target').removeClass('place-tree-ul-target');
				okPlace.off('click');
			}else{
				//可以移动
				tipsPlace.hide();
				$('.place-tree-ul span.place-tree-ul-target').removeClass('place-tree-ul-target');
				that.addClass('place-tree-ul-target');

				//点击确定
				okPlace.on('click', function(){
					data.forEach(function(item){
						ids.forEach(function(itemIds){
							if(item.id === itemIds){
								//找到选中文件对应的数据
								item.pid = idTarget;
							}
						});
					});

					bar.nextAll().remove();
					content.append(cloudTool.createFileHtml(idParent));					
					empty();
					$('.main-tree').remove();
					mainCon.prepend(cloudTool.createTreeHtml(-1));
					mainCon.children('ul').addClass('main-tree');
					$('.main-tree li[custom-id="'+ idParent +'"] > span').addClass('main-tree-cur');
					place.hide();
				});
			}
		});
	}
});