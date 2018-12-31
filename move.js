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
    let　str = "";
    const turn = document.form1.turn;

    for (let i = 0; i < turn.length; i++) {
        if(turn[i].checked) {
            str = turn[i].value;

            if(str == "maru") {
                isMaru = true;
            } else {
                isMaru = false;
            }

            if(count == 0) {
                first();
            }
            count++;
        
            reset();

            break;
        }
    }


    
}






function first() {
    document.getElementById("gamemonitor").innerHTML = "<table></table>";


    // テーブルの読み込み
    var table = document.querySelector("table");


    for(var i = 0; i < 3; i++) {

        // 行方向の生成（はじめ）
        var tr = document.createElement("tr");


        for(var j = 0; j < 3; j++) {

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
        }
    }

    if(isMaru) {
        document.getElementById("result").innerText = "○の番です。";
    } else {
        document.getElementById("result").innerText = "×の番です。";
    }
    mode = true;
}





// ゲームテーブルの生成






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

            // セルのステータスを更新
            cellStatus[y * 3 + x] = isMaru;

            // プレイヤの確認（true:○、false:×）
            if(isMaru == true) {

                // セルに○を記載
                target.innerHTML = '〇';
                target.style.color = '#ff0000';

                // ターン交替
                isMaru = false;

            } else {

                // セルに×を記載
                target.innerHTML = '×';
                target.style.color = '#0000ff';

                // ターン交替
                isMaru = true;
            }

            target.style.backgroundColor = "#ffffff";

            // 記入されたセルにhoverした際のカーソルを「操作できない領域用」にする
            document.getElementById(target.id).style.cursor = 'not-allowed';

            // テーブルの状態把握とゲームの続行判定
            checkGameOver();
        }
    }
}





// テーブルの状態把握とゲームの続行判定
function checkGameOver() {

    //空きセルの確認
    var count;


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

            for(j = 0; j < cell.length; j++) {
                
                
                if(isMaru) {
                    bcolor = '#0000ff'
                } else {
                    bcolor = '#ff0000';
                }
                
                x = Math.floor(finishPatterns[i][j] / 3);
                y = finishPatterns[i][j] % 3;
                document.getElementById(y + "-" + x).style.color = '#ffffff'
                document.getElementById(y + "-" + x).style.backgroundColor = bcolor;
            }
        } else if(((cell[0] != null) && (cell[1] != null) && (cell[2] == null) && (cell[0] == cell[1])) || ((cell[0] != null) && (cell[1] == null) && (cell[2] != null) && (cell[0] == cell[2])) || ((cell[0] == null) && (cell[1] != null) && (cell[2] != null) && (cell[1] == cell[2]))) {
            
            if(isMaru) {
                reach += 10;
            } else {
                reach += 1;
            }
            
            if(cell[1] == cell[2]) {
                j = 0;    
            } else if(cell[0] == cell[2]) {
                j = 1;
            } else if(cell[0] == cell[1]){
                j = 2;
            }

            x = Math.floor(finishPatterns[i][j] / 3);
            y = finishPatterns[i][j] % 3;
            document.getElementById(y + "-" + x).style.backgroundColor = "#a0ffa0";
        }
    }





    // ゲームが続行しているかどうか（false:終了、true:続行）
    if(!mode) {
        if (isMaru == true) {
            document.getElementById("result").innerText = "×の勝ちです。もう一度する場合は「ゲームスタート」をクリック！";
        } else {
            document.getElementById("result").innerText = "○の勝ちです。もう一度する場合は「ゲームスタート」をクリック！";
        }

        // すべてのセルのhoverした際のカーソルを「操作できない領域用」にする
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                document.getElementById(i + "-" + j).style.cursor = 'not-allowed';
            }
        }

    } else {
        
        //埋まっているマスのカウント
        for(count = 0; count < 9; count++) {
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
            if (isMaru == true) {
                document.getElementById("result").innerText = "○の番です。";
            } else {
                document.getElementById("result").innerText = "×の番です。";
            }
            
        }
    }
}





