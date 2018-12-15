var mode = true;
var isMaru = true;
var cellStatus = [
    null, null, null,
    null, null, null,
    null, null, null
];


function game() {

    var table = document.querySelector("table");
    
    for(var i = 0; i < 3; i++) {
        var tr = document.createElement("tr");

        for(var j = 0; j < 3; j++) {
            var td = document.createElement("td");
            td.setAttribute("id", "" + i + "-" + j);
            td.setAttribute("onclick", "clickTd(this);");
            tr.append(td);
        }
        table.append(tr);
    }
}




function clickTd(target) {
    if(mode == true) {
        var [sx, sy] = target.id.split("-");
        var x = Number(sx);
        var y = Number(sy);

        cellStatus[y * 3 + x] = isMaru;
        
        if(target.innerHTML == '') {
            if(isMaru == true) {
                target.innerHTML = '○';
                isMaru = false;
            } else {
                target.innerHTML = '×';
                isMaru = true;
            }
        }
        document.getElementById(target.id).style.cursor = 'not-allowed';

        checkGameOver();
    }
}





function checkGameOver() {
    var finishPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ]

    for(var i = 0; i < finishPatterns.length; i++) {
        var cell1 = cellStatus[finishPatterns[i][0]];
        var cell2 = cellStatus[finishPatterns[i][1]];
        var cell3 = cellStatus[finishPatterns[i][2]];

        if(cell1 != null && cell2 != null && cell3 != null && cell1 == cell2 && cell2 == cell3){
            mode = false;
        }
    }

    if(mode == false) {
        if (isMaru == true) {
            document.getElementById("result").innerText = "×の勝ちです。F5キーを押してもう一度！";
        } else {
            document.getElementById("result").innerText = "○の勝ちです。F5キーを押してもう一度！";
        }

        for(var i = 0; i < 3; i++) {
            for(var j = 0; j < 3; j++) {
                document.getElementById(i + "-" + j).style.cursor = 'not-allowed';
            }
        }
    } else {
        if (isMaru == true) {
            document.getElementById("result").innerText = "○の番です。";
        } else {
            document.getElementById("result").innerText = "×の番です。";
        }
    }
}