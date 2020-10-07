/*
    근무 짜는 프로그램
*/

/* 
    1. case 2 일때 해결하고 나머지 검토 후 사이트 가서 확인
    2. 최소 하루 걸러 근무 들어가게
*/

let weekday = 5;
let week = 7;
let shift = [];
let members = [];
let weekShiftsTotal = 0;
// let totalScore = 0;
let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "김정원"];
let zeroPointMembers = [];

function work(id, name, score, day)
{
    this.id = id;
    this.name = name;
    this.score = score;
    this.day = day;
}

function info(id, name, score, cnt, day)
{
    this.id = id;
    this.name = name
    this.score = score;
    this.count = cnt;
    this.day = day;
}

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4; // 불침번 근무 개수
    let numberCctvShift = 10; // cctv 근무 개수
    let shiftId = 0;
    let shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"]; // Sever data
    let weekdayShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 2, 3, 2]; // Sever data
    let friShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 2]; // Sever data
    let satShiftScore = [2, 2, 2, 2, 2, 3, 3, 3, 3, 1, 1, 1, 2, 2, 3, 3]; // Sever data
    let sunShiftScore = [2, 2, 2, 3, 3, 3, 2, 3, 2, 2, 2, 2, 3, 2, 3, 3]; // Sever data
    let aDayShiftsTotal = numberNightShift + numberCctvShift
    aDayShiftsTotal = (i < weekday) ? aDayShiftsTotal : aDayShiftsTotal + 2; // 주말 위병소 근무 때문에
    weekShiftsTotal += aDayShiftsTotal;
    shift[i] = new Array(aDayShiftsTotal);

    if(i < weekday - 1) // Monday ~ Thursday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, shiftName[j], weekdayShiftScore[j], i);
            shiftId++;
        }
    }
    else if(i === weekday - 1) // Friday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, shiftName[j], friShiftScore[j], i);
            shiftId++;
        }
    }
    else if(i === weekday) // Satday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, shiftName[j], satShiftScore[j], i);
            shiftId++;
        }
    }
    else // Sunday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, shiftName[j], sunShiftScore[j], i);
            shiftId++;
        }
    }
}

function loadMembers() // 나중에 엑셀
{
    for(let i = 0; i < person.length; i++)
    {
        members[i] = new info(i, person[i], 0, 0, 0);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////*** 근무 및 인원 초기화 끝

function controlInfo(selected, point, day)
{
    selected.score = point;
    selected.day = day;
    selected.count++;
}

function checkPossiblePeople(day)
{
    let possible = [];
    let len = members.length;
    let maxCount = Math.ceil(weekShiftsTotal / len);

    for(let i = 0; i < len; i++)
    {
        if(members[i].count >= maxCount)
        {
            continue;
        }
        else if(day - members[i].day < 2 && day >= 2) // 근무 후 적어도 하루는 쉰다는 규칙이 있을때만 적용, 후에 2을 변수로 변경
        {
            continue;
        }
        else
        {
            possible.push(members[i]);
        }
    }
    
    return possible;
}

function pickAndControlInfo(selected, point, day)
{
    let randomPerson = 0;
    let pass = false;
    unsuitable = [];

    while(!pass)
    {
        randomPerson = Math.floor(Math.random() * selected.length - 1) + 1;

        for(let i = 0; i < unsuitable.length; i++)
        {
            if(randomPerson === unsuitable[i])
            {
                pass = false;
                break;
            }
        }

        if(selected[randomPerson].score === point)
        {
            unsuitable.push(randomPerson);
            pass = false;
        }
        else
        {
            pass = true;
        }
    }
    
    controlInfo(selected[randomPerson], point, day);
    let todaySlave = selected[randomPerson].name;
    selected.splice(randomPerson, 1);

    return todaySlave;
}

function pick()
{
    loadMembers(); // 나중에 휴가자들

    for(let i = 0; i < week; i++)
    {
        let numberNightShift = 4; // Sever data
        let numberCctvShift = 10; // Sever data
        let todayWorker = [];
        let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        let aDayShiftsTotal = numberNightShift + numberCctvShift;
        aDayShiftsTotal = (i < weekday) ? aDayShiftsTotal : aDayShiftsTotal + 2;
        let possiblePeople = [];
        let day = i;
        possiblePeople = checkPossiblePeople(day);
        
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            if(zeroPointMembers.length)
            {
                todayWorker[j] = pickAndControlInfo(zeroPointMembers, shift[i][j].score, day);
            }
            else
            {
                todayWorker[j] = pickAndControlInfo(possiblePeople, shift[i][j].score, day);
            }
        }
        console.log(`${yoill[i]} : ${todayWorker}`);
    }
}
pick();
