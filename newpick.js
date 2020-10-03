/*
    근무 짜는 프로그램
*/


// possiblePeople에 픽 된 사람이 어느 만약 스코어가 1이면 one 2면 two 3이면 three
// 점수와 날짜 그리고 카운트 올리는 함수
// 배열간 이동 

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

function pickAndClassify(one, two, three, point, day) // return person(object)
{
    let possible = [];
    let random = [];
    let tempArray = [];
    let tempScore = 0;

    tempArray = one.concat(two);
    possible = tempArray.concat(three);
    random = Math.floor(Math.random() * possible.length - 1) + 1;
    tempScore = possible[random].score;
    controlInfo(possible[random], point, day);

    if(!one.length)
    {
        if(tempScore === 2)
        {
            for(let i = 0; i < two.length; i++)
            {
                if(two[i].id === possible[random].id)
                {
                    one = two[i];
                    two.splice(i, 1);
                    return one;
                }
            }
        }
        else // tempScore === 3
        {
            for(let i = 0; i < three.length; i++)
            {
                if(three[i].id === possible[random].id)
                {
                    one = three[i];
                    three.splice(i, 1);
                    return one;
                }
            }
        }
    }
    else if(!two.length)
    {
        if(tempScore === 1)
        {
            for(let i = 0; i < one.length; i++)
            {
                if(one[i].id === possible[random].id)
                {
                    two = one[i];
                    one.splice(i, 1);
                    return two;
                }
            }
        }
        else // tempScore === 3
        {
            for(let i = 0; i < three.length; i++)
            {
                if(three[i].id === possible[random].id)
                {
                    two = three[i]
                    three.splice(i, 1);
                    return two;
                }
            }
        }
    }
    else
    {
        if(tempScore === 1)
        {
            for(let i = 0; i < one.length; i++)
            {
                if(one[i].id === possible[random].id)
                {
                    three = one[i];
                    one.splice(i, 1);
                    return three;
                }
            }
        }
        else // tempScore === 2
        {
            for(let i = 0; i < two.length; i++)
            {
                if(two[i].id === possible[random].id)
                {
                    three = two[i];
                    two.splice(i, 1);
                    return three;
                }
            }
        }
    }
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
            let randomPerson = 0;
            let selectedPerson; // change name

            switch(point)
            {
                case 1:
                    if(zeroPointMembers.length)
                    {
                        randomPerson = Math.floor(Math.random() * zeroPointMembers.length - 1) + 1;
                        controlInfo(zeroPointMembers[randomPerson], point, day);
                        todayWorker[j] = zeroPointMembers[randomPerson].name;
                        onePointMembers.push(zeroPointMembers[randomPerson]);
                        zeroPointMembers.splice(randomPerson, 1);
                    }
                    else if(!twoPointMembers.length && !threePointMembers.length) // only remain onePointMembers
                    {
                        randomPerson = Math.floor(Math.random() * onePointMembers.length - 1) + 1;
                        onePointMembers[randomPerson].score = point; // 이런 경우에는 카운트 가장 적은 사람이
                        onePointMembers[randomPerson].day = day;
                        onePointMembers[randomPerson].count++;
                        todayWorker[j] = onePointMembers[randomPerson].name;
                    }
                    else
                    {
                        selectedPerson = pickAndClassify([], twoPointMembers, threePointMembers, point, day);
                        onePointMembers.push(selectedPerson);
                        todayWorker[j] = selectedPerson.name;
                    }
                    break;
                case 2:
                    if(zeroPointMembers.length)
                    {
                        randomPerson = Math.floor(Math.random() * zeroPointMembers.length - 1) + 1;
                        controlInfo(zeroPointMembers[randomPerson], point, day);
                        todayWorker[j] = zeroPointMembers[randomPerson].name;
                        twoPointMembers.push(zeroPointMembers[randomPerson]);
                        zeroPointMembers.splice(randomPerson, 1);
                    }
                    else
                    {
                        selectedPerson = pickAndClassify(onePointMembers, [], threePointMembers, point, day);
                        twoPointMembers.push(selectedPerson);
                        todayWorker[j] = selectedPerson.name;
                    }
                    break;
                case 3:
                    if(zeroPointMembers.length)
                    {
                        randomPerson = Math.floor(Math.random() * zeroPointMembers.length - 1) + 1;
                        controlInfo(zeroPointMembers[randomPerson], point, day);
                        todayWorker[j] = zeroPointMembers[randomPerson].name;
                        threePointMembers.push(zeroPointMembers[randomPerson]);
                        zeroPointMembers.splice(randomPerson, 1);
                    }
                    else if(!onePointMembers.length && !twoPointMembers.length) // only remain threePointMembers
                    {
                        randomPerson = Math.floor(Math.random() * members.length - 1) + 1;
                        threePointMembers[randomPerson].score = point; // 이런 경우에는 카운트 가장 적은 사람이
                        threePointMembers[randomPerson].day = day;
                        threePointMembers[randomPerson].count++;
                        todayWorker[j] = threePointMembers[randomPerson].name;
                    }
                    else
                    {
                        selectedPerson = pickAndClassify(onePointMembers, twoPointMembers, [], point, day);
                        threePointMembers.push(selectedPerson);
                        todayWorker[j] = selectedPerson.name;
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

/*
    여러값을 리턴 받을때

    var newCodes = function()
    {
        var dCodes = fg.codecsCodes.rs;
        var dCodes2 = fg.codecsCodes2.rs;
        return [dCodes, dCodes2];
    };

    let codes = newCodes();
    let dCodes = codes[0];
    let dCodes2 = codes[1];
*/