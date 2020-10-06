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

function checkMembersDay(from, day)
{
    let count = 0;
    for(let i = 0; i < from.length; i++)
    {
        if(day - from[i].day > 1)
        {
            count++;
        }
        else
        {
            break;
        }
    }
    return count;
}

function checkPossiblePeople(from, day, max)
{
    let possible = [];
    for(let i = 0; i < from.length; i++)
    {
        if(from[i].count >= max)
        {
            continue;
        }
        else if(day - from[i].day >= 2) // Day distance
        {
            possible.push(from[i]);
        }
    }
    return possible;
}

function pickAndClassify(from, to, point, day)
{
    let randomPerson = 0;
    let possiblePeople = [];
    let maxCount = Math.ceil(weekShiftsTotal / members.length);

    if(day > 1)
    {
        possiblePeople = checkPossiblePeople(from, day, maxCount);
    }
    else
    {
        possiblePeople = from;
    }

    randomPerson = Math.floor(Math.random() * possiblePeople.length - 1) + 1;
    let todaySlave = possiblePeople[randomPerson].name;
    controlInfo(possiblePeople[randomPerson], point, day);
    to.push(possiblePeople[randomPerson]);

    for(let i = 0; i < from.length; i++)
    {
        if(possiblePeople[randomPerson].id === from[i].id)
        {
            from.splice(i, 1);
            break;
        }
    }

    return todaySlave;
}

function pick()
{
    let zeroPointMembers = [];
    let onePointMembers = [];
    let twoPointMembers = [];
    let threePointMembers = [];

    loadMembers(zeroPointMembers);

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
            let randomNum = 0;
            let repOneDayDistance;
            let reptwoDayDistance;
            let repthreeDayDistance;

            if(!zeroPointMembers.length)
            {
                repOneDayDistance = day - onePointMembers[0].day;
                reptwoDayDistance = day - twoPointMembers[0].day;
                repthreeDayDistance = day - threePointMembers[0].day;
            }
            
            switch(point)
            {
                case 1:
                    if(zeroPointMembers.length)
                    {
                        todayWorker[j] = pickAndClassify(zeroPointMembers, onePointMembers, point, day);
                    }
                    else if(!twoPointMembers.length || !threePointMembers.length)
                    {
                        if(!twoPointMembers.length)
                        {
                            todayWorker[j] = pickAndClassify(threePointMembers, onePointMembers, point, day);
                        }
                        else if(!threePointMembers.length)
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, onePointMembers, point, day);
                        }
                        else // only remain onePointMembers // from과 to가 같음
                        {
                            randomNum = Math.floor(Math.random() * onePointMembers.length - 1) + 1;
                            onePointMembers[randomNum].score = point; // 이런 경우에는 카운트 가장 적은 사람이
                            onePointMembers[randomNum].day = day;
                            onePointMembers[randomNum].count++;
                            todayWorker[j] = onePointMembers[randomNum].name;
                        }
                    }
                    else if(reptwoDayDistance < 2 || repthreeDayDistance < 2)
                    {
                        if(reptwoDayDistance < 2)
                        {
                            todayWorker[j] = pickAndClassify(threePointMembers, onePointMembers, point, day);
                        }
                        else // 둘다 없는 경우가 있을까? 이거는 테스트 하면서 확인 해봐야함.
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, onePointMembers, point, day);
                        }
                    }
                    else
                    {
                        randomNum = Math.floor(Math.random() * 100 + 1);
                        if(randomNum % 2 === 0)
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, onePointMembers, point, day);
                        }
                        else
                        {
                            todayWorker[j] = pickAndClassify(threePointMembers, onePointMembers, point, day);
                        }
                    }
                    break;
                case 2:
                    if(zeroPointMembers.length)
                    {
                        todayWorker[j] = pickAndClassify(zeroPointMembers, twoPointMembers, point, day);
                    }
                    else if(!onePointMembers.length || !twoPointMembers.length || !threePointMembers.length)
                    {
                        if(!onePointMembers.length)
                        {
                            if(!twoPointMembers.length) // only remain three
                            {
                                todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                            }
                            else if(!threePointMembers.length) // only remain two, from과 to가 같음
                            {
                                todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                            }
                            else // remain two, three
                            {
                                randomNum = Math.floor(Math.random() * 100 + 1);
                                if(randomNum % 2 === 0) // from과 to가 같음
                                {
                                    todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                                }
                                else
                                {
                                    todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                                }
                            }
                        }
                        else if(!twoPointMembers.length)
                        {
                            if(!threePointMembers.length) // only remain one
                            {
                                todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                            }
                            else // remain one, three
                            {
                                randomNum = Math.floor(Math.random() * 100 + 1);
                                if(randomNum % 2 === 0) 
                                {
                                    todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                                }
                                else
                                {
                                    todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                                }
                            }
                        }
                        else
                        {
                            randomNum = Math.floor(Math.random() * 100 + 1);
                            if(randomNum % 2 === 0) 
                            {
                                todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                            }
                            else // from과 to가 같음
                            {
                                todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                            }
                        }
                    }
                    else if(repOneDayDistance < 2 || reptwoDayDistance < 2 || repthreeDayDistance < 2)
                    {
                        if(repOneDayDistance < 2)
                        {
                            if(reptwoDayDistance < 2) // only remain three
                            {
                                todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                            }
                            else if(repthreeDayDistance < 2) // only remain two // from과 to가 같음
                            {
                                todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                            }
                            else // remain two, three
                            {
                                randomNum = Math.floor(Math.random() * 100 + 1);
                                if(randomNum % 2 === 0) // from과 to가 같음
                                {
                                    todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                                }
                                else
                                {
                                    todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                                }
                            }
                        }
                        else if(reptwoDayDistance < 2)
                        {
                            if(repthreeDayDistance < 2) // only remain one
                            {
                                todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                            }
                            else //remain one, three
                            {
                                randomNum = Math.floor(Math.random() * 100 + 1);
                                if(randomNum % 2 === 0) 
                                {
                                    todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                                }
                                else
                                {
                                    todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                                }
                            }
                        }
                        else // remain one, two
                        {
                            randomNum = Math.floor(Math.random() * 100 + 1);
                            if(randomNum % 2 === 0)
                            {
                                todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                            }
                            else // from과 to가 같음
                            {
                                todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                            }
                        }
                    }
                    else
                    {
                        randomNum = Math.floor(Math.random() * 3 + 1);
                        if(randomNum === 1)
                        {
                            todayWorker[j] = pickAndClassify(onePointMembers, twoPointMembers, point, day);
                        }
                        else if(randomNum === 2)
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, twoPointMembers, point, day);
                        }
                        else
                        {
                            todayWorker[j] = pickAndClassify(threePointMembers, twoPointMembers, point, day);
                        }
                    }
                    break;
                case 3:
                    if(zeroPointMembers.length) // 근무를 한번도 안한 사람이 있을때
                    {
                        todayWorker[j] = pickAndClassify(zeroPointMembers, threePointMembers, point, day);
                    }
                    else if(!onePointMembers.length || !twoPointMembers.length)
                    {
                        if(!onePointMembers.length)
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, threePointMembers, point, day);
                        }
                        else if(!twoPointMembers.length)
                        {
                            todayWorker[j] = pickAndClassify(onePointMembers, threePointMembers, point, day);
                        }
                        else // only remain threePointMembers // from과 to가 같음
                        {
                            randomNum = Math.floor(Math.random() * threePointMembers.length - 1) + 1;
                            threePointMembers[randomNum].score = point; // 이런 경우에는 카운트 가장 적은 사람이
                            threePointMembers[randomNum].day = day;
                            threePointMembers[randomNum].count++;
                            todayWorker[j] = threePointMembers[randomNum].name;
                        }
                    }
                    else if(repOneDayDistance < 2 || reptwoDayDistance < 2)
                    {
                        if(repOneDayDistance < 2)
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, threePointMembers, point, day);
                        }
                        else // 둘다 없는 경우가 있을까? 이거는 테스트 하면서 확인 해봐야함.
                        {
                            todayWorker[j] = pickAndClassify(onePointMembers, threePointMembers, point, day);
                        }
                    }
                    else
                    {
                        randomNum = Math.floor(Math.random() * 100 + 1);
                        if(randomNum % 2 === 0)
                        {
                            todayWorker[j] = pickAndClassify(onePointMembers, threePointMembers, point, day);
                        }
                        else
                        {
                            todayWorker[j] = pickAndClassify(twoPointMembers, threePointMembers, point, day);
                        }
                    }
                    break;
                default:
                    alert("Unknown type");
                    break;
            }
        }
        console.log(`${yoill[i]} : ${todayWorker}`);
    }
}
pick();