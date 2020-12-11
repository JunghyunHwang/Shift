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

/*
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
                    else
                    {
                        console.log("That is impossible");
                    }
                }
            }
        }
    }
}
*/

/*
    const data = 
    {
        headers: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
        rows: shift
    }
*/

let dia = 
{
    squadName: "Super hero squad",
    homeTown: "Metro City",
    formed: 2016,
    secretBase: "Super tower",
    active: true,
    members: 
    [
      {
        name: "Molecule Man",
        age: 29,
        secretIdentity: "Dan Jukes",
        powers: ["Radiation resistance", "Turning tiny", "Radiation blast"]
      },
      {
        name: "Madame Uppercut",
        age: 39,
        secretIdentity: "Jane Wilson",
        powers: ["Million tonne punch", "Damage resistance", "Superhuman reflexes"]
      },
      {
        name: "Eternal Flame",
        age: 1000000,
        secretIdentity: "Unknown",
        powers: ["Immortality", "Heat Immunity", "Inferno", "Teleportation", "Interdimensional travel"]
      }
    ]
}

let shift = 
{
    headers: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
    dayOfWeek:
    [
        {
            "cctv04" : "fuck",
            "cctv06" : "you",
            "nightshift" : "kil"
        },
        {
            "cctv04" : "김지완",
            "cctv06" : "길윤재",
            "nightshift" : "황중현"
        },
        {
            "cctv04" : "김정현",
            "cctv06" : "임석범",
            "nightshift" : "황인성"
        },
    ]
}


let test = 
{
    headers: ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
    
    mon:
    {
        "cctv04" : "fuck",
        "cctv06" : "you",
        "nightshift" : "kil"
    },
    tue:
    {
        "cctv04" : "김지완",
        "cctv06" : "길윤재",
        "nightshift" : "황중현"
    },
    wed:
    {
        "cctv04" : "김정현",
        "cctv06" : "임석범",
        "nightshift" : "황인성"
    }
}

/*
                    for(i of row) // re i 이름 바꾸자
                    {
                        switch(i.day_of)
                        {
                            case "mon":
                                data.weekdayShiftScore.push(i.score);
                                break;
                            case "fri":
                                data.friShiftScore.push(i.score);
                                break;
                            case "sat":
                                data.satShiftScore.push(i.score);
                                break;
                            case "sun":
                                data.sunShiftScore.push(i.score);
                                break;
                            default:
                                console.log("This is unknown type in day_of");
                                break;
                        }
                    }
                     
                    for(let i = 0; i < row.length; i++)
                    {
                        switch(row[i].day_of)
                        {
                            case "mon":
                                data.weekdayShiftScore.push(row[i].score);
                                break;
                            case "fri":
                                data.friShiftScore.push(row[i].score);
                                break;
                            case "sat":
                                data.satShiftScore.push(row[i].score);
                                break;
                            case "sun":
                                data.sunShiftScore.push(row[i].score);
                                break;
                            default:
                                console.log("This is unknown type in day_of");
                                break;
                        }
                    }
                    

                    let numberWeekdayShift = 0;
                    let numberWeekendShift = 0;
                    let numberFriShift = 0;
                    let numberSunShift = 0;
                    let isWeekdaySameNumber = true;
                    let isWeekendSameNumber = true;

                    if(data.weekdayShiftScore.length === data.friShiftScore.length)
                    {
                        numberWeekdayShift = data.weekdayShiftScore.length;
                    }
                    else
                    {
                        numberWeekdayShift = data.weekdayShiftScore.length;
                        numberFriShift = data.friShiftScore.length;
                        isWeekdaySameNumber = false;
                    }

                    if(data.satShiftScore.length === data.sunShiftScore.length)
                    {
                        numberWeekendShift = data.satShiftScore.length;
                    }
                    else
                    {
                        numberWeekdayShift = data.weekdayShiftScore.length;
                        numberSunShift = data.SunShiftScore.length;
                        isWeekendSameNumber = false;
                    }

                    for(propertyName in data)
                    {
                        // console.log(`${propertyName} : ${data[propertyName]}`);
                    }
                    // console.log(data.weekdayShiftScore[0]);*/

                    `
        <script>
        function renderingTable(data)
        {
            const root = document.querySelector('.table-shift');
    
            const table = document.createElement('table');
        
            table.classList.add('table-shift__table');
            
            table.innerHTML = \`
                <thead>
                    <tr></tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                    </tr>
                </tbody>
            \`;
        
            root.append(table);
    
            table.querySelector('thead tr').textContent = "";
            table.querySelector('tbody').textContent = "";
    
            for(const header of data)
            {
                table.querySelector('thead tr').insertAdjacentHTML('beforeend', \`<th>header</th>\`);
            }
    
            for(const row of data.rows)
            {
                table.querySelector('tbody').insertAdjacentHTML('beforeend', \`
                    <tr>
                        row.map(col => '<td> col </td>').join("")
                    </tr>
                \`)
            }
        }
        console.log(${tableData});
        renderingTable(${tableData});
        </script>`

        /*function renderingTable(data)
            {
                const root = document.querySelector('.table-shift');
        
                const table = document.createElement('table');
            
                table.classList.add('table-shift__table');
                
                table.innerHTML = `
                    <thead>
                        <tr></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                        </tr>
                    </tbody>
                `;
            
                root.append(table);
        
                table.querySelector('thead tr').textContent = "";
                table.querySelector('tbody').textContent = "";
        
                for(const header of data)
                {
                    table.querySelector('thead tr').insertAdjacentHTML('beforeend', `<th>${header}</th>`);
                }
        
                for(const row of data.rows)
                {
                    table.querySelector('tbody').insertAdjacentHTML('beforeend', `
                        <tr>
                            ${row.map(col => '<td> col </td>').join("")}
                        </tr>
                    `)
                }
            }*/