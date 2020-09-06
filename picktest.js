let weekday = 5;
let week = 7;
let shift = [];
let shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"];
let members = []; // 나중에 엑셀 연결 해서 가져옴
let zeroPointMembers = [];
let onePointMembers = [];
let fivePointMembers = [];
let sixPointMembers = [];
let hardWorkMembers = [];
let doNotWorkMemebers = [];
let shiftsTotal = 0;

function work(name, score, cnt)
{
    this.name = name
    this.score = score;
    this.count = cnt;
}

function loadMembers()
{
    for(let i = 0; i < 46; i++)
    {
        members[i] = i;
        members[i] = new work(i, 0, 0);
    }
}

function memberCategory (total)
{
    for(let i = 0; i < total; i++)
    {
        let point = members[i].score;

        switch(point)
        {
            case 0 :
                zeroPointMembers.push(members[i]);
                break;
            case 1 :
                onePointMembers.push(members[i]);
                break;
            case 5 :
                fivePointMembers.push(members[i]);
                break;
            // default :
            //     doNotWorkMemebers.push(members[i]); //////////////////이거 한번 확인
            //     break;
        }
    }
}

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4; // 불침번 근무 개수
    let numberCctvShift = 10; // cctv 근무 개수
    shiftsTotal = numberNightShift + numberCctvShift // onedayShiftTotal
    shiftsTotal = (i < weekday) ? shiftsTotal : shiftsTotal + 2; // 주말 위병소 근무 때문에
    shift[i] = new Array(shiftsTotal);
    
    for(let j = 0; j < shiftsTotal; j++)
    {
        if(j == 7)// shift[i][7]는 18~20이고, 매일 5점 짜리 근무임
        {
            shift[i][j] = new work(shiftName[j], 5, 1);
        }
        else
        {
            shift[i][j] = new work(shiftName[j], 1, 1); // 모든 근무 점수, 카운트 0으로 초기화
        }
    }

    for(let k = 10; k < shiftsTotal; k++) // 불침번 점수 설정
    {
        shift[i][k].score = (i == 4 || i == 5) ? 1 : 5; // 금,토 불침번은 0점 으로 설정
    }

    if(i >= weekday) // 주말 cctv 점수 설정
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
shift[5][14].score = 5;
shift[5][15].score = 5;

console.log(shift);

// *** 근무 짜기 전 멤버들과 근무 설정

function pickNum (maxNum)
{
    let randomNum = Math.floor(Math.random() * maxNum - 1) + 1; // Pick random number
    return randomNum;
}

loadMembers();
let membersTotal = members.length;
memberCategory(membersTotal);

for(let i = 0; i < week; i++)
{
    let numberNightShift = 4;
    let numberCctvShift = 10;
    shiftsTotal = numberNightShift + numberCctvShift;
    shiftsTotal = (i < weekday) ? shiftsTotal : shiftsTotal + 2;
    
    for(let j = 0; j < shiftsTotal; j++)
    {
        let point = shift[i][j].score;
        let selectedNum = 0;

        switch(point)
        {
            case 1:
                if(zeroPointMembers.length)
                {
                    selectedNum = pickNum(zeroPointMembers.length);
                    zeroPointMembers[selectedNum].score += point;
                    zeroPointMembers[selectedNum].count++;
                    onePointMembers.push(zeroPointMembers[selectedNum]);
                    zeroPointMembers.splice(selectedNum, 1);
                }
                else if(!fivePointMembers.length)
                {
                    if(!sixPointMembers.length)
                    {
                        selectedNum = pickNum(hardWorkMembers.length);
                        hardWorkMembers[selectedNum].score += point;
                        hardWorkMembers[selectedNum].count++
                        doNotWorkMemebers.push(hardWorkMembers[selectedNum]);
                        hardWorkMembers.splice(selectedNum, 1);
                    }
                    else
                    {
                        selectedNum = pickNum(sixPointMembers.length);
                        sixPointMembers[selectedNum].score += point;
                        sixPointMembers[selectedNum].count++
                        hardWorkMembers.push(sixPointMembers[selectedNum]);
                        sixPointMembers.splice(selectedNum, 1);
                    }
                }
                else // fivePointMembers
                {
                    selectedNum = pickNum(fivePointMembers.length);
                    fivePointMembers[selectedNum].score += point;
                    fivePointMembers[selectedNum].count++
                    sixPointMembers.push(fivePointMembers[selectedNum]);
                    fivePointMembers.splice(selectedNum, 1);
                }
                break;
            case 5:
                if(zeroPointMembers.length)
                {
                    selectedNum = pickNum(zeroPointMembers.length);
                    zeroPointMembers[selectedNum].score += point;
                    zeroPointMembers[selectedNum].count++;
                    fivePointMembers.push(zeroPointMembers[selectedNum]);
                    zeroPointMembers.splice(selectedNum, 1);
                }
                else if(!onePointMembers.length)
                {
                    if(!sixPointMembers.length)
                    {
                        selectedNum = pickNum(hardWorkMembers.length);
                        hardWorkMembers[selectedNum].score += point;
                        hardWorkMembers[selectedNum].count++
                        doNotWorkMemebers.push(hardWorkMembers[selectedNum]);
                        hardWorkMembers.splice(selectedNum, 1);
                    }
                    else
                    {
                        selectedNum = pickNum(sixPointMembers.length);
                        sixPointMembers[selectedNum].score += point;
                        sixPointMembers[selectedNum].count++
                        doNotWorkMemebers.push(sixPointMembers[selectedNum]);
                        sixPointMembers.splice(selectedNum, 1);
                    }
                }
                else // onePointMembers
                {
                    selectedNum = pickNum(onePointMembers.length);
                    onePointMembers[selectedNum].score += point;
                    onePointMembers[selectedNum].count++;
                    sixPointMembers.push(onePointMembers[selectedNum]);
                    onePointMembers.splice(selectedNum, 1);
                }
                break;
        }
    }
}
console.log(members);