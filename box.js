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

function pickNum (availableNum, maxNum)
{
    let randomNum = new Array(availableNum);
    for(let i = 0; i < availableNum; i++)
    {
        randomNum[i] = Math.floor(Math.random() * maxNum - 1) + 1; // Pick random number
        for(let j = 0; j < i; j++)
        {
            if(randomNum[i] == randomNum[j]) // 중복 제거
            {
                i--;
                break;
            }
        }
    }
    
    return randomNum;
}

//////////////////////////////////////////

if(!fivePointMembers.length)
{
    point = 5;
}
else if(!onePointMembers.length)
{
    point = 1;
}

//////////////////////////////////////////

if(!fivePointMembers.length || !onePointMembers.length)
{
    keepShift[keepShiftCount] = i;
    keepShift[keepShiftCount][keepShiftCount] = j;
    keepShiftCount++;
    break;
}

if(zeroPointMembers.length) // 근무를 한번도 안 들어간 사람이 있을때
{
    selectedNum = pickNum(zeroPointMembers.length);
    zeroPointMembers[selectedNum].score += point;
    zeroPointMembers[selectedNum].count++;
    onePointMembers.push(zeroPointMembers[selectedNum]);
    zeroPointMembers.splice(selectedNum, 1);
}
else if(point != 1) // 5점 근무 일때
{
    if(!onePointMembers.length || !fivePointMembers) // 모든 인원이 두번씩 했을때
    {
        
    }
    else
    {
        selectedNum = pickNum(onePointMembers.length);
        onePointMembers[selectedNum].score += point;
        onePointMembers[selectedNum].count++;
        doNotWorkMemebers.push(onePointMembers[selectedNum]);
        onePointMembers.splice(selectedNum, 1);
    }
}
else if(point != 5) // 1점 근무 일때
{
    if(!fivePointMembers.length || !onePointMembers.length)
    {

    }
    else
    {
        selectedNum = pickNum(fivePointMembers.length);
        fivePointMembers[selectedNum].score += point;
        fivePointMembers[selectedNum].count++
        doNotWorkMemebers.push(fivePointMembers[selectedNum]);
        fivePointMembers.splice(selectedNum, 1);
    }
}
///////////////////////////////////////////////////////////////
else if(!fivePointMembers.length && !onePointMembers.length) // 모든 인원이 두번씩 했을때
{
    selectedNum = pickNum(sixPointMembers.length);
    sixPointMembers[selectedNum].score += point;
    sixPointMembers[selectedNum].count++;
    doNotWorkMemebers.push(sixPointMembers[selectedNum]);
    sixPointMembers.splice(selectedNum, 1);
}
//////////////////////////////////////////
else if(!onePointMembers.length && !fivePointMembers.length) // 모든 인원이 두번씩 했을때
{
    selectedNum = pickNum(sixPointMembers.length);
    sixPointMembers[selectedNum].score += point;
    sixPointMembers[selectedNum].count++;
    doNotWorkMemebers.push(sixPointMembers[selectedNum]);
    sixPointMembers.splice(selectedNum, 1);
}