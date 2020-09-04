let weekday = 5;
let weekend = 2;
let week = 7;

let nightShift = [];

function nightShiftScoreInitialization(day, score)
{
    for(let i = 0; i < day; i++)
    {
        nightShift[i] = {
            first : 
            {
                score : score,
                count : 1
            },
            second : 
            {
                score : score,
                count : 1
            },
            third : 
            {
                score : score,
                count : 1
            },
            fourth : 
            {
                score : score,
                count : 1
            }
        }
    }
}

nightShiftScoreInitialization(weekday, 5);
nightShiftScoreInitialization(weekend, 0);

for(let i = 0; i < weekday; i++)
{
    createShift();
}

function createShift() // 이름 봐꺼
{
    // 2. 인원 데이터 가져와
    for(let i = 0; i < shiftCount; i++)
    {

    }
}

// 1. 근무 짜자
// 2. 그날 인원 데이터 가져와
// 3. 점수 별로 배열에 담아