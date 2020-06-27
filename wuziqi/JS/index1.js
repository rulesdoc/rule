var chessBoard = [];
var me=true;
var over=false;

//赢法数组
var wins= [];

//赢法的统计数组
var myWin=[];
var computerWin=[];

for(var i=0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;
    }
}
for(var i=0;i<15;i++){
    wins[i]=[];
    for(var j=0;j<15;j++){
        wins[i][j]=[];
    }
}
var count=0;
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i][j+k][count]=true;
        }
        count++;
    }
}
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[k+j][i][count]=true;
        }
        count++;
    }
}
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}

for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}
console.log(count);
for(var i=0;i<count;i++){
    myWin[i]=0;
    computerWin[i]=0;
}

var chess=document.getElementById('chess');
var context=chess.getContext('2d');

context.strokeStyle='#000';

var a1=new Image();
a1.src="../IMG/a1.gif";
a1.onload=function(){
    context.drawImage(a1,0,0,590,590);
    drawChessBoard();



}
var drawChessBoard=function(){
    for(var i=0;i<15;i++){
        context.moveTo(15 + i*40,15);
        context.lineTo(15 + i*40,575);
        context.stroke();
        context.moveTo(15,15 + i*40);
        context.lineTo(575,15 + i*40);
        context.stroke();
    }
}
var oneStep=function(i,j,me){
    context.beginPath();
    context.arc(15+i*40,15+j*40,13,0,2*Math.PI);
    context.closePath();
    var gradient=context.createRadialGradient(15+i*40+2,15+j*40-2,13,15+i*40+2,15+j*40-2,0);
    if(me){
        gradient.addColorStop(0,"#0A0A0A");
        gradient.addColorStop(1,"#636766");
    }else{
        gradient.addColorStop(0,"#D1D1D1");
        gradient.addColorStop(1,"#F9F9F9");
    }

    context.fillStyle=gradient;
    context.fill();
}
chess.onclick=function(e) {
    if (over) {
        return;
    }
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x / 40);
    var j = Math.floor(y / 40);
    //if(chessBoard[i][j]==0){
    //    oneStep(i,j,me);
    //    if(me){
    //        chessBoard[i][j]=1;
    //    }else{
    //        chessBoard[i][j]=2;
    //    }
    //    me=!me;
//        for(var k=0;k<count;k++){
//            if(wins[i][j][k]){
//                myWin[k]++;
//                computerWin[k]=6;
//                if(myWin[k]==5){
//                    window.alert("你赢了")
//                    over=true;
//                }
//            }
//        }
//    }
//}
    if (chessBoard[i][j] == 0) {
        oneStep(i, j, me);
        if (me) {
            chessBoard[i][j] = 1;
        } else {
            chessBoard[i][j] = 2;
        }
        me = !me;
        for (var k = 0; k < count; k++) {
            if (wins[i][j][k]) {
                if (chessBoard[i][j] == 1) { //这个表示我方赢了 ? ? ?
                    myWin[k]++;
                    computerWin[k] = 6;
                    if (myWin[k] == 5) {
                        //window.alert("黑子赢了");
                        setTimeout(function(){
                            window.alert("黑子赢了");
                        },0);
                        over = true;
                    }
                } else {
                    myWin[k] = 6;
                    computerWin[k]++;
                    if (computerWin[k] == 5) {
                        //window.alert("白子赢了");
                        setTimeout(function(){
                            window.alert("白子赢了");
                        },0);
                        over = true;
                    }
                }
            }
        }
    }
}
//点击返回主页
function goback(){
	var back=confirm("是否返回主页面");
	if(back){
		window.location.href="../HTML/login.html"
	}else{
		alert("继续战斗吧")
	}
}
