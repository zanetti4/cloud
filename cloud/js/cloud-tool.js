// JavaScript Document
var cloudTool = (function(){
	//通过 id 找到数据中某一项
	function getItemById(id){
		for(var i = 0; i < data.length; i++){
			if(data[i].id === id){
				return data[i];
			}
		};

		return null;
	};

	//通过 id 找到数据中某一项的子集
	function getChildrenById(id){
		var arr = [];

		for(var i = 0; i < data.length; i++){
			if(data[i].pid === id){
				arr.push(data[i]);
			}
		};

		return arr;
	};

	//通过 id 找到同级数据
	function getSameLevelById(id, notSelf){
		var arr = [];
		var item = getItemById(id);

		for(var i = 0; i < data.length; i++){
			if(notSelf && data[i].pid === item.pid && data[i].id !== item.id){
				//不包含自己
				arr.push(data[i]);
			}else if(!notSelf && data[i].pid === item.pid){
				//包含自己
				arr.push(data[i]);
			}
		};

		return arr;
	};

	//找到指定 id 所有的父级
	function getParentAllById(id){
		var arr = [];
		var item = getItemById(id); // 先找到这条数据

		if(item){
			arr.push(item);
			// 递归调用这个元素，函数会返回当前数据的父级
			// 父级和当前的元素拼起来
			arr = arr.concat(getParentAllById(item.pid))
		}

		return arr;	
	};

	//通过 id 找到某条数据和它的所有后代
	function getChildrenAllById(id){
		var arr = [];
		var item = getItemById(id);

		if(item){
			arr.push(item);

			for(var i = 0; i < data.length; i++){
				if(data[i].pid === id){
					//arr.push(data[i]);
					arr = arr.concat(getChildrenAllById(data[i].id));
				}
			};
		}

		return arr;
	};

	//接收一个数组，找数组 id 的每一个子孙
	function getChildsAllByIds(idsArr){
		var arr = [];

		for( var i = 0; i < idsArr.length; i++ ){
			arr = arr.concat(getChildrenAllById(idsArr[i]))
		};

		return arr;	
	};

	//根据传入的 id，生成这个 id 下一级的 ul 结构
	function createTreeHtml(id){
		// 通过传入的id，找到所有的子级
		// 有子级生成ul结构	
		var childs = getChildrenById(id);
		var html = '';

		if(childs.length){
			html += '<ul>';

			for(var i = 0; i < childs.length; i++){
				var clsLi = getChildrenById(childs[i].id).length ? 'main-tree-unfold' : '';
				var clsSpan = getChildrenById(childs[i].id).length ? 'main-tree-open' : '';

				html += '<li custom-id="'+childs[i].id+'" class="'+ clsLi +'"><span class="'+ clsSpan +' main-tree-title">'+childs[i].title+'</span>';
				html += createTreeHtml(childs[i].id);
				html += '</li>';
			};

			html += '</ul>';
		}

		return html;
	};

	//生成路径导航
	function createPathHtml(id){
		var parents = getParentAllById(id).reverse();
		var html = '';

		for(var i = 0; i < parents.length; i++){
			if(i === parents.length-1){
				html += '<a href="javascript:;" custom-id="'+ parents[i].id +'">'+ parents[i].title +'</a>';
			}else{
				html += '<a href="javascript:;" custom-id="'+ parents[i].id +'">'+ parents[i].title +'</a> <img src="images/cloud_arrowpath.png" alt="" /> ';
			}
		};

		return html;
	};

	//渲染文件区域
	function createFileHtml(id){
		var childs = getChildrenById(id);
		var filesHtml = '';
		
		if(childs.length){
			for(var i = 0; i < childs.length; i++){
				filesHtml += '<div class="main-right-content-file" custom-id="'+ childs[i].id +'">\
								  			<div class="main-right-content-file-checkde"></div>\
								  			<span>'+ childs[i].title +'</span>\
								  			<input value="'+ childs[i].title +'" class="main-right-content-file-txt" />\
								  		</div>';
			};
		}

		return filesHtml;	
	};

	//碰撞检测
	function collision(dragEl, hitEl){
		if(dragEl.getBoundingClientRect().right < hitEl.getBoundingClientRect().left 
			|| dragEl.getBoundingClientRect().bottom < hitEl.getBoundingClientRect().top 
			|| dragEl.getBoundingClientRect().left > hitEl.getBoundingClientRect().right 
			|| dragEl.getBoundingClientRect().top > hitEl.getBoundingClientRect().bottom){
			//没碰到
			return false;
		}else{
			return true;
		}
	};

	return {
		getItemById: getItemById,
		getChildrenById: getChildrenById,
		getParentAllById: getParentAllById,
		createTreeHtml: createTreeHtml,
		createPathHtml: createPathHtml,
		createFileHtml: createFileHtml,
		getSameLevelById: getSameLevelById,
		collision: collision,
		getChildrenAllById: getChildrenAllById,
		getChildsAllByIds: getChildsAllByIds
	};
})();