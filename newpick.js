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
let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "이정원"];
let shiftId = 0;

function work(id, number, name, score, day, who)
{
    this.id = id;
    this.number = number;
    this.name = name;
    this.score = score;
    this.day = day;
    this.who = who;
}

function info(id, name, score, cnt, day, sum)
{
    this.id = id;
    this.name = name
    this.score = score;
    this.count = cnt;
    this.worked = [];
    this.workId = [];
    this.day = day;
    this.sum = sum;
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
    shift[i] = new Array(aDayShiftsTotal);

    if(i < weekday - 1) // Monday ~ Thursday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], weekdayShiftScore[j], i, "");
            weekShiftsTotal++;
            shiftId++;
        }
    }
    else if(i === weekday - 1) // Friday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], friShiftScore[j], i, "");
            weekShiftsTotal++;
            shiftId++;
        }
    }
    else if(i === weekday) // Satday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], satShiftScore[j], i, "");
            weekShiftsTotal++;
            shiftId++;
        }
    }
    else // Sunday
    {
        for(let j = 0; j < aDayShiftsTotal; j++)
        {
            shift[i][j] = new work(shiftId, weekShiftsTotal, shiftName[j], sunShiftScore[j], i, "");
            weekShiftsTotal++;
            shiftId++;
        }
    }
}

function loadMembers(zeroPoint) // 나중에 엑셀
{
    let tempPerson = person;
    if(!members.length)
    {
        for(let i = 0; i < tempPerson.length; i++)
        {
            members[i] = new info(i, tempPerson[i], 0, 0, 0, 0);
            zeroPoint[i] = members[i];    
        }
    }
    else if(members.length < tempPerson.length) // 추가 되었을때 (휴가복귀)
    {
        for(let i = 0; i < tempPerson.length; i++)
        {
            for(let j = 0; j < members.length; j++)
            {
                if(tempPerson[i] === members[i].name)
                {
                    tempPerson.splice(i, 1);
                    break;
                }
            }
        }

        for(let i = 0; i < tempPerson.length; i++)
        {
            tempPerson[i] = new info(members.length, tempPerson[i], 0, 0, 0, 0);
            members.push(tempPerson[i]);
            zeroPoint.push(tempPerson[i]);
        }
    }
    else if(members.length > person.length) // 휴가 나감
    {

    }
    else
    {
        return;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////*** 근무 및 인원 초기화 끝

function controlInfo(selected, shift)
{
    let workedCnt = selected.worked.length;
    let workIdCnt = selected.workId.length;

    selected.score = shift.score;
    selected.day = shift.day;
    selected.count++;
    selected.worked[workedCnt] = shift.name;
    selected.workId[workIdCnt] = shift.id;
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
        else if(members[i].count === 0)
        {
            possible.push(members[i]);
        }
        else if(day - members[i].day < 2) // 근무 후 적어도 하루는 쉰다는 규칙이 있을때만 적용, 후에 2을 변수로 변경, 인원들이 전부 한번씩 해도 이틀치 근무를 못 채우면 문제 발생
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

function checkLessWorkers(selected)
{
    let leastCnt = 3;
    let less = [];
    for(let i = 0; i < selected.length; i++) // 가장 적게 한 횟수 구함
    {
        if(selected[i].count < leastCnt)
        {
            leastCnt = selected[i].count;
            if(leastCnt === 1) // 0은 여기 올 수 없음 그러니 가장 작은 1이 나오면 더 볼 것도 없음
            {
                break;
            }
        }
    }

    for(let i = 0; i < selected.length; i++) // 가장 적게 한 횟수와 같은 인원들 구함
    {
        if(leastCnt === selected[i].count)
        {
            less.push(selected[i]);
        }
    }
    return less;
}

function pickAndControlInfo(selected, shift)
{
    let randomPerson = 0;
    let pass = false;
    let samePoint = [];
    let repeatCnt = 0;
    let oneCntMember = [];

    if(shift.score === 2)
    {
        randomPerson = Math.floor(Math.random() * selected.length - 1) + 1;
    }
    else
    {
        if(shift.day === 6) // 주에 한번 하는 넘들 잡는 코드, 이거 6일 차에 한번만 하게 수정
        {
            for(let i = 0; i < members.length; i++)
            {
                if(members[i].count === 1)
                {
                    oneCntMember.push(members[i]);
                }
            }
            if(oneCntMember.length)
            {
                selected = null;
                selected = oneCntMember;
            }
        }
        while(!pass)
        {
            randomPerson = Math.floor(Math.random() * selected.length - 1) + 1;
    
            if(selected[randomPerson].score === shift.score)
            {
                samePoint.push(randomPerson);
                repeatCnt++;
                pass = false;
                if(repeatCnt === selected.length) // 모든 사람의 점수가 같은 경우 가장 적게 일한 사람들 중에서 픽함
                {
                    let lessWorkers = [];
                    
                    // selected = checkLessWorkers(selected); 가능한지?
                    lessWorkers = checkLessWorkers(selected);
                    selected = null;
                    selected = lessWorkers;
                    randomPerson = Math.floor(Math.random() * selected.length - 1) + 1;
                    pass = true;
                }
            }
            else
            {
                pass = true;
            }
        }
    }

    let todaySlave = selected[randomPerson].name;
    selected[randomPerson].sum += shift.score;
    controlInfo(selected[randomPerson], shift);
    selected.splice(randomPerson, 1);

    return todaySlave;
}

function pick() // Change name
{
    let zeroPointMembers = [];
    loadMembers(zeroPointMembers); // 나중에 휴가자들

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

        if(zeroPointMembers.length)
        {
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                if(!zeroPointMembers.length)
                {
                    possiblePeople = checkPossiblePeople(day);
                    for(let k = j; k < aDayShiftsTotal; k++)
                    {
                        todayWorker[k] = pickAndControlInfo(possiblePeople, shift[i][k]);
                        shift[i][k].who = todayWorker[j];
                    }
                    break;
                }
                else
                {
                    todayWorker[j] = pickAndControlInfo(zeroPointMembers, shift[i][j]);
                    shift[i][j].who = todayWorker[j];
                }
            }
        }
        else
        {
            possiblePeople = checkPossiblePeople(day);
            for(let j = 0; j < aDayShiftsTotal; j++)
            {
                todayWorker[j] = pickAndControlInfo(possiblePeople, shift[i][j]);
                shift[i][j].who = todayWorker[j];
            }
        }
        console.log(`${yoill[i]} : ${todayWorker}`);
    }
}
pick();

function checkFair()
{
    let variance = [];
    let deviation = 0;
    let squared = 0;
    let totalScore = 0;
    let avg = 0;
    let hardWorkers = [];
    let easyWokers = [];

    for(let i = 0; i < members.length; i++)
    {
        totalScore += members[i].sum;

        if(members[i].sum > 7)
        {
            hardWorkers.push(members[i]);
        }
        else if(members[i].sum < 4)
        {
            easyWokers.push(members[i]);
        }
    }

    avg = totalScore / members.length;
    avg = avg.toFixed(1);
    avg *= 1;
    
    for(let i = 0; i < members.length; i++)
    {
        squared = (members[i].sum - avg)
        squared *= squared;
        deviation += squared;
    }

    variance = deviation / members.length;
    console.log("-------------------------------------------");
    console.log(`분산 값 : ${variance}`);
    console.log("-------------------------------------------");
    console.log(`Hard worker 총 인원 : ${hardWorkers.length}`);

    for(let i = 0; i < hardWorkers.length; i++)
    {
        console.log(`name: ${hardWorkers[i].name}, count ${hardWorkers[i].count}, sum : ${hardWorkers[i].sum}`);
    }

    console.log("-------------------------------------------");
    console.log(`easy worker 총 인원 : ${easyWokers.length}`);

    for(let i = 0; i < easyWokers.length; i++)
    {
        console.log(`name: ${easyWokers[i].name}, count: ${easyWokers[i].count}, sum : ${easyWokers[i].sum}`);
    }

    console.log("-------------------------------------------");
}
checkFair();
// console.log(members);