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
let totalScore = 0;
let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "김정원"];
let zeroPointMembers = [];
let onePointMembers = [];
let twoPointMembers = [];
let threePointMembers = [];

function work(name, score, cnt, day)
{
    this.name = name
    this.score = score;
    this.count = cnt;
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
            shift[i][j] = new work(shiftName[j], weekdayShiftScore[j], 1, i);
            totalScore += weekdayShiftScore[j];
        }
    }
    else if(i === weekday - 1) // Friday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], friShiftScore[j], 1, i);
            totalScore += friShiftScore[j];
        }
    }
    else if(i === weekday) // Satday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], satShiftScore[j], 1, i);
            totalScore += satShiftScore[j];
        }
    }
    else // Sunday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftName[j], sunShiftScore[j], 1, i);
            totalScore += sunShiftScore[j];
        }
    }
}

function loadMembers(zero) // 나중에 엑셀
{
    for(let i = 0; i < person.length; i++)
    {
        members[i] = new info(i, person[i], 0, 0, 0);
        zero[i] = members[i];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////*** 근무 및 인원 초기화 끝

function controlInfo(selected, point, day)
{
    selected.score = point;
    selected.day = day;
    selected.count++;
}

function checkPossiblePeople(one, two, three, point)
{
    let possible = [];
    switch(point)
    {
        case 1:
            one.
    }
    return possible;
}

function pickAndControlInfo(possible, point, day)
{
    let randomPerson = 0;

    randomPerson = Math.floor(Math.random() * possible.length - 1) + 1;
    controlInfo(possible[randomPerson], point, day);
    let todaySlave = possible[randomPerson].name;

    return todaySlave;
}

function pick()
{
    loadMembers(zeroPointMembers); // 나중에 휴가자들

    for(let i = 0; i < week; i++)
    {
        let numberNightShift = 4; // Sever data
        let numberCctvShift = 10; // Sever data
        let todayWorker = [];
        let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        let aDayShiftsTotal = numberNightShift + numberCctvShift;
        aDayShiftsTotal = (i < weekday) ? aDayShiftsTotal : aDayShiftsTotal + 2;
        
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            let point = shift[i][j].score;
            let day = i;
            let possiblePeople = [];

            if(zeroPointMembers.length)
            {
                switch(point)
                {
                    case 1:
                        todayWorker[j] = pickAndControlInfo(zeroPointMembers, onePointMembers, point, day);
                        break;
                    case 2:
                        todayWorker[j] = pickAndControlInfo(zeroPointMembers, twoPointMembers, point, day);
                        break;
                    case 3:
                        todayWorker[j] = pickAndControlInfo(zeroPointMembers, threePointMembers, point, day);
                        break;
                    default:
                        alert("Unknown type");
                        break;
                }
            }
            else
            {
                switch(point)
                {
                    case 1:
                        possiblePeople = checkPossiblePeople(onePointMembers, twoPointMembers, threePointMembers);
                        todayWorker[j] = pickAndControlInfo(possiblePeople, onePointMembers, point, day);
                        break;
                    case 2:
                        todayWorker[j] = pickAndControlInfo(possiblePeople, twoPointMembers, point, day);
                        break;
                    case 3:
                        todayWorker[j] = pickAndControlInfo(possiblePeople, threePointMembers, point, day);
                        break;
                    default:
                        alert("Unknown type");
                        break;
                }
            }
        }
        console.log(`${yoill[i]} : ${todayWorker}`);
    }
}
pick();
