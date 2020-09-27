let weekday = 5;
let week = 7;
let shift = [];
let members = [];
let weekShiftsTotal = 0;
let moreWorkers = [];
let lessWorkers = [];
let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "김정원"];
let onePointMembers = [];
let twoPointMembers = [];
let threePointMembers = [];
let fourPointMembers = [];
let fivePointMembers = [];

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

function loadMembers() // 나중에 엑셀
{
    for(let i = 0; i < person.length; i++)
    {
        members[i] = new work(person[i], 0, 0, 0);
    }
}

loadMembers();

//*** 근무 및 인원 초기화 끝

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
                    /* /// 이 상황이 나올 수 있나?
                    else
                    {

                    }
                    */
                }
            }
        }
    }
}

function pick()
{
    let shiftCount = 0;
    let onePointNum = 0;
    let twoPointNum = 0;
    let threePointNum = 0;
    let fourPointNum = 0;
    let fivePointNum = 0;
    let needScore;

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

            if(shiftCount === members.length - 1) // 모두가 근무를 한번씩 한 순간
            {
                classifyByMoreOrLess(onePointNum, twoPointNum, threePointNum, fourPointNum, fivePointNum);
            }
            else if(shiftCount < members.length - 1)
            {
                randomPerson = Math.floor(Math.random() * members.length - 1) + 1;
                members[randomPerson].score += score;
                members[randomPerson].day = day;
                members[randomPerson].count++;
                switch(point) // How many point
                {
                    case 1:
                        onePointNum++;
                        onePointMembers.push(members[randomPerson]);
                        break;
                    case 2:
                        twoPointNum++
                        twoPointMembers.push(members[randomPerson]);
                        break;
                    case 3:
                        threePointNum++
                        threePointMembers.push(members[randomPerson]);
                        break;
                    case 4:
                        fourPointNum++
                        fourPointMembers.push(members[randomPerson]);
                        break;
                    case 5:
                        fivePointNum++
                        fivePointMembers.push(members[randomPerson]);
                        break;
                    default :
                        console.log("Unknown type");
                        break;
                }
            }
            else /// 모두 한번씩 하고 난 후
            {
                randomPerson = Math.floor(Math.random() * members.length - 1) + 1;
                members[randomPerson].score += score;
                members[randomPerson].day = day;
                members[randomPerson].count++;
            }
            shiftCount++;
        }
        console.log(`${yoill[i]} : ${todayShift}`);
    }
}

///// 여러값을 리턴 받을때
/*
var newCodes = function() {
    var dCodes = fg.codecsCodes.rs;
    var dCodes2 = fg.codecsCodes2.rs;
    return [dCodes, dCodes2];
};

let codes = newCodes();
let dCodes = codes[0];
let dCodes2 = codes[1];
*/


console.log(moreWorkNum);
console.log(weekShiftsTotal);
//*** 근무 및 인원 초기화 끝