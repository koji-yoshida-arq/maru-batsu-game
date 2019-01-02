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


var cellReach = [
    null, null, null,
    null, null, null,
    null, null, null
]



function game() {
    const turn = document.form1.turn;
    const maru_player = document.form1.maru_player.value;
    const batsu_player = document.form1.batsu_player.value;

    for (var i = 0; i < turn.length; i++) {
        if(turn[i].checked) {

            if(turn[i].value == "maru") {
                isMaru = true;
            } else {
                isMaru = false;
            }

            if(count == 0) {
                first();
            }
            count++;
        
            reset();


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
            document.getElementById(i + "-" + j).innerHTML= "";
            document.getElementById(i + "-" + j).style.cursor = 'pointer';
            document.getElementById(i + "-" + j).style.backgroundColor = '#ffffff';

            cellStatus[i * 3 + j] = null;
            cellReach[i * 3 + j] = null;
            
        }
    }

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
            //write_kigou(x, y);
            write_kigou(x + (y * 3));

            // テーブルの状態把握とゲームの続行判定
            //checkGameOver();
        }
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


        // 終了条件と一致しているか確認
        if((cell[0] != null) && (cell[1] != null) && (cell[2] != null) && (cell[0] == cell[1]) && (cell[1] == cell[2])) {
            
            //一致している場合はゲームを続行させない 
            mode = false;

            for(var j = 0; j < cell.length; j++) {
                
                
                if(isMaru) {
                    bcolor = '#ff0000'
                } else {
                    bcolor = '#0000ff';
                }
                
                x = finishPatterns[i][j] % 3;
                y = Math.floor(finishPatterns[i][j] / 3);
                
                document.getElementById(x + "-" + y).style.color = '#ffffff'
                document.getElementById(x + "-" + y).style.backgroundColor = bcolor;
            }
        } else if(((cell[0] != null) && (cell[1] != null) && (cell[2] == null) && (cell[0] == cell[1])) || ((cell[0] != null) && (cell[1] == null) && (cell[2] != null) && (cell[0] == cell[2])) || ((cell[0] == null) && (cell[1] != null) && (cell[2] != null) && (cell[1] == cell[2]))) {
            
            var j;
            var reach_color;

            

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

            x = finishPatterns[i][j] % 3;
            y = Math.floor(finishPatterns[i][j] / 3);

            if(cellReach[finishPatterns[i][j]] == null) {
                if(reach_color) {
                    document.getElementById(x + "-" + y).style.backgroundColor = "#ffa0ff";
                } else {
                    document.getElementById(x + "-" + y).style.backgroundColor = "#0affff";
                }
                cellReach[finishPatterns[i][j]] = reach_color;
            } else {
                document.getElementById(x + "-" + y).style.backgroundColor = "#800080";
                cellReach[finishPatterns[i][j]] = "both";
            }

            // if(cellReach[finishPatterns[i][j]] == null) {
            //     cellReach[finishPatterns[i][j]] = isMaru;
            //     if(isMaru) {
            //         document.getElementById(x + "-" + y).style.color = '#ff0000';
            //     } else {
            //         document.getElementById(x + "-" + y).style.color = '#0000ff';
            //     }
            // } else {
            //     cellReach[finishPatterns[i][j]] = "both";
            //     document.getElementById(x + "-" + y).style.color = '#ff00ff';
            // }

            
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

            if(isMaru && (document.form1.maru_player.value == "maru_cpu")) {
                com_select();
            } else if(!isMaru && (document.form1.batsu_player.value == "batsu_cpu")) {
                com_select();
            }
            
        }
    }
}




function com_select() {
    var count = 0;
    var error = 0;
    var i;
    var j;

    for(j = 0; j < 9; j++) {
        if((cellStatus[j] == null) && ((cellReach[j] == isMaru) || (cellReach[j] == "both"))) {
            // var x = j % 3;
            // var y = Math.floor(j / 3);
            // write_kigou(x, y);
            write_kigou(j);
            //checkGameOver();
            break;
        } else if((cellStatus[j] == null) && ((cellReach[j] != isMaru) && (cellReach[j] != null))){
            // var x = j % 3;
            // var y = Math.floor(j / 3);
            // write_kigou(x, y);
            write_kigou(j);
            //checkGameOver();
            break
        } else if(cellStatus[j] != null) {
            count++; 
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

    checkGameOver();
}

