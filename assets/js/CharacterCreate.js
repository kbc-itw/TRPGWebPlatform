//キャラクターを作成する処理
//作成画面をhymlで
//基本フロー3,6,9の処理

//3,アクターは作成するキャラクターPCかNPCかを選択する。
function judge(acter){
  if(acter=="PC") {

  }else　if(acter=="NPC"){

  }
}
//1～6の乱数作成。それを3回繰り返したのを合計して返す。(3d6)
//6,システムはダイスロールの値からをステータスを決める。
function Diceroll(select){
    let dice = 0;
    if(select == "3D6") {
      for(int i:3) {
        let diceroll = Math.floor(Math.random() * 7);
        dice += diceroll;
      }
    return dice;
    }

    if(select == "2D6") {
      for(int:2) {
        let diceroll = Math.floor(Math.random() * 7);
        dice += diceroll;
      }
      return dice;
    }
}

function Select() {

}

//9,システムは情報をjson形式で管理用フォルダに保存する。

//jsonに変換
function Change(data) {
  let target = data.target;
  let file = target.files;
  let jsondata = JSON.stringify(file);
}

//ファイルのダウンロード（保存）
function Save(content, filename) {
    let blob = new Blob([ content ], { "type" : "text/plain" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }
}
let file = document.getElementById('file');
file.addEventListener('click',Save;
