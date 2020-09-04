let weekday = 5;
let weekend = 2;
let week = 7;
let numberNightShift = 4; // 불침번 근무 개수
let numberCctvShift = 10; // cctv 근무 개수
let maxScore = 7;
let maxCnt = 3;
let nightShift = new Array(week); // nightShift[7] day
let memberTotal = 12; // 나중에 엑셀 연결 해서 가져옴
let memberCnt = 0;
let member = new Array(memberTotal);

function Shift(score, cnt) // 파라미터 이름 추가
{
    this.score = score;
    this.count = cnt;
}

for(let i = 0; i < nightShift.length; i++)
{
    nightShift[i] = new Array(numberNightShift); // nightShift[7][4]
    let tempScore = 2; // 근무 별 점수가 3번째 근무 까지 순서대로 2,3,4 이기 때문에 변수 생성

    for(let j = 0; j < numberNightShift; j++) // 근무 별 점수와 횟수 초기화
    {
        nightShift[i][j] = new Shift(tempScore, 1);
        tempScore++; // 근무 별 점수가 3번째 근무 까지 순서대로 2,3,4 이기 때문에 이렇게 작성
    }
    nightShift[i][3].score = 3; // 불침번 마지막 근무만 점수 따로 수정
} 
// *** 불침번 근무 생성 및 근무 별 점수 초기화

for(let i = 0; i < memberTotal; i++)
{
    member[i] = i;
    member[i] = new Shift(0, 0);
    console.log(member[i].score);
}
// *** 멤버들의 점수와 근무 횟수 초기화

function pickNum(shiftNum)
{
    let randomPersonNum = [];
    for(let i = 0; i < shiftNum; i++)
    {
        randomPersonNum[i] = Math.floor(Math.random() * memberTotal - 1) + 1; // Pick random number
        for(let j = 0; j < i; j++)
        {
            if(randomPersonNum[i] == randomPersonNum[j]) // 중복 제거
            {
                i--;
                break;
            }
            if(checkMemberScore(randomPersonNum[i], i)) // 
            {
                i--;
                break;
            }
        }
    }
    return randomPersonNum;
}

function checkMemberScore(person, ShiftNum)
{
    let sumScore = member[person].score + nightShift[0][ShiftNum].score; // 들어 가야 될 자리의 점수와  랜덤으로 뽑힌 사람의 점수를 더했을때 maxScore 보다 크면 번호 다시 뽑아야함
    let sumCnt = member[person].count + 1; // 값이 maxCnt 보다 크면 번호 다시 뽑아야함
    if(sumScore > maxScore || sumCnt> maxCnt)
    {
        return true;
    }
    else
    {
        return false;
    }
}

for(let i = 0; i < weekday; i++)
{
    let selectedNum = pickNum(numberNightShift);
    for(let j = 0; j < numberNightShift; j++)
    {
        member[selectedNum[j]].score += nightShift[i][j].score;
        member[selectedNum[j]].count++;
    }
}

console.log(member);

let cctv = new Array();
for(let i = 4; i <= 22; i += 2) { // 10개의 cctv 근무 만들고 score를 1로 초기화
    cctv[i] = new Shift(1);
}

//cctv 근무 별 점수
cctv[4].score = 3;
cctv[6].score = 2;
cctv[14].score = 0.5;
cctv[18].score = 4;
cctv[20].score = 2;
cctv[22].score = 2;








// for(let i = 0; i < week; i++)
// {
//     let numberNightShift = 4; // 불침번 근무 개수
//     nightShift[i] = new Array(numberNightShift); // nightShift[7][4]
//     for(let j = 0; j < numberNightShift; j++)
//     {
//         if(i < weekday) // 평일 근무 점수
//         {
//             nightShift[i][j] = new work(5, 1);
//         }
//         else // 주말 근무 점수
//         {
//             nightShift[i][j] = new work(0, 1);
//         }
//     }
// }
// // *** 불침번 근무 생성 및 근무 별 점수 초기화

// for(let i = 0; i < week; i++)
// {
//     let numberCctvShift = 10; // cctv 근무 개수
//     cctvShift[i] = new Array(numberCctvShift);
//     for(let j = 0; j < numberCctvShift; j++)
//     {
//         cctvShift[i][j] = new work(0, 1);
//     }
// }
// // *** cctv 근무 생성 및 근무 별 점수 초기화