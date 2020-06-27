window.onload = function () { //页面加载时会触发
	var socket = io(),
		chess = document.getElementById('chess'),

		//棋盘大小
		Row = 15,
		NUM = Row * Row,
		chessWidth = chess.offsetWidth,
		//棋子大小
		blockWidth = Math.floor((chessWidth - Row) / Row) + 'px',
		//用户默认可以落子
		canDrop = true,
		//系统默认落子为白棋
		color = 'white',
		//存放已经落子的位置
		whiteBlocks = {}, blackBlocks = {};


	//画图
	(function () {
		var el,
			//棋盘画横线竖线
			rowline, colline;
		for (var i = 0; i < Row; i++) {
			//计算好间隔的横线
			rowline = document.createElement('div'); //创建一个指定的元素
			rowline.setAttribute('class', 'row');
			rowline.style.top = (chessWidth / Row) / 2 + (chessWidth / Row) * i + 'px';
			chess.appendChild(rowline);

			//计算好间隔的竖线
			colline = document.createElement('div'); //创建一个指定的元素
			colline.setAttribute('class', 'col');
			colline.style.left = (chessWidth / Row) / 2 + (chessWidth / Row) * i + 'px';
			chess.appendChild(colline);

			for (var j = 0; j < Row; j++) {
				el = document.createElement('div') ;
				el.style.width = blockWidth;
				el.style.height = blockWidth;
				el.setAttribute('class', 'block');
				el.setAttribute('id', i + '_' + j);
				chess.appendChild(el);

			}
		}
	})();
	var id2Position = function (id) {
		return {
			x: Number(id.split('_')[0]),
			y: Number(id.split('_')[1])
		};

	};
	var position2Id = function (x, y) {
		return x + '_' + y;
	}

	var isHaswinner = function (id, dic) {
		var x = id2Position(id).x;
		var y = id2Position(id).y;
		var rowCount = 1,
			colCount = 1,
			leftSKewLineCount = 1,
			rightSkewLineCount = 1;
		var tx, ty;
		//横线
		tx = x;
		ty = y;
		while (dic[position2Id(tx, ty + 1)]) {
			rowCount++;
			ty++; 
		}
		tx = x;
		ty = y;
		while (dic[position2Id(tx, ty - 1)]) {
			rowCount++;
			ty--;
		}
		if (rowCount == 5) return true;

		//竖线
		tx = x;
		ty = y;
		while (dic[position2Id(tx + 1, ty)]) {
			colCount++;
			tx++;
		}
		tx = x;
		ty = y;
		while (dic[position2Id(tx - 1, ty)]) {
			colCount++;
			tx--;
		}
		if (colCount == 5) return true;


		//斜线
		tx = x;
		ty = y;
		while (dic[position2Id(tx + 1, ty + 1)]) {
			leftSKewLineCount++;
			tx++;
			ty++
		}
		tx = x;
		ty = y;
		while (dic[position2Id(tx - 1, ty - 1)]) {
			leftSKewLineCount++;
			tx--;
			ty--
		}
		if (leftSKewLineCount==5) return true;

		//反斜线
		tx = x;
		ty = y;
		while (dic[position2Id(tx - 1, ty + 1)]) {
			rightSkewLineCount++;
			tx--;
			ty++;
		}
		tx = x;
		ty = y;
		while (dic[position2Id(tx + 1, ty - 1)]) {
			rightSkewLineCount++;
			tx++;
			ty--;
		}
		if (rightSkewLineCount == 5) return true;
		return false;

	}

	// 处理对手发来信息
	socket.on('drop one', function (data) {
		canDrop = true;
		var el = document.getElementById(data.id);
		el.setAttribute('has-one', 'true');
		if (data.color == 'white') {
			color = 'black';
			el.setAttribute('class', 'block white');
			whiteBlocks[data.id] = true;
			if (isHaswinner(data.id, whiteBlocks)) {
				alert('白棋赢了');
				location.reload();
			}

		} else {
			el.setAttribute('class', 'block black');
			blackBlocks[data.id] = true;
			if (isHaswinner(data.id, blackBlocks)) {
				alert('黑棋赢了');
				location.reload();
			}

		}

	});
	//事件委托方式处理用户下棋
	chess.onclick = function (e) {
		var el = e.target;
		if (!canDrop || el.hasAttribute('has-one') || el == this) {
			return;
		}
		el.setAttribute('has-one', 'true');
		canDrop = false;
		var id = el.getAttribute('id');
		if (color == 'white') {
			el.setAttribute('class', 'block white');
			whiteBlocks[id] = true;
			socket.emit('drop one', {
				id: id,
				color: 'white'
			});
			if (isHaswinner(id, whiteBlocks)) {
				alert('白棋赢了');
				location.reload();
			}
		}
		if (color == 'black') {
			el.setAttribute('class', 'block black');
			blackBlocks[id] = true;
			socket.emit('drop one', {
				id: id,
				color: 'black'
			});
			if (isHaswinner(id, blackBlocks)) {
				alert('黑棋赢了');
				location.reload();
			}
		}
	}



}
