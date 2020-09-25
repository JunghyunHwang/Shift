// Pick members

let weekday = 5;
let week = 7;
let shiftCount = 0;
let shift = [];
let members = []; // 나중에 엑셀 연결 해서 가져옴
let zeroPointMembers = [];
let onePointMembers = [];
let fivePointMembers = [];
let sixPointMembers = [];
let hardWorkMembers = [];
let doNotWorkMemebers = [];
let shiftsTotal = 0;
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
    shiftsTotal = numberNightShift + numberCctvShift
    shiftsTotal = (i < weekday) ? shiftsTotal : shiftsTotal + 2; // 주말 위병소 근무 때문에
    shift[i] = new Array(shiftsTotal);
    
    for(let j = 0; j < shiftsTotal; j++)
    {
        if(j == 7) // shift[i][7]는 18~20이고, 매일 5점 짜리 근무임
        {
            shift[i][j] = new work(shiftName[j], 5, 1, i);
        }
        else
        {
            shift[i][j] = new work(shiftName[j], 1, 1, i); // 모든 근무 점수,카운트 1로 초기화
        }
    }

    for(let k = 10; k < shiftsTotal; k++) // 불침번 점수 설정 set nightshift score
    {
        shift[i][k].score = (i == 4 || i == 5) ? 1 : 5; // 금,토 불침번은 1점 으로 설정 fri, sat nightshift score is 1
    }

    if(i >= weekday) // 주말 cctv 점수 설정 set weekend cctv score
    {
        for(let l = 2; l < 7; l++)
        {
            shift[i][l].score = 5;
        }
        
    }

    shift[i][0].score = (i < weekday) ? 5 : 1; // cctv 초번 점수 설정
    shift[i][9].score = (i < weekday - 1) ? 5 : 1; // cctv 말번 월~목 까지 5점으로 설정
}
shift[6][9].score = 5; // 일요일 cctv 말번
shift[5][14].score = 5; // saturday guardhouse
shift[5][15].score = 5; // saturday guardhouse

//*** 근무 및 인원 초기화 끝

function loadMembers()
{
    for(let i = 0; i < person.length; i++)
    {
        members[i] = new work(person[i], 0, 0, 0);
        zeroPointMembers[i] = members[i];
    }
}

function checkMembersDay(here, day)
{
    let count = 0;
    for(let i = 0; i < here.length; i++)
    {
        if(day - here[i].day > 1)
        {
            count++;
        }
    }
    return count;
}

function calculate(here, next, score, day)
{
    let pass = 0; // Fix true or false
    let randomPerson = 0;
    let len = here.length;
    if(day === 0)
    {
        len -= 16; // 저번주 일요일에 근무 한 사람 뺌
    }
    
    while(pass < 1)
    {
        randomPerson = Math.floor(Math.random() * len - 1) + 1; // Pick random number
        let dayDistance = day - here[randomPerson].day
        if(dayDistance < 2 && day >= 2)
        {
            len = checkMembersDay(here, day);
            pass = 0;
        }
        else
        {
            pass = 1;
        }
    }

    let today = here[randomPerson].name;
    shiftCount++; ////
    here[randomPerson].score += score;
    here[randomPerson].day = day;
    here[randomPerson].count++;
    next.push(here[randomPerson]);
    here.splice(randomPerson, 1);
    return today;
}

loadMembers();

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4;
    let numberCctvShift = 10;
    let todayShift = [];
    let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
    shiftsTotal = numberNightShift + numberCctvShift;
    shiftsTotal = (i < weekday) ? shiftsTotal : shiftsTotal + 2;
    
    for(let j = 0; j < shiftsTotal; j++)
    {
        let point = shift[i][j].score;

        switch(point)
        {
            case 1:
                if(zeroPointMembers.length)
                {
                    todayShift[j] = calculate(zeroPointMembers, onePointMembers, point, i);
                }
                else if(!fivePointMembers.length)
                {
                    if(!sixPointMembers.length)
                    {
                        todayShift[j] = calculate(hardWorkMembers, doNotWorkMemebers, point, i);
                    }
                    else
                    {
                        todayShift[j] = calculate(sixPointMembers, hardWorkMembers, point, i);
                    }
                }
                else // fivePointMembers
                {
                    todayShift[j] = calculate(fivePointMembers, sixPointMembers, point, i);
                }
                break;
            case 5:
                if(zeroPointMembers.length)
                {
                    todayShift[j] = calculate(zeroPointMembers, fivePointMembers, point, i);
                }
                else if(!onePointMembers.length)
                {
                    if(!sixPointMembers.length)
                    {
                        todayShift[j] = calculate(hardWorkMembers, doNotWorkMemebers, point, i);
                    }
                    else
                    {
                        todayShift[j] = calculate(sixPointMembers, doNotWorkMemebers, point, i);
                    }
                }
                else // onePointMembers
                {
                    todayShift[j] = calculate(onePointMembers, sixPointMembers, point, i);
                }
                break;
            default :
                console.log("Unknown type");
                break;
        }
    }
    console.log(`${yoill[i]} : ${todayShift}`);
}
console.log(shiftCount);