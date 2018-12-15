// ゲームの稼動非稼動
var mode = true;

// ターン（trueが○、falseが×）
var isMaru = true;

// セルのステータス
var cellStatus = [
    null, null, null,
    null, null, null,
    null, null, null
];





// ゲームテーブルの生成
function game() {

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





// セルがクリックされたときの動作
function clickTd(target) {

    // ゲームの稼動状態の確認
    if(mode == true) {

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
                target.innerHTML = '○';

                // ターン交替
                isMaru = false;

            } else {

                // セルに×を記載
                target.innerHTML = '×';

                // ターン交替
                isMaru = true;
            }

            // 記入されたセルにhoverした際のカーソルを「操作できない領域用」にする
            document.getElementById(target.id).style.cursor = 'not-allowed';

            // テーブルの状態把握とゲームの続行判定
            checkGameOver();
        }
    }
}





// テーブルの状態把握とゲームの続行判定
function checkGameOver() {

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

        // セルの状態を判定用の変数に代入
        var cell1 = cellStatus[finishPatterns[i][0]];
        var cell2 = cellStatus[finishPatterns[i][1]];
        var cell3 = cellStatus[finishPatterns[i][2]];


        // 終了条件と一致しているか確認
        if(cell1 != null && cell2 != null && cell3 != null && cell1 == cell2 && cell2 == cell3){
            
            //一致している場合はゲームを続行させない 
            mode = false;
        }
    }


    // ゲームが続行しているかどうか（false:終了、true:続行）
    if(mode == false) {


        // 勝利プレイヤの表示（true:×の勝ち、false:○の勝ち）
        if (isMaru == true) {
            document.getElementById("result").innerText = "×の勝ちです。F5キーを押してもう一度！";
        } else {
            document.getElementById("result").innerText = "○の勝ちです。F5キーを押してもう一度！";
        }


        // すべてのセルのhoverした際のカーソルを「操作できない領域用」にする
        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                document.getElementById(i + "-" + j).style.cursor = 'not-allowed';
            }
        }

    } else {

        // 次プレイヤの表示（true:○の番、false:×の番）
        if (isMaru == true) {
            document.getElementById("result").innerText = "○の番です。";
        } else {
            document.getElementById("result").innerText = "×の番です。";
        }
    }
}