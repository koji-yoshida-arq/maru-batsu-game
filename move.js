// ゲームの稼動非稼動
var mode = false;
var count = 0;

// ターン（trueが○、falseが×）
var isMaru;

// セルのステータス
var cellStatus = [
    null, null, null,
    null, null, null,
    null, null, null
];

// 該当セルがリーチかどうか
var cellReach = [
    null, null, null,
    null, null, null,
    null, null, null
]




// ゲームスタート
function game() {
    const turn = document.form1.turn;
    const maru_player = document.form1.maru_player.value;
    const batsu_player = document.form1.batsu_player.value;

    for (var i = 0; i < turn.length; i++) {
        if(turn[i].checked) {

            // 初ゲーム時のテーブルの生成
            if(count == 0) {
                first();
            }
            count++;

            // 先攻・後攻の指定
            if(turn[i].value == "maru") {
                isMaru = true;
            } else {
                isMaru = false;
            }
        
            //盤面の初期化
            reset();

            // CPUを選択した場合の操作
            if(isMaru && (maru_player == "maru_cpu")) {
                com_select();
            } else if(!isMaru && (batsu_player == "batsu_cpu")) {
                com_select();
            }

            break;
        }
    }
}






function first() {

    // テーブルの生成
    document.getElementById("gamemonitor").innerHTML = "<table></table>";


    // テーブルの読み込み
    var table = document.querySelector("table");


    for(var j = 0; j < 3; j++) {

        // 行方向の生成（はじめ）
        var tr = document.createElement("tr");


        for(var i = 0; i < 3; i++) {

            // 列方向の生成（はじめ）
            var td = document.createElement("td");
            // セルIDの設定
            td.setAttribute("id", "" + i + "-" + j);
            // クリックされたときの動作指定
            td.setAttribute("onclick", "clickTd(this);");
            // 列方向の生成（おわり）
            tr.append(td);
        }

        // 行方向の生成（おわり）
        table.append(tr);
    }
}





function reset() {
    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {

            // セル内の表示をリセット
            document.getElementById(i + "-" + j).innerHTML= "";
            
            // カーソルをポインターにセット
            document.getElementById(i + "-" + j).style.cursor = 'pointer';
            
            // 背景色を白
            document.getElementById(i + "-" + j).style.backgroundColor = '#ffffff';

            // セル情報のリセット
            cellStatus[i * 3 + j] = null;

            // リーチ情報のリセット
            cellReach[i * 3 + j] = null;
            
        }
    }

    // 第一ターンの指定
    if(isMaru) {
        document.getElementById("result").innerText = "○の番です。";
    } else {
        document.getElementById("result").innerText = "×の番です。";
    }
    mode = true;
}





// セルがクリックされたときの動作
function clickTd(target) {

    // ゲームの稼動状態の確認
    if(mode) {

        // セル座標の取得
        var [sx, sy] = target.id.split("-");
        var x = Number(sx);
        var y = Number(sy);


        // セルの中身が何もかかれていないことを確認
        if(target.innerHTML == '') {

            // プレイヤの確認（true:○、false:×）
            write_kigou(x + (y * 3));
        }
    }

    // 次プレイヤがCOMかどうかの確認
    if(isMaru && (document.form1.maru_player.value == "maru_cpu")) {
        console.log("チェック1");
        com_select();
    } else if((isMaru == false) && (document.form1.batsu_player.value == "batsu_cpu")) {
        console.log("チェック2");
        com_select();
    }
}





// テーブルの状態把握とゲームの続行判定
function checkGameOver() {


    var x;
    var y;

    // 終了条件
    var finishPatterns = [

        // 横 
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // 縦
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // 斜め
        [0, 4, 8],
        [2, 4, 6]
    ]

    for(var m = 0; m < 9; m++) {
        // リーチ条件の初期化
        cellReach[m] = null;
    }

    // 終了条件判定
    for(var i = 0; i < finishPatterns.length; i++) {

        var cell = [null, null, null];
        var bcolor;
        var reach = 0;

        // セルの状態を判定用の変数に代入
        cell[0] = cellStatus[finishPatterns[i][0]];
        cell[1] = cellStatus[finishPatterns[i][1]];
        cell[2] = cellStatus[finishPatterns[i][2]];


        // 終了条件と一致しているか、リーチであるか
        if((cell[0] != null) && (cell[1] != null) && (cell[2] != null) && (cell[0] == cell[1]) && (cell[1] == cell[2])) {
            
            //一致している場合はゲームを続行させない 
            mode = false;

            for(var j = 0; j < cell.length; j++) {
                
                // 勝利時の色選択
                if(isMaru) {
                    bcolor = "#ff0000";
                } else {
                    bcolor = "#0000ff";
                }
                
                // 勝利時のセルの特定
                x = finishPatterns[i][j] % 3;
                y = Math.floor(finishPatterns[i][j] / 3);
                
                // 勝利時の表示変更
                document.getElementById(x + "-" + y).style.color = "#ffffff";
                document.getElementById(x + "-" + y).style.backgroundColor = bcolor;

            }

        } else if(((cell[0] != null) && (cell[1] != null) && (cell[2] == null) && (cell[0] == cell[1])) || ((cell[0] != null) && (cell[1] == null) && (cell[2] != null) && (cell[0] == cell[2])) || ((cell[0] == null) && (cell[1] != null) && (cell[2] != null) && (cell[1] == cell[2]))) {

            var j;
            var reach_color;

            // リーチセルの特定
            if(cell[1] == cell[2]) {
                j = 0;
                reach_color = cell[1];
            } else if(cell[0] == cell[2]) {
                j = 1;
                reach_color = cell[0];
            } else if(cell[0] == cell[1]){
                j = 2;
                reach_color = cell[0];
            }

            // リーチセルのセル情報の特定
            x = finishPatterns[i][j] % 3;
            y = Math.floor(finishPatterns[i][j] / 3);

            // リーチ者の特定
            if(cellReach[finishPatterns[i][j]] == null) {
                if(reach_color) {
                    // ○がリーチ
                    document.getElementById(x + "-" + y).style.backgroundColor = "#ffa0ff";
                } else {
                    // ×がリーチ
                    document.getElementById(x + "-" + y).style.backgroundColor = "#0affff";
                }
                // リーチ情報の代入
                cellReach[finishPatterns[i][j]] = reach_color;
            } else {
                // 両者ともリーチ
                document.getElementById(x + "-" + y).style.backgroundColor = "#800080";
                // リーチ情報の代入
                cellReach[finishPatterns[i][j]] = "both";
            }
            
        }
    }





    // ゲームが続行しているかどうか（false:終了、true:続行）
    if(!mode) {
        if (isMaru) {
            document.getElementById("result").innerText = "○の勝ちです。もう一度する場合は「ゲームスタート」をクリック！";
        } else {
            document.getElementById("result").innerText = "×の勝ちです。もう一度する場合は「ゲームスタート」をクリック！";
        }

        // すべてのセルのhoverした際のカーソルを「操作できない領域用」にする
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                document.getElementById(i + "-" + j).style.cursor = 'not-allowed';
            }
        }

    } else {
        
        //空白セルの確認
        for(var count = 0; count < 9; count++) {
            if(cellStatus[count] == null) {
                break;
            }
        }

        //埋まっているマスが9マスだったら引き分け
        if(count == 9) {

            //ゲームの終了
            mode = false;
            document.getElementById("result").innerText = "引き分けです。もう一度する場合は「ゲームスタート」をクリック！";
        
        } else {

            // 次プレイヤの表示（true:○の番、false:×の番）
            if (isMaru) {
                isMaru = false;
                document.getElementById("result").innerText = "×の番です。";
            } else {
                isMaru = true;
                document.getElementById("result").innerText = "○の番です。";
            } 
        }
    }
}




function com_select() {
    var mass_null = 0;
    var error = 0;
    var count;
    var anotherReach = 99;

    var moving = new Array(9);
    var flag = false;

    for(count = 0; count < 9; count++) {
        
        if((cellStatus[count] == null) && ((cellReach[count] == isMaru) || (cellReach[count] == "both"))) {
            console.log("チェック5");
            write_kigou(count);
            break;
        } else if((cellStatus[count] == null) && ((cellReach[count] != isMaru) && (cellReach[count] != null))){
            anotherReach = count;
        } else if(cellStatus[count] == null) {
            mass_null++; 
        }
    }


    
    if(count == 9) {

        if(anotherReach < 9) {
            console.log("チェック3");
            write_kigou(anotherReach);
        } else {
            if(mass_null == 9) {
                moving[9 - mass_null] = Math.floor(Math.random() * 4) * 2;
                if(moving[9 - mass_null] == 4) {
                    moving[9 - mass_null] = 8;
                } 
                console.log("チェック4");
                write_kigou(moving[9 - mass_null]);
            }

            if(mass_null == 1) {
                for(var i = 0; i < 9; i++) {
                    flag = true;
                    if(cellStatus[i] == null) {
                        console.log("チェック6");
                        write_kigou(i);
                        flag = false;
                        break;
                    }
                }
            }

            if(flag) {
                console.log("エラー");
            }
        }


    }


    
    
}




function write_kigou(cellno) {
    var x = cellno % 3;
    var y = Math.floor(cellno / 3);

    // セルのステータスを更新
    cellStatus[cellno] = isMaru;

    for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
            document.getElementById(i + "-" + j).style.backgroundColor = "#ffffff";
        }
    }

    if(isMaru) {
        document.getElementById(x + "-" + y).innerHTML = '〇';
        document.getElementById(x + "-" + y).style.color = "#ff0000";
    } else {
        document.getElementById(x + "-" + y).innerHTML = '×';
        document.getElementById(x + "-" + y).style.color = "#0000ff";
    }

    document.getElementById(x + "-" + y).style.backgroundColor = "#ffff00";

    // 記入されたセルにhoverした際のカーソルを「操作できない領域用」にする
    document.getElementById(x + "-" + y).style.cursor = 'not-allowed';

    //終了条件チェック
    checkGameOver();
}

