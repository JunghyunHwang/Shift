/* 근무 짜는 프로그램*/
'use strict';

exports.getData = (membersData, shiftData, shiftType, lastpick) =>
{
    // Get date
    let lastRenderWeek = 0;
    
    if(lastpick === null)
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
        lastRenderWeek = new Date(lastpick);
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

    
    let shift = // 이거 안하고 데이터베이스 받은거 그대로 쓰면 요일 순서가 바뀜
    {
        mon: shiftData.mon,
        tue: shiftData.tue,
        wed: shiftData.wed,
        thr: shiftData.thr,
        fri: shiftData.fri,
        sat: shiftData.sat,
        sun: shiftData.sun
    }
    
    let members = membersData;

    function setShift() // re
    {
        let day = 0;

        for(const dayOfWeek in shift)
        {
            switch(dayOfWeek)
            {
                case "fri":
                    for(const work of shift[dayOfWeek])
                    {
                        work.day = thisWeek[day];
                    }
                    break;
                case "sat":
                    for(const work of shift[dayOfWeek])
                    {
                        work.day = thisWeek[day];
                    }
                    break;
                case "sun":
                    for(const work of shift[dayOfWeek])
                    {
                        work.day = thisWeek[day];
                    }
                    break;
                default:
                    for(const work of shift[dayOfWeek])
                    {
                        work.day = thisWeek[day];
                    }
                    break;
            }
            day++;
        }
    }

    setShift();

    let totalShifts = 0;

    for(const dayOfWeek in shift)
    {
        totalShifts += shift[dayOfWeek].length;
    }

    function controlInfo(selectedPeople, shift)
    {
        if(shift.duo)
        {
            shift.who.push(selectedPeople.name);
        }
        else
        {
            shift.who = selectedPeople.name;
        }
        selectedPeople.score = shift.score;
        selectedPeople.sum += shift.score;
        selectedPeople.day = shift.day;
        selectedPeople.count++;
    }

    function checkPossiblePeople(day)
    {
        let possible = [];
        let lessWorkers = [];
        let maxCount = Math.ceil(totalShifts / members.length);
        let minCount = (day === thisWeek[6]) ? 1 : 0; // 1이랑 0도 magicnumber 말고 다른걸로
        let today = new Date(day); // 1월 1일 00시00분 으로 되는 버그 있음 (일이 2자리수가 되면 시간이 09:00로됨, 1자리수 일은 00:00로 됨)
        today.setHours(0);
        let currentDate = today.getDate();

        // Check Possible
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

        for(const member of selectedPeople)
        {
            tempPeople.push(member);
        }

        if(shift.score === 2 || tempPeople.length === 1) // re tempPeople 이 조건 절대 안걸림
        {
            randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;
        }
        else
        {
            while(!pass)
            {
                randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;

                if(tempPeople[randomPerson].score === shift.score)
                {
                    pickedPerson.push(tempPeople[randomPerson]);
                    tempPeople.splice(randomPerson, 1);

                    if(tempPeople.length <= 0)
                    {
                        tempPeople = checkLessWorkers(pickedPerson);
                        randomPerson = Math.floor(Math.random() * tempPeople.length - 1) + 1;
                        pass = true;
                    }
                    else
                    {
                        pass = false;
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

    function pickMember(shift, selectedPeople)
    {
        let membersName = "";
        let todaySlave = ""; //re 필요없음

        if(shift.duo)
        {
            membersName = pickName(shift, selectedPeople);

            for(let i = 0; i < selectedPeople.length; i++)
            {
                if(selectedPeople[i].name === membersName)
                {
                    todaySlave = selectedPeople[i].name;
                    controlInfo(selectedPeople[i], shift);
                    selectedPeople.splice(i, 1);
                    break;
                }
            }
        }

        if(!selectedPeople.length)
        {
            debugger;
            selectedPeople = checkPossiblePeople(shift.day);
        }

        membersName = pickName(shift, selectedPeople);

        for(let i = 0; i < selectedPeople.length; i++)
        {
            if(selectedPeople[i].name === membersName)
            {
                todaySlave = selectedPeople[i].name;
                controlInfo(selectedPeople[i], shift);
                selectedPeople.splice(i, 1);
                break;
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

    function main()
    {
        let day = 0;

        for(const member of members)
        {
            member.score = 0;
            member.count = 0;
            member.day = 0;
            member.sum = 0;
        }

        for(const dayOfWeek in shift)
        {
            let possibleMembers = [];
            let today = []; // re 필요없음

            possibleMembers = checkPossiblePeople(thisWeek[day]);

            // pick a memeber
            for(const work of shift[dayOfWeek])
            {
                if(!possibleMembers.length)
                {
                    possibleMembers = checkPossiblePeople(thisWeek[day]);
                    today.push(pickMember(work, possibleMembers));
                }
                else
                {
                    today.push(pickMember(work, possibleMembers));
                }
            }
            
            // console.log(`${dayOfWeek} : ${today}`);
            day++;
        }
        // checkFair();
    }

    main();
    return [shift, thisWeek];
}