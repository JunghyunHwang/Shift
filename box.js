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

let weekday = 5;
let week = 7;
let shift = [];
let members = [];
let weekShiftsTotal = 0;
let moreWorkers = [];
let lessWorkers = [];
let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "김정원"];

function work(name, score, cnt, day)
{
    this.name = name
    this.score = score;
    this.count = cnt;
    this.day = day;
}

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4; // 불침번 근무 개수
    let numberCctvShift = 10; // cctv 근무 개수
    let shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"];
    let weekdayShiftScore = [4, 3, 2, 1, 2, 1, 1, 5, 3, 2, 2, 3, 5, 3];
    let friShiftScore = [4, 3, 2, 1, 2, 1, 1, 5, 3, 1, 1, 1, 3, 2];
    let satShiftScore = [3, 3, 3, 3, 4, 4, 4, 5, 3, 1, 1, 1, 3, 2, 5];
    let sunShiftScore = [3, 3, 3, 3, 3, 3, 2, 4, 2, 2, 2, 3, 4, 3, 5];
    let dayShiftsTotal = numberNightShift + numberCctvShift
    dayShiftsTotal = (i < weekday) ? dayShiftsTotal : dayShiftsTotal + 2; // 주말 위병소 근무 때문에
    weekShiftsTotal += dayShiftsTotal;
    shift[i] = new Array(dayShiftsTotal);

    if(i < weekday - 1) // Monday ~ Thursday
    {
        for(let j = 0; j < dayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], weekdayShiftScore[j], 1, i);
        }
    }
    else if(i === weekday - 1) // Friday
    {
        for(let j = 0; j < dayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], friShiftScore[j], 1, i);
        }
    }
    else if(i === weekday) // Satday
    {
        for(let j = 0; j < dayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], satShiftScore[j], 1, i);
        }
    }
    else // Sunday
    {
        for(let j = 0; j < dayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], sunShiftScore[j], 1, i);
        }
    }
}

function loadMembers()
{
    for(let i = 0; i < person.length; i++)
    {
        members[i] = new work(person[i], 0, 0, 0);
    }
}

loadMembers();

//*** 근무 및 인원 초기화 끝

function getInformation()
{
    let onePointCnt
    let twoPointCnt
    let threePointCnt
    let fourPointCnt
    for(let i = 0; i < week; i++)
    {
        let numberNightShift = 4;
        let numberCctvShift = 10;
        let dayShiftsTotal = numberNightShift + numberCctvShift
        dayShiftsTotal = (i < weekday) ? dayShiftsTotal : dayShiftsTotal + 2;
        for(let j = 0; j < dayShiftsTotal; i++)
        {
            if()
        }
    }
}
/*
function sortMoreLess()
{
    let moreWorkerNum = weekShiftsTotal % members.length;
    let lessWorkNum = members.length - moreWorkerNum;
    let onePointMembersNum = 0;

    for(let i = 0; i < members.length; i++)
    {
        if(members[i].score === 1) // 1점인 사람은 3번씩 해야함
        {
            if(moreWorkerNum >= onePointMembersNum)
            {
                moreWorkers.push(members[i]);
            }
            onePointMembersNum++;
        }
    }
    
    if(moreWorkerNum > moreWorkers.length)
    {

    }

    for(let i = 0; i < members.length; i++)
    {

        if(moreWorkers.length === moreWorkerNum)
        if(members[i].score === 1)
        {
            moreWorkers.push(members[i]);
        }
    }
}
*/
function shiftDivision()
{
    let shiftCount = 0;
    for(let i = 0; i < week; i++)
    {
        let numberNightShift = 4;
        let numberCctvShift = 10;
        let todayShift = [];
        let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        let dayShiftsTotal = numberNightShift + numberCctvShift;
        dayShiftsTotal = (i < weekday) ? dayShiftsTotal : dayShiftsTotal + 2;
        
        for(let j = 0; j < dayShiftsTotal; j++)
        {
            let point = shift[i][j].score;
            let randomPerson = 0;
           
            if(shiftCount < members.length) // divide more woker & less worker
            {
                randomPerson = Math.floor(Math.random() * members.length - 1) + 1; //////// 각 점수별 개수
                members[randomPerson].score += score;
                members[randomPerson].day = day;
                members[randomPerson].count++;
                // next.push(members[randomPerson]);
                // members.splice(randomPerson, 1);
            }
            else
            {

            }
            shiftCount++;
        }
        console.log(`${yoill[i]} : ${todayShift}`);
    }
}

console.log(moreWorkNum);
console.log(weekShiftsTotal);
//*** 근무 및 인원 초기화 끝
