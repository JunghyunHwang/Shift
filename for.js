let weekday = 5;
let weekend = 2;
let week = 7;
let numberNightWork = 4; // 불침번 근무 개수
let numberCctvWork = 10; // cctv 근무 개수
let maxScore = 7;
let maxCnt = 3;
let night = new Array(week); // night[7] day
let memberTotal = 12; // 나중에 엑셀 연결 해서 가져옴
let memberCnt = 0;
let member = new Array(memberTotal);

function work(score, cnt)
{
    this.score = score;
    this.count = cnt;
}

for(let i = 0; i < night.length; i++)
{
    night[i] = new Array(numberNightWork); // night[7][4]
    let tempScore = 2; // 근무 별 점수가 3번째 근무 까지 순서대로 2,3,4 이기 때문에 변수 생성

    for(let j = 0; j < numberNightWork; j++) // 근무 별 점수와 횟수 초기화
    {
        night[i][j] = new work(tempScore, 1);
        tempScore++; // 근무 별 점수가 3번째 근무 까지 순서대로 2,3,4 이기 때문에 이렇게 작성
    }
    night[i][3].score = 3; // 불침번 마지막 근무만 점수 따로 수정
} 
// *** 불침번 근무 생성 및 근무 별 점수 초기화

for(let i = 0; i < memberTotal; i++)
{
    member[i] = i;
    member[i] = new work(0, 0);
}
// *** 멤버들의 점수와 근무 횟수 초기화

function pickNum(shiftNum)
{
    let randomNum = [];
    for(let i = 0; i < shiftNum; i++)
    {
        randomNum[i] = Math.floor(Math.random() * memberTotal - 1) + 1;
        for(let j = 0; j < i; j++) // 중복 제거 하는 코드
        {
            if(randomNum[i] == randomNum[j])
            {
                i--;
                break;
            }
            else if(filterNum(randomNum[i], i))
            {
                i--;
                break;
            }
        }
    }
    return randomNum;
}

function filterNum(location, Num)
{
    let sumScore = member[location].score + night[0][Num].score;
    if(sumScore > maxScore || member[location].count + 1 > maxCnt)
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
    let selectedNum = pickNum(numberNightWork);
    for(let j = 0; j < numberNightWork; j++)
    {
        member[selectedNum[j]].score += night[i][j].score;
        member[selectedNum[j]].count++;
    }
}

// for(let i = 0; i < weekday; i++)
// {
//     for(let j = 0; j < numberNightWork; j++)
//     {
//         pickNum()
        
//         // if(memberCnt == memberTotal){ // 모든 인원이 근무를 한번씩 들어 갔으면 다시 처음 부터
//         //     memberCnt = 0;
//         // }
//     }
// }

console.log(member);

// for(let i = 0; i < weekend; i++){
//     for(let j = 0; j < numberNightWork; j++){
        
//         // if(memberCnt == memberTotal){ // 모든 인원이 근무를 한번씩 들어 갔으면 다시 처음 부터
//         //     memberCnt = 0;
//         // }
//     }
// }

