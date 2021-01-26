/* 근무 짜는 프로그램*/
'use strict';

exports.getData = (membersData, shiftInfo) =>
{
    const typesOfShift = shiftInfo.typesOfShift;
    const relation = shiftInfo.relation;
    const lastPick = shiftInfo.lastPick;

    // Get thisweek
    let lastRenderWeek = 0;
    
    if(lastPick === null)
    {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let date = now.getDate();
        let dayOfWeek = now.getDay();
        let diff = 7 - dayOfWeek;

        date += diff;
        lastRenderWeek = new Date(year, month, date);
    }
    else
    {
        lastRenderWeek = new Date(lastPick);
    }

    let currentDate = new Date();
    let dateDiff = (lastRenderWeek.getTime() - currentDate.getTime()) / (1000*60*60*24);
    let thisWeek = [];

    if(dateDiff > 6) // re
    {
        // 저번주 데이터를 가져와
        let nextRenderWeek = lastRenderWeek;
        for(let i = 0; i < 7; i++)
        {
            nextRenderWeek.setDate(nextRenderWeek.getDate() + 1);
            let year = nextRenderWeek.getFullYear();
            let month = Number(nextRenderWeek.getMonth()) + 1;
            let date = nextRenderWeek.getDate();

            thisWeek[i] = `${year}-${month}-${date}`;
        }
    }
    else
    {
        let nextRenderWeek = lastRenderWeek;
        for(let i = 0; i < 7; i++)
        {
            nextRenderWeek.setDate(nextRenderWeek.getDate() + 1);
            let year = nextRenderWeek.getFullYear();
            let month = Number(nextRenderWeek.getMonth()) + 1;
            let date = nextRenderWeek.getDate();

            thisWeek[i] = `${year}-${month}-${date}`;
        }
    }

    let members = membersData;

    // Set Object shift

    for(const type in typesOfShift)
    {
        typesOfShift[type].sort(function(a, b)
        {
            return b['num'] - a['num'];
        });
    }

    let shift =
    {
        mon: [],
        tue: [],
        wed: [],
        thr: [],
        fri: [],
        sat: [],
        sun: []
    }

    function setDayOfWeekArry(id, day, dayOfWeek, shiftType)
    {
        let value ={};
        let workMinute = "00";
        let workTime = "";

        for(const work of shiftType)
        {
            for(let i = 0; i < work.num; i++)
            {
                let startTime = work.firstWorkTime + i * work.timeInterval;
                let endTime = startTime + work.timeInterval;
                startTime = (startTime >= 24) ? startTime -= 24 : startTime;
                endTime = (endTime >= 24) ? endTime -= 24 : endTime;

                if(startTime % 1) // decimal
                {
                    workMinute = "30"; // re
                    startTime = Math.floor(startTime);
                    endTime = startTime + work.timeInterval;
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    workTime = `${startTime}:${workMinute} ~ ${startTime + work.timeInterval}:${workMinute}`;
                }
                else
                {
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    endTime = (endTime / 10 < 1) ? `0${endTime}` : String(endTime);
                    workTime = `${startTime}:${workMinute} ~ ${endTime}:${workMinute}`;
                }
                
                if(work.duo)
                {
                    value = {id: id, workName: work.workName, time: workTime, day: thisWeek[day], duo: work.duo, who: []};
                }
                else
                {
                    value = {id: id, workName: work.workName, time: workTime, day: thisWeek[day], duo: work.duo, who: ""};
                }

                shift[dayOfWeek].push(value);
                id++;
            }
        }

        if(relation !== null)
        {
            let len = shift[dayOfWeek].length;

            for(const work of shift[dayOfWeek])
            {
                for(const baseId in relation)
                {
                    if(Number(baseId) === work.id)
                    {
                        work.relation = relation[baseId];
                        break;
                    }
                    else if(Number(baseId) > shift[dayOfWeek][len - 1].id)
                    {
                        break;
                    }
                }
            }
        }

        return id;
    }

    function setShift()
    {
        let day = 0;
        let id = 0;

        for(const dayOfWeek in shift)
        {
            switch(dayOfWeek)
            {
                case "sat":
                    id = setDayOfWeekArry(id, day, dayOfWeek, typesOfShift.weekend);
                    break;
                case "sun":
                    id = setDayOfWeekArry(id, day, dayOfWeek, typesOfShift.weekend);
                    break;
                default:
                    id = setDayOfWeekArry(id, day, dayOfWeek, typesOfShift.weekday);
                    break;
            }
            day++;
        }
    }

    setShift();

    let totalShifts = 0;

    for(const dayOfWeek in shift)
    {
        for(const work of shift[dayOfWeek])
        {
            if(work.duo)
            {
                totalShifts += work.duo;
            }
            else
            {
                totalShifts++;
            }
        }
    }

    function controlInfo(selectedPeople, shift)
    {
        let work = `${shift.workName}${shift.time}`;

        if(shift.duo)
        {
            shift.who.push(selectedPeople.name);
        }
        else
        {
            shift.who = selectedPeople.name;
        }
        // 다른 근무와 연관이 되어 있다면
        selectedPeople.worked.push(work);
        selectedPeople.day = shift.day;
        selectedPeople.count++;
    }

    function checkPossibleMembers(day)
    {
        let possible = [];
        let lessWorkers = [];
        let maxCount = Math.ceil(totalShifts / members.length);
        let worked = 0;

        // How many members should have worked
        for(const dayOfWeek in shift)
        {
            if(shift[dayOfWeek][0].day === day)
            {
                break;
            }
            else
            {
                worked += shift[dayOfWeek].length;
            }
        }

        let minCount = Math.floor(worked / members.length);
        let today = new Date(day); // (일이 2자리수가 되면 시간이 09:00로됨, 1자리수 일은 00:00로 됨)
        today.setHours(0);
        let currentDate = today.getDate();

        // Check Possible members
        for(const member of members)
        {
            let dayOfMember = new Date(member.day);
            dayOfMember.setHours(0);
            let dayDiff = (today.getTime() - dayOfMember.getTime()) / (1000*60*60*24);

            if(member.count >= maxCount)
            {
                continue;
            }
            else if(member[`${currentDate}`])
            {
                continue;
            }
            else if(member.count <= minCount)
            {
                if(member.count === 0)
                {
                    lessWorkers.push(member);
                }
                else if(dayDiff < 1)
                {
                    continue;
                }
                else
                {
                    lessWorkers.push(member);
                }
            }
            else if(dayDiff < 2) // 근무 후 적어도 하루는 쉰다는 규칙이 있을때만 적용, 후에 2을 변수로 변경, 인원들이 전부 한번씩 해도 이틀치 근무를 못 채우면 문제 발생
            {
                continue;
            }
            else
            {
                possible.push(member);
            }
        }

        if(lessWorkers.length)
        {
            return lessWorkers;
        }
        else
        {
            return possible;
        }
    }

    function checkLessWorkers(selectedPeople)
    {
        let leastCnt = 3;
        let less = [];

        // 가장 적게 한 횟수 구함
        for(let i = 0; i < selectedPeople.length; i++) 
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

        // 가장 적게 한 인원들 구함
        for(let i = 0; i < selectedPeople.length; i++) 
        {
            if(leastCnt === selectedPeople[i].count)
            {
                less.push(selectedPeople[i]);
            }
        }
        return less;
    }

    function pickName(shift, selectedPeople)
    {
        let pass = false;
        let randomPerson = 0;
        let pickedPerson = [];
        let tempPeople = [];
        let zeroCntMembers = [];

        for(const member of selectedPeople)
        {
            if(member.count === 0)
            {
                zeroCntMembers.push(member);
            }
            else
            {
                tempPeople.push(member);
            }
        }

        // Pick Number
        if(zeroCntMembers.length)
        {
            randomPerson = Math.floor(Math.random() * zeroCntMembers.length - 1) + 1;
            return zeroCntMembers[randomPerson].name;
        }

        if(tempPeople.length === 1)
        {
            randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;
        }
        else
        {
            while(!pass)
            {
                randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;
                let workedShifts = tempPeople[randomPerson].worked;
                let isSameWork = false;
                let workName = `${shift.workName}${shift.time}`;

                for(const worked of workedShifts)
                {
                    if(worked === workName)
                    {
                        isSameWork = true;
                        break;
                    }
                }

                if(isSameWork)
                {
                    pass = false;
                    pickedPerson.push(tempPeople[randomPerson]);
                    tempPeople.splice(randomPerson, 1);
                    if(tempPeople.length <= 0)
                    {
                        tempPeople = checkLessWorkers(pickedPerson);
                        randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;
                        pass = true;
                    }
                }
                else
                {
                    pass = true;
                }
            }
        }
        
        return tempPeople[randomPerson].name;
    }

    function pickMember(work, selectedPeople)
    {
        let membersName = "";
        let todaySlave = ""; //re 필요없음

        if(work.who !== "")
        {
            if(Array.isArray(work.who))
            {
                if(work.who.length !== 0)
                {
                    todaySlave = work.who;
                    return todaySlave;
                    // return;
                }
            }
            else
            {
                todaySlave = work.who;
                return todaySlave;
                // return;
            }
        }

        // 그럼 duo가 연결 되어있을때는
        if(work.duo)
        {
            membersName = pickName(work, selectedPeople);

            for(let i = 0; i < selectedPeople.length; i++)
            {
                if(selectedPeople[i].name === membersName)
                {
                    todaySlave = selectedPeople[i].name;
                    controlInfo(selectedPeople[i], work);
                    selectedPeople.splice(i, 1);
                    break;
                }
            }
        }

        if(!selectedPeople.length)
        {
            selectedPeople = checkPossibleMembers(work.day);
        }

        membersName = pickName(work, selectedPeople);

        for(let i = 0; i < selectedPeople.length; i++)
        {
            if(selectedPeople[i].name === membersName)
            {
                todaySlave = selectedPeople[i].name;
                controlInfo(selectedPeople[i], work);
                selectedPeople.splice(i, 1);
                break;
            }
        }

        // relation work
        if(work.relation)
        {
            for(const member of members)
            {
                if(member.name === work.who)
                {
                    member.count++;
                    break;
                }
            }
            for(const dayOfWeek in shift)
            {
                if(shift[dayOfWeek][0].id > work.relation)
                {
                    break;
                }

                for(const relation of shift[dayOfWeek])
                {
                    if(relation.id === work.relation)
                    {
                        relation.who = work.who;
                        break;
                    }
                }
            }
        }
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
        let maxMembers = []

        for(const member of members)
        {
            totalScore += member.sum;

            if(member.sum > 7) // 숫자는 나중에 변수로
            {
                hardWorkers.push(member);
            }
            else if(member.sum < 4) // 숫자는 나중에 변수로
            {
                easyWokers.push(member);
            }

            if(member.count >= 3)
            {
                maxMembers.push(member);
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
        for(const worker of hardWorkers)
        {
            console.log(`name: ${worker.name}, count ${worker.count}, sum : ${worker.sum}`);
        }

        console.log("-------------------------------------------");

        console.log(`easy worker 총 인원 : ${easyWokers.length}`);
        for(const worker of easyWokers)
        {
            console.log(`name: ${worker.name}, count ${worker.count}, sum : ${worker.sum}`);
        }

        console.log("-------------------------------------------");
        console.log(maxMembers.length);
    }

    function main()
    {
        let day = 0;

        for(const member of members)
        {
            member.count = 0;
            member.day = 0;
            member.worked = [];
        }

        for(const dayOfWeek in shift)
        {
            let possibleMembers = [];
            let today = []; // re 필요없음

            possibleMembers = checkPossibleMembers(thisWeek[day]);

            // pick a memeber
            for(const work of shift[dayOfWeek])
            {
                if(!possibleMembers.length)
                {
                    possibleMembers = checkPossibleMembers(thisWeek[day]);
                    today.push(pickMember(work, possibleMembers));
                }
                else
                {
                    today.push(pickMember(work, possibleMembers));
                }
            }
            
            console.log(`${dayOfWeek} : ${today}`);
            day++;
        }
        // checkFair();
    }

    main();
    return [shift, thisWeek];
}