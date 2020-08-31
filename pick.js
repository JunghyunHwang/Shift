// const maxCnt = 3;
// const minCnt = 1;
// let maxScore = 8; 
let member = new Array();

for(let i = 0; i < 46; i++) {
    member[i] = i + 1;
}
let memberTotal = member.length;

function Shift(score) {
    this.score = score;
    this.count = 1;
}

let cctv = new Array();
for(let i = 4; i <= 22; i += 2) { // 10개의 cctv 근무 만들고 score를 1로 초기화
    cctv[i] = new Shift(1);
}

let nightShift = new Array();
for(let i = 1; i <= 4; i++) { // 4개의 불침번 근무 만들고 score를 1로 초기화
    nightShift[i] = new Shift(1);
}

//cctv 근무 별 점수
cctv[4].score = 3;
cctv[6].score = 2;
cctv[14].score = 0.5;
cctv[18].score = 4;
cctv[20].score = 2;
cctv[22].score = 2;

//불침번 근무 별 점수
nightShift[1].score = 2;
nightShift[2].score = 3;
nightShift[3].score = 4;
nightShift[4].score = 3;

function pickShift(){
    // let memberNum = 0;
    let day = 8;
    for(let i = 0; i < day; i++) {
        for(let j = 0; j < cctv[i].length; j++) {
            
        }
    }
}