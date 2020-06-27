var chess = document.getElementById("chess");
var context = chess.getContext("2d");
var me = true; //me为true代表黑色先下棋，false白色先下棋
var over = false; //棋子是否结束
var chessBoard = [] //定义一个二维数组,存储每一个棋子的落点，不能重复
//赢法统计数组 一卫数组
var myWin = []; //我赢
var computerWin = [] //电脑赢 

//赢法数组
var wins = []; //三维数组，保存所有赢法的数组 win[][][]
for (var i = 0; i < 15; i++) {
	wins[i] = [];
	for (var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
var count = 0 //赢法的索引
// “|”赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		// wins[0][0][0]    
		// wins[0][1][0]
		// wins[0][2][0]
		// wins[0][3][0]
		// wins[0][4][0]
		//只就是第零中赢法，（0,0）为起点一条竖线在y轴上
		// wins[0][1][1]
		// wins[0][2][1]
		// wins[0][3][1]
		// wins[0][4][1]
		// wins[0][5][]
		//只就是第1中赢法  （0,1）为起点一条竖线在y轴上
		for (var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
// "——"赢法
for (var i = 0; i < 15; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			wins[k + j][i][count] = true;
		}
		count++;
	}
}
//“\”赢法
for (var i = 0; i < 11; i++) {
	for (var j = 0; j < 11; j++) {
		for (var k = 0; k < 5; k++) {
			// wins[0][0][0]
			// wins[1][1][0]
			// wins[2][2][0]
			// wins[3][3][0]
			// wins[4][4][0]
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//"/"赢法
for (var i = 0; i < 11; i++) {
	for (var j = 14; j > 3; j--) {
		for (var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}
//一共有多少种赢法
console.log(count);
//定义我赢和电脑赢
for (var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}


//存储棋盘的落点的二维数组
for (var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for (var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0 //等于0就是没有落子

	}
}
//画棋盘
var drawChessBoard = function() {
	context.strokeStyle = "#B9B9B9"
	for (var i = 0; i < 15; i++) {
		context.moveTo(15 + i * 40, 15);
		context.lineTo(15 + i * 40, 575);
		context.stroke();
		context.moveTo(15, 15 + i * 40);
		context.lineTo(575, 15 + i * 40)
		context.stroke();
	}
}
drawChessBoard();

//存储落子的位子
var oneStep = function(i, j, me) {
	//画棋子
	context.beginPath();
	context.arc(15 + i * 40, 15 + j * 40, 15, 0, 2 * Math.PI)
	context.closePath();
	var gradient = context.createRadialGradient(15 + i * 40 + 2, 15 + j * 40 - 2, 15, 15 + i * 40 + 2, 15 + j * 40 - 2, 0);
	if (me) {
		gradient.addColorStop(0, '#0a0a0a');
		gradient.addColorStop(1, '#636766');
	} else {
		gradient.addColorStop(0, '#D1D1D1');
		gradient.addColorStop(1, '#f9f9f9');
	}

	context.fillStyle = gradient;
	context.fill();
}
// oneStep(0,0,true);
// oneStep(1,1,false);

//实现落子
chess.onclick = function(e) {
	//over判断胜负
	if (over) {
		return;
	}
	//判断计算机下棋
	if (!me) {
		return;
	}
	var x = e.offsetX; //点击是获取的坐标位置X轴
	var y = e.offsetY; //点击是获取的坐标位置Y轴
	var i = Math.floor(x / 40);
	var j = Math.floor(y / 40);
	if (chessBoard[i][j] == 0) {
		oneStep(i, j, me);
		//防止占用同一的位置
		chessBoard[i][j] = 1;
		//实现轮流下棋 取反
		for (var k = 0; k < count; k++) {
			if (wins[i][j][k]) {
					myWin[k]++;
					computerWin[k] = 6;
					if (myWin[k] == 5) {
						window.alert("恭喜你，赢啦！！！");
						over = true;
					}
				
			}
		}
		if (!over) {
			 me = !me;
			computerAI();
		}
	}
}
//计算机的落子
var computerAI = function(){
	//Score判断的得分最高分五子连珠1000，为赢，
	//是二维数组计算每一个的的得分
	var myScore=[];
	var computerScore=[];
	var max=0;   //最高分
	var u=0,v=0;   //最高分的坐标
	
	for(var i=0;i<15;i++){
		myScore[i]=[];
		computerScore[i]=[];
		for (var j = 0; j < 15; j++){
			myScore[i][j]=0;
			computerScore[i][j]=0;
		}
	}
	//遍历整个棋盘 (i,j)棋盘坐标，count赢法总数 k:第几种赢法
	//一个点有多个可能的时候，分数会累加，例如（0，0），只有横竖的两种赢法 （8,8）可以有横竖斜反斜中，同时每一种还有几个赢法的可能
	for(var i=0;i<15;i++){
		for(var j=0;j<15;j++){
			//chessBoard[i][j]==0 表示空点
			if(chessBoard[i][j]==0){
				for(var k=0;k<count;k++){
					if(wins[i][j][k]){
						if(myWin[k]==1){
							myScore[i][j]+=100;
						}else if(myWin[k]==2){
							myScore[i][j]+=600
						}else if(myWin[k]==3){
							myScore[i][j]+=5000
						}else if(myWin[k]==4){
							myScore[i][j]+=10000
						}else if(myWin[k]==5){
							myScore[i][j]+=30000
						}
						if(computerWin[k]==1){
							computerScore[i][j]+=220;
						}else if(myWin[k]==2){
							computerScore[i][j]+=450
						}else if(myWin[k]==3){
							computerScore[i][j]+=2050
						}else if(myWin[k]==4){
							computerScore[i][j]+=20000
						}else if(myWin[k]==5){
							computerScore[i][j]+=40000
						}
						
					}
				}
				//记录最高分和最高分的点
				if(myScore[i][j]>max){
					max=myScore[i][j];
					u=i;
					v=j
				}else if(myScore[i][j]==max){
					//如果计算机的点分数大于我的点分数
					if(computerScore[i][j]>computerScore[u][v]){
						u=i;
						v=j;
				}
			}
			if(computerScore[i][j]>max){
					max=computerScore[i][j];
					u=i;
					v=j
				}else if(computerScore[i][j]==max){
					//如果计算机的点分数大于我的点分数
					if(myScore[i][j]>myScore[u][v]){
						u=i;
						v=j;
				}
			}
		}
	}
	}
	//落子在u,i
	oneStep(u,v,false);
	chessBoard[u][v]=2;
	for(var k=0;k<count;k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k]=6;
			if(computerWin[k]==5){
				window.alert("计算机赢了")
				over=true;
			}
		}
	}
	if(!over){
		me=!me;
	}
}