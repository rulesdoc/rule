function PK(){
     
	var r=confirm("是否进入人机大战");
	if(r==true){
	
	}else{
		return false;
	}
 //  window.location.href="../HTML/index.html";
  //在另外新建窗口中打开窗口
window.open("../HTML/index.html");    
}
function friendPK(){
 
	var r=confirm("是否进入好友pk");
	if(r==true){
		alert("欢迎来到好友PK")
	}else{
		return false;
	}
	   
//   window.location.href="../HTML/index1.html";
     window.open("../HTML/index1.html");    
}
function know(){
//	window.location.href="../游戏说明.txt";
  window.open("../游戏说明.txt");    
}

