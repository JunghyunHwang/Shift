// const maxCnt = 3;
// const minCnt = 1;
// let maxScore = 8; 
let member = new Array();
let memberTotal = member.length;

let cctvShift = new Array();
for(let i = 0; i < 10; i++) { // 10 개의 cctv 근무 만듬
    cctvShift[i] = new Object();
    cctvShift[i].score = 1;
    cctvShift[i].count = 1;
}

let nightShift = new Array();
for(let i = 0; i < 4; i++) { // 4개의 불침번 근무 만듬
    nightShift[i] = new Object();
    nightShift[i].score = 1;
    nightShift[i].count = 1;
}
