/* 근무 짜는 프로그램*/
'use strict';
{
    const week = 7;
    let shift = [];
    
    let objShift =
    {
        mon : [],
        tue : [],
        wed : [],
        thr : [],
        fri : [],
        sat : [],
        sun : []
    };
    let members = [];
    let shiftId = 0;
    // sheet
    let person = ["길윤재", "황중현", "이근혁", "서동휘", "나종원", "박시현", "이관진", "임석범", "황인성", "류희성", "복병수", "김민수", "김종훈", "김정현", "백지용", "홍우진", "김민수2", "김수환", "김승진", "손건우", "강우석", "송강산", "김석희", "김선규", "박태규", "공민식", "오도경", "홍성원", "최현준", "권오복", "최재성", "김창민", "이영한" , "박준서", "김수원", "김건호", "강건호", "이정원"];
    const shiftName = ["04", "06", "08", "10", "12", "14", "16", "18", "20", "22", "first", "second", "third", "fourth", "guardhouse1", "guardhouse2"]; // Server data
    const numberOfShift = ["cctv", "불침번", "위병소"];
    let btnSetShift = document.getElementById('setShift');

    class shiftInfo //re
    {
        constructor(id, name, score, day, who)
        {
            this.id = id;
            this.name = name;
            this.score = score;
            this.day = day;
            this.who = who;
        }
    }

    class memberInfo
    {
        constructor(id, name, score, cnt, day, sum)
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
    }
    
    function createShift()
    {
        let day = 0;
        let weekdayShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 2, 3, 2]; // Server data
        let friShiftScore = [3, 2, 2, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 2]; // Server data
        let satShiftScore = [2, 2, 2, 2, 2, 3, 3, 3, 3, 1, 1, 1, 2, 2, 3, 3]; // Server data
        let sunShiftScore = [2, 2, 2, 3, 3, 3, 2, 3, 2, 2, 2, 2, 3, 2, 3, 3]; // Server data

        for(const dayOfWeek in objShift)
        {
            switch(dayOfWeek)
            {
                case "fri":
                    for(let i = 0; i < 14; i++)
                    {
                        objShift[dayOfWeek][i] = new shiftInfo(shiftId, shiftName[i], friShiftScore[i], day, "");
                        shiftId++;
                    }
                    break;
                case "sat":
                    for(let i = 0; i < 16; i++)
                    {
                        objShift[dayOfWeek][i] = new shiftInfo(shiftId, shiftName[i], satShiftScore[i], day, "");
                        shiftId++;
                    }
                    break;
                case "sun":
                    for(let i = 0; i < 16; i++)
                    {
                        objShift[dayOfWeek][i] = new shiftInfo(shiftId, shiftName[i], sunShiftScore[i], day, "");
                        shiftId++;
                    }
                    break;
                default:
                    for(let i = 0; i < 14; i++)
                    {
                        objShift[dayOfWeek][i] = new shiftInfo(shiftId, shiftName[i], weekdayShiftScore[i], day, "");
                        shiftId++;
                    }
                    break;
            }
            day++;
        }
        console.log(objShift);
    }

    createShift();
    
    function loadMembers(zeroPoint) // 나중에 엑셀
    {
        let tempPerson = person;
        if(!members.length)
        {
            for(let i = 0; i < tempPerson.length; i++)
            {
                members[i] = new memberInfo(i, tempPerson[i], 0, 0, 0, 0);
                zeroPoint[i] = members[i];    
            }
        }
        else if(members.length < tempPerson.length) // 추가 되었을때 (휴가복귀)
        {
            for(let i = 0; i < tempPerson.length; i++)
            {
                for(let j = 0; j < members.length; j++)
                {
                    if(tempPerson[i] === members[j].name)
                    {
                        tempPerson.splice(i, 1);
                        break;
                    }
                }
            }

            for(let i = 0; i < tempPerson.length; i++)
            {
                tempPerson[i] = new memberInfo(members.length, tempPerson[i], 0, 0, 0, 0);
                members.push(tempPerson[i]);
                zeroPoint.push(tempPerson[i]);
            }
        }
        else if(members.length > person.length) // 휴가 나감
        {
            let tempMembersArray = members;
            let cnt = 0;
            for(let i = 0; i < tempMembersArray.length; i++)
            {
                for(let j = 0; j < tempPerson.length; j++)
                {
                    if(tempMembersArray[i].name === tempPerson[j])
                    {
                        tempMembersArray.splice(i, 1);
                        break;
                    }
                }
            }

            for(let i = 0; i < members.length; i++)
            {
                for(let j = 0; j < tempMembersArray.length; j++)
                {
                    if(members[i].id === tempMembersArray[j].id)
                    {
                        members.splice(i , 1);
                        cnt++;
                    }
                }
                if(cnt === tempMembersArray.length)
                {
                    break;
                }
            }
        }
        else // 휴가 복귀자랑 출발자 수가 똑같은면?
        {
            return;
        }
    }

    function controlInfo(selectedPeople, shift)
    {
        let workedCnt = selectedPeople.worked.length;
        let workIdCnt = selectedPeople.workId.length;

        selectedPeople.score = shift.score;
        selectedPeople.sum += shift.score;
        selectedPeople.day = shift.day;
        selectedPeople.count++;
        selectedPeople.worked[workedCnt] = shift.name;
        selectedPeople.workId[workIdCnt] = shift.id;
    }

    function checkPossiblePeople(day)
    {
        let possible = [];
        let len = members.length;
        let maxCount = Math.ceil(shiftId / len);

        // Check Possible
        for(let i = 0; i < len; i++)
        {
            if(members[i].count >= maxCount)
            {
                continue;
            }
            else if(members[i].count === 0) // 이거 나중에 매일 loadMemebers 호출하면 필요 없어질듯????
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

    function checkLessWorkers(selectedPeople)
    {
        let leastCnt = 3;
        let less = [];
        for(let i = 0; i < selectedPeople.length; i++) // 가장 적게 한 횟수 구함
        {
            if(selectedPeople[i].count < leastCnt)
            {
                leastCnt = selectedPeople[i].count;
                if(leastCnt === 1) // 0은 여기 올 수 없음 그러니 가장 작은 1이 나오면 더 볼 것도 없음
                {
                    break;
                }
            }
        }

        for(let i = 0; i < selectedPeople.length; i++) // 가장 적게 한 인원들 구함
        {
            if(leastCnt === selectedPeople[i].count)
            {
                less.push(selectedPeople[i]);
            }
        }
        return less;
    }

    function pickAndControlInfo(selectedPeople, shift)
    {
        let randomPerson = 0;
        let pass = false;
        let repeatCnt = 0;
        let pickedPerson = [];

        if(shift.score === 2) // 2점 근무는 이전에 무슨 근무를 했던지 상관없이 들어감
        {
            randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
        }
        else
        {
            if(shift.day === 6) // 이거를 checkPossible로 옮겨야 함
            {
                let oneCntMember = []; // 마지막 날인 일요일 까지 한번 사람이 있다면 그사람 먼저
                for(let i = 0; i < members.length; i++)
                {
                    if(members[i].count === 1)
                    {
                        oneCntMember.push(members[i]);
                    }
                }

                if(oneCntMember.length)
                {
                    // debugger;
                    selectedPeople = null; // Bug 1 : 기존에 possiblePeople에서는 못 지움
                    selectedPeople = oneCntMember;
                }
            }

            while(!pass)
            {
                randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
        
                if(selectedPeople[randomPerson].score === shift.score)
                {
                    if(pickedPerson.length)
                    {
                        let isSameNumber = false;

                        for(let i = 0; i < pickedPerson.length; i++)
                        {
                            if(pickedPerson[i] === randomPerson)
                            {
                                isSameNumber = true;
                                break;
                            }
                        }

                        if(!isSameNumber)
                        {
                            pickedPerson.push(randomPerson);
                            repeatCnt++;
                        }
                    }
                    else
                    {
                        pickedPerson.push(randomPerson);
                        repeatCnt++; // 중복되는 숫자가 나오면 카운트 하지 말아야함
                    }
                    pass = false;

                    if(repeatCnt === selectedPeople.length) // 모든 사람의 점수가 같은 경우 가장 적게 일한 사람들 중에서 픽함 // 위험 // 위에 oneCntMember랑 충돌 하는지?
                    {
                        // debugger;
                        if(pickedPerson.length === 1)
                        {
                            pass = true;
                        }
                        else
                        {
                            let temp = [];
                            temp = checkLessWorkers(selectedPeople);
                            selectedPeople = temp;
                            randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
                            pass = true;
                        }
                    }
                }
                else
                {
                    pass = true;
                }
            }
        }

        let todaySlave = selectedPeople[randomPerson].name;
        controlInfo(selectedPeople[randomPerson], shift);
        selectedPeople.splice(randomPerson, 1); // Bug 1

        return todaySlave;
    }

    function checkFair()
    {
        let variance = 0;
        let deviation = 0;
        let squared = 0;
        let totalScore = 0;
        let avg = 0;
        let hardWorkers = [];
        let easyWokers = [];

        for(let i = 0; i < members.length; i++)
        {
            totalScore += members[i].sum;

            if(members[i].sum > 7) // 숫자는 나중에 변수로
            {
                hardWorkers.push(members[i]);
            }
            else if(members[i].sum < 4) // 숫자는 나중에 변수로
            {
                easyWokers.push(members[i]);
            }
        }

        avg = totalScore / members.length;
        avg = Number(avg.toFixed(1));
        
        // 표준편차
        for(let i = 0; i < members.length; i++)
        {
            squared = 0;
            squared = members[i].sum - avg;
            squared *= squared;
            deviation += squared;
        }

        variance = deviation / members.length;
        variance = Number(variance.toFixed(3));
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

    function createData(shift)
    {
        let  data =
        {
            headers: ["요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"],
            rows: Array.from(Array(shiftName.length), () => Array(week).fill(null))
        }

        /*for(const dayOfWeek in objShift)
        {
            for(let i = 0; i < objShift[dayOfWeek].length; i++)
            {
                data.rows[j][i] = objShift[dayOfWeek][i].who;
            }
        }*/

        for(let i = 0; i < week; i++)
        {
            for(let j = 0; j < shift[i].length; j++)
            {
                data.rows[j][i] = shift[i][j].who;
            }
        }

        // data.rows[n][0]은 근무이름
        for(let i = 0; i < data.rows.length; i++)
        {
            data.rows[i].unshift(shiftName[i]);
        }

        return data;
    }

    function main() // Change name (ex: shifting?)
    {
        let zeroPointMembers = [];
        loadMembers(zeroPointMembers); // 나중에 휴가자들
        let day = 0;
        let yoill = ["Mon", "Tue", "Wed", "Thr", "Fri", "Sat", "Sun"];
        
        for(const dayOfWeek in objShift)
        {
            let todayWorker = []; // re
            let possiblePeople = [];

            if(zeroPointMembers.length)
            {
                for(let i = 0; i < objShift[dayOfWeek].length; i++)
                {
                    if(!zeroPointMembers.length)
                    {
                        possiblePeople = checkPossiblePeople(day);
                        for(let j = i; j < objShift[dayOfWeek].length; j++)
                        {
                            todayWorker[j] = pickAndControlInfo(possiblePeople, objShift[dayOfWeek][j]);
                            objShift[dayOfWeek][j].who = todayWorker[j];
                        }
                        break;
                    }
                    else
                    {
                        todayWorker[i] = pickAndControlInfo(zeroPointMembers, objShift[dayOfWeek][i]);
                        objShift[dayOfWeek][i].who = todayWorker[i];
                    }
                }
            }
            else
            {
                possiblePeople = checkPossiblePeople(day);
                for(let i = 0; i < objShift[dayOfWeek].length; i++)
                {
                    todayWorker[i] = pickAndControlInfo(possiblePeople, objShift[dayOfWeek][i]);
                    objShift[dayOfWeek][i].who = todayWorker[i];
                }
            }
            console.log(`${yoill[day]} : ${todayWorker}`);

            day++;
        }
        
        checkFair();

        console.log(shift);
        // Create data
        // const data = createData(shift);
        // console.log(data);

        // renderingTable(data);
    }

    function renderingTable(data)
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

        for(const header of data.headers)
        {
            table.querySelector('thead tr').insertAdjacentHTML('beforeend', `<th>${header}</th>`);
        }

        for(const row of data.rows)
        {
            table.querySelector('tbody').insertAdjacentHTML('beforeend', `
                <tr>
                    ${ row.map(col => `<td>${ col }</td>`).join("") }
                </tr>
            `)
        }
    }

    //동적 테이블 만들기
    var myArray = [
        {'이름' : '홍', '나이' : '20', '성별' : '남'},
        {'이름' : '이', '나이' : '25', '성별' : '여'},
        {'이름' : '박', '나이' : '30', '성별' : '여'}
    ];
    
    function buildTable(data) 
    { 
        var table = document.getElementById('table1') 
        for (var i=0; i < data.length; i++) 
        { 
            var row = `
            <tr>
                <td>${data[i].이름}</td>
                <td>${data[i].나이}</td>
                <td>${data[i].성별}</td>
            </tr>
            `;
            table.innerHTML += row 
        } 
    }

    btnSetShift.addEventListener("click", () =>
    {
        main();
    });
}