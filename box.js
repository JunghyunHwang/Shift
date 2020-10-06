/*
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
}*/

////////////////////////////////////////////////////////////////////////////

// let btnSetShift = document.getElementById('setShift');
// btnSetShift.addEventListener('click', );

/*
function classifyByMoreOrLess(oneNum, twoNum, threeNum, fourNum, fiveNum)
{
    let moreWorkerNum = weekShiftsTotal % members.length; // 더 많이 근무 하는 사람의 수
    let lessWorkNum = members.length - moreWorkerNum; // 덜 근무 하는 사람의 수
    let remainingCnt = 0;

    if(oneNum >= moreWorkerNum)
    {
        for(let i = 0; i < moreWorkerNum; i++)
        {
            moreWorkers.push(onePointMembers[i]);
        }
    }
    else
    {
        for(let i = 0; i < oneNum; i++)
        {
            moreWorkers.push(onePointMembers[i]);
        }
        remainingCnt = moreWorkerNum - moreWorkers.length;

        if(twoNum >= remainingCnt)
        {
            for(let i = 0; i < remainingCnt; i++)
            {
                moreWorkers.push(twoPointMembers[i]);
            }
        }
        else
        {
            for(let i = 0; i < twoNum; i++)
            {
                moreWorkers.push(twoPointMembers[i]);
            }
            remainingCnt = moreWorkerNum - moreWorkers.length;
            
            if(threeNum >= remainingCnt)
            {
                for(let i = 0; i < remainingCnt; i++)
                {
                    moreWorkers.push(threePointMembers[i]);
                }
            }
            else
            {
                for(let i = 0; i < threeNum; i++)
                {
                    moreWorkers.push(threePointMembers[i]);
                }
                remainingCnt = moreWorkerNum - moreWorkers.length;

                if(fourNum >= remainingCnt)
                {
                    for(let i = 0; i < remainingCnt; i++)
                    {
                        moreWorkers.push(fourPointMembers[i]);
                    }
                }
                else
                {
                    for(let i = 0; i < fourNum; i++)
                    {
                        moreWorkers.push(fourPointMembers[i]);
                    }
                    remainingCnt = moreWorkerNum - moreWorkers.length;

                    if(fiveNum >= remainingCnt)
                    {
                        for(let i = 0; i < remainingCnt; i++)
                        {
                            moreWorkers.push(fivePointMembers[i]);
                        }
                    }
                    else
                    {
                        console.log("That is impossible");
                    }
                }
            }
        }
    }
}
*/
