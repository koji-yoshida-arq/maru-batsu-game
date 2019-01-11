// ゲームの稼動非稼動
var mode = false;
var count = 0;

// ターン（trueが○、falseが×）
var isMaru;

var turn;
var maru_player;
var batsu_player;

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
];





// ゲームスタート
function game() {
    turn = document.form1.turn;
    maru_player = document.form1.maru_player.value;
    batsu_player = document.form1.batsu_player.value;

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
            do {
                if(isMaru && (maru_player == "maru_cpu")) {
                    com_select();
                } else if(!isMaru && (batsu_player == "batsu_cpu")) {
                    com_select();
                }
            } while(((maru_player == "maru_cpu") && (batsu_player == "batsu_cpu")) && (mode == true));

            break;
        }
    }
}





// 初ゲーム時のテーブル生成
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





// 毎ゲームのテーブル初期化
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
    if(isMaru && (maru_player == "maru_cpu")) {
        com_select();
    } else if((isMaru == false) && (batsu_player == "batsu_cpu")) {
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





// コンピュータによるセル選択
function com_select() {
    var mass_null = 0;
    var mass_move = 0;
    var count;
    var anotherReach = 99;
    var moving = new Array(9);
    var reach_flg = 0;


    // リーチ状態の場所を探す。
    for(count = 0; count < 9; count++) {
        
        // 自リーチのときにはそのセルを選択する。相手のセルは今は記録だけしてスルー。
        if((cellStatus[count] == null) && ((cellReach[count] == isMaru) || (cellReach[count] == "both"))) {
            if((reach_flg == 0) || (Math.floor(Math.random() * 2) == 1)) {
                moving[mass_move] = count;
                reach_flg = 1;
            }
        } else if((cellStatus[count] == null) && ((cellReach[count] != isMaru) && (cellReach[count] != null))){
            if((anotherReach == 99) || (Math.floor(Math.random() * 2) == 1)) {
                anotherReach = count;
            }
        } else if(cellStatus[count] == null) {
            mass_null++; 
        }
    }


    // 自リーチが無いとき
    if(reach_flg == 0) {

        // 相手のリーチがあればそれを防御する。
        if(anotherReach < 9) {
            moving[mass_move] = anotherReach;
        } else {
            mass_move = 9 - mass_null;

            // 現時点で埋まっているマスが何個あるかを調べ、状況に応じてそれぞれの動きをする。
            switch(mass_move) {

                // 先攻1手目
                case 0:

                    // 勝率の高い角を狙う。
                    moving[mass_move] = Math.floor(Math.random() * 4) * 2;
                    if(moving[mass_move] == 4) {
                        moving[mass_move] = 8;
                    } 
                    break;


                // 後攻1手目
                case 1:

                    // 先攻が真ん中に置かなければ真ん中を選択する。それ以外のときは角を狙う。
                    if(cellStatus[4] == null) {
                        moving[mass_move] = 4;
                    } else {
                        switch(Math.floor(Math.random() * 4)) {
                            case 0:
                                moving[mass_move] = 0;
                                break;
                            case 1:
                                moving[mass_move] = 2;
                                break;
                            case 2:
                                moving[mass_move] = 6;
                                break;
                            case 3:
                                moving[mass_move] = 8;
                                break;
                        }
                    }
                    break;


                // 先攻2手目
                case 2:

                    // 真ん中に相手がいるかどうか。
                    if((cellStatus[4] != isMaru) && (cellStatus[4] != null)) {

                        // 対角線の角を狙う。
                        if(cellStatus[0] == isMaru) {
                            moving[mass_move] = 8;
                        } else if(cellStatus[2] == isMaru) {
                            moving[mass_move] = 6;
                        } else if(cellStatus[6] == isMaru) {
                            moving[mass_move] = 2;
                        } else if(cellStatus[8] == isMaru) {
                            moving[mass_move] = 0;
                        }
    
                    } else if(((cellStatus[0] != isMaru) && (cellStatus[0] != null)) || ((cellStatus[2] != isMaru) && (cellStatus[2] != null)) || ((cellStatus[6] != isMaru) && (cellStatus[6] != null)) || ((cellStatus[8] != isMaru) && (cellStatus[8] != null))) {
                            // 対角線に相手がいるため、残りの角でリーチをつくる。
                            do {
                                moving[mass_move] = Math.floor(Math.random() * 4) * 2;
                                if(moving[mass_move] == 4) {
                                    moving[mass_move] = 8;
                                }
                            } while (cellStatus[moving[mass_move]] != null);

                    } else {

                        // 相手の影響を受けない側でリーチをつくり、誘う。
                        if((cellStatus[0] == isMaru) || (cellStatus[8] == isMaru)) {
                            if((cellStatus[1] == null) && (cellStatus[5] == null)) {
                                moving[mass_move] = 2;
                            } else if((cellStatus[3] == null) && (cellStatus[7] == null)) {
                                moving[mass_move] = 6;
                            }
                        } else if((cellStatus[2] == isMaru) || (cellStatus[6] == isMaru)) {
                            if((cellStatus[1] == null) && (cellStatus[3] == null)) {
                                moving[mass_move] = 0;
                            } else if((cellStatus[5] == null) && (cellStatus[7] == null)) {
                                moving[mass_move] = 8;
                            }
                        }
                    }
                    break;


                // 後攻2手目
                case 3:
                    if((((cellStatus[0] != isMaru) && (cellStatus[0] != null)) && ((cellStatus[8] != isMaru) && (cellStatus[8] != null))) || (((cellStatus[2] != isMaru) && (cellStatus[2] != null)) && ((cellStatus[6] != isMaru) && (cellStatus[6] != null)))) {
                        // 角が対角で押さえられている場合は、角ではないセルを狙う。
                        switch(Math.floor(Math.random() * 4)) {
                            case 0:
                                moving[mass_move] = 1;
                                break;
                            case 1:
                                moving[mass_move] = 3;
                                break;
                            case 2:
                                moving[mass_move] = 5;
                                break;
                            case 3:
                                moving[mass_move] = 7;
                        }
                    } else if((((cellStatus[1] != isMaru) && (cellStatus[1] != null)) && ((cellStatus[7] != isMaru) && (cellStatus[7] != null))) || (((cellStatus[3] != isMaru) && (cellStatus[3] != null)) && ((cellStatus[5] != isMaru) && (cellStatus[5] != null)))) {
                        // 角ではないが、対面で押さえられている場合は、角を狙う。
                        switch(Math.floor(Math.random() * 4)) {
                            case 0:
                                moving[mass_move] = 0;
                                break;
                            case 1:
                                moving[mass_move] = 2;
                                break;
                            case 2:
                                moving[mass_move] = 6;
                                break;
                            case 3:
                                moving[mass_move] = 8;
                        }
                    // 次ターンでダブルリーチになる場所をつぶす。
                    } else if((((cellStatus[1] != isMaru) && (cellStatus[1] != null)) || ((cellStatus[2] != isMaru) && (cellStatus[2] != null))) && (((cellStatus[3] != isMaru) && (cellStatus[3] != null)) || ((cellStatus[6] != isMaru) && (cellStatus[6] != null)))) {
                            moving[mass_move] = 0;
                    } else if((((cellStatus[0] != isMaru) && (cellStatus[0] != null)) || ((cellStatus[1] != isMaru) && (cellStatus[1] != null))) && (((cellStatus[5] != isMaru) && (cellStatus[5] != null)) || ((cellStatus[8] != isMaru) && (cellStatus[8] != null)))) {
                        moving[mass_move] = 2;
                    } else if((((cellStatus[0] != isMaru) && (cellStatus[0] != null)) || ((cellStatus[3] != isMaru) && (cellStatus[3] != null))) && (((cellStatus[7] != isMaru) && (cellStatus[7] != null)) || ((cellStatus[8] != isMaru) && (cellStatus[8] != null)))) {
                        moving[mass_move] = 6;
                    } else if((((cellStatus[2] != isMaru) && (cellStatus[2] != null)) || ((cellStatus[5] != isMaru) && (cellStatus[5] != null))) && (((cellStatus[6] != isMaru) && (cellStatus[6] != null)) || ((cellStatus[7] != isMaru) && (cellStatus[7] != null)))) {
                        moving[mass_move] = 8;
                    // 特に進展がない状況では、自分に有利なように角を狙う。
                    } else {
                        do {
                            switch(Math.floor(Math.random() * 4)) {
                                case 0:
                                    moving[mass_move] = 0;
                                    break;
                                case 1:
                                    moving[mass_move] = 2;
                                    break;
                                case 2:
                                    moving[mass_move] = 6;
                                    break;
                                case 3:
                                    moving[mass_move] = 8;
                                    break;
                            }
                        } while (cellStatus[moving[mass_move]] != null);
                    }
                    break;


                // 先攻3手目
                case 4:

                    // 隣接セルも空いている角を狙う。
                    if((cellStatus[0] == null) && (cellStatus[1] == null) && (cellStatus[3] == null)) {
                        moving[mass_move] = 0;
                    } else if((cellStatus[1] == null) && (cellStatus[2] == null) && (cellStatus[5] == null)) {
                        moving[mass_move] = 2;
                    } else if((cellStatus[3] == null) && (cellStatus[6] == null) && (cellStatus[7] == null)) {
                        moving[mass_move] = 6;
                    } else if((cellStatus[5] == null) && (cellStatus[7] == null) && (cellStatus[8] == null)) {
                        moving[mass_move] = 8;
                    }
                    break;


                // 後攻3手目
                case 5:
                    // 角を取る。
                    do {
                        switch(Math.floor(Math.random() * 4)) {
                            case 0:
                                moving[mass_move] = 0;
                                break;
                            case 1:
                                moving[mass_move] = 2;
                                break;
                            case 2:
                                moving[mass_move] = 6;
                                break;
                            case 3:
                                moving[mass_move] = 8;
                                break;
                        }
                    } while (cellStatus[moving[mass_move]] != null);
                    break;


                // 上記以外の場合はリーチにならない限り、適当に埋めていく
                default:
                    do {
                        moving[mass_move] = Math.floor(Math.random() * 9);
                    } while (cellStatus[moving[mass_move]] != null);
            }
        }
    }

    // 選択したセルに記入などの処理
    write_kigou(moving[mass_move]);
}





// 選択されたセルに記入
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

    // ○か×かを記入する
    if(isMaru) {
        document.getElementById(x + "-" + y).innerHTML = "〇";
        document.getElementById(x + "-" + y).style.color = "#ff0000";
    } else {
        document.getElementById(x + "-" + y).innerHTML = "×";
        document.getElementById(x + "-" + y).style.color = "#0000ff";
    }

    // 最後に選択されたセルを黄色にする
    document.getElementById(x + "-" + y).style.backgroundColor = "#ffff00";

    // 記入されたセルにhoverした際のカーソルを「操作できない領域用」にする
    document.getElementById(x + "-" + y).style.cursor = 'not-allowed';

    // 終了条件チェック
    checkGameOver();
}

