/* 근무 짜는 프로그램*/
'use strict';

exports.getData = (shiftData, works, membersData, lastpick) =>
{
    // Get date
    let lastRenderWeek = new Date(lastpick);
    let currentDate = new Date();
    let dateDiff = (lastRenderWeek.getTime() - currentDate.getTime()) / (1000*60*60*24);
    let thisWeek = [];

    if(dateDiff > 6)
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

    console.log(thisWeek);

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
    let members = [];

    function setShiftday()
    {
        let day = 0;

        for(const dayOfWeek in shift)
        {
            switch(dayOfWeek)
            {
                case "fri":
                    for(let i = 0; i < shift[dayOfWeek].length; i++)
                    {
                        shift[dayOfWeek][i].day = thisWeek[day];
                    }
                    break;
                case "sat":
                    for(let i = 0; i < shift[dayOfWeek].length; i++)
                    {
                        shift[dayOfWeek][i].day = thisWeek[day];
                    }
                    break;
                case "sun":
                    for(let i = 0; i < shift[dayOfWeek].length; i++)
                    {
                        shift[dayOfWeek][i].day = thisWeek[day];
                    }
                    break;
                default:
                    for(let i = 0; i < shift[dayOfWeek].length; i++)
                    {
                        shift[dayOfWeek][i].day = thisWeek[day];
                    }
                    break;
            }
            day++;
        }
    }

    setShiftday();
    // sheet
    let person = membersData;
    let totalShifts = 0;

    for(const dayOfWeek in shift)
    {
        totalShifts += shift[dayOfWeek].length;
    }

    class memberInfo
    {
        constructor(name)
        {
            this.name = name
            this.score = 0;
            this.count = 0;
            this.day = 0;
            this.sum = 0;
        }
    }

    function loadMembers(zeroPoint) // 나중에 엑셀
    {
        let tempPerson = person;
        if(!members.length)
        {
            for(let i = 0; i < tempPerson.length; i++)
            {
                members[i] = new memberInfo(tempPerson[i]);
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
                tempPerson[i] = new memberInfo(tempPerson[i]);
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
        shift.who = selectedPeople.name;
        selectedPeople.score = shift.score;
        selectedPeople.sum += shift.score;
        selectedPeople.day = shift.day;
        selectedPeople.count++;
    }

    function checkPossiblePeople(day)
    {
        let possible = [];
        let len = members.length;
        let maxCount = Math.ceil(totalShifts / len);
        let nowDay = new Date(day); // 1월 1일 00시00분 으로 되는 버그 있음 (일이 2자리수가 되면 시간이 09:00로됨, 1자리수 일은 00:00로 됨)
        nowDay.setHours(0);

        // Check Possible
        for(let i = 0; i < len; i++)
        {
            let memberDay = new Date(members[i].day);
            memberDay.setHours(0);
            let dayDiff = (nowDay.getTime() - memberDay.getTime()) / (1000*60*60*24);

            if(members[i].count >= maxCount)
            {
                continue;
            }
            else if(members[i].count === 0) // 이거 나중에 매일 loadMemebers 호출하면 필요 없어질듯????
            {
                possible.push(members[i]);
            }
            else if(dayDiff < 2) // 근무 후 적어도 하루는 쉰다는 규칙이 있을때만 적용, 후에 2을 변수로 변경, 인원들이 전부 한번씩 해도 이틀치 근무를 못 채우면 문제 발생
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

    function pickMember(selectedPeople, shift)
    {
        let randomPerson = 0;
        let pass = false;
        let repeatCnt = 0;
        let pickedPerson = [];

        if(shift.score === 2) // 2점 근무는 이전에 무슨 근무를 했던지 상관없이 들어감 // re 현재 점수가 0점인 사람도 추가
        {
            randomPerson = Math.floor(Math.random() * selectedPeople.length - 1) + 1;
        }
        else
        {
            if(shift.day === thisWeek[6]) // 이거를 checkPossible로 옮겨야 함 이유는 여기 있으면 마지막날 모든 근무때 적용됨 차라리 한번도 안한 애들을 따로 만들기 //메인함수 else로
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

    function main()
    {
        let zeroPointMembers = [];
        loadMembers(zeroPointMembers);
        let day = 0;
        
        for(const dayOfWeek in shift)
        {
            let possiblePeople = []; // possible members
            let today = []; // re 필요없음

            // pick a memeber
            if(zeroPointMembers.length)
            {
                for(let i = 0; i < shift[dayOfWeek].length; i++)
                {
                    if(!zeroPointMembers.length)
                    {
                        possiblePeople = checkPossiblePeople(thisWeek[day]);
                        for(let j = i; j < shift[dayOfWeek].length; j++)
                        {
                            today[j] = pickMember(possiblePeople, shift[dayOfWeek][j]);
                        }
                        break;
                    }
                    else
                    {
                        today[i] = pickMember(zeroPointMembers, shift[dayOfWeek][i]);
                    }
                }
            }
            else
            {
                possiblePeople = checkPossiblePeople(thisWeek[day]);
                for(let i = 0; i < shift[dayOfWeek].length; i++)
                {
                    today[i] = pickMember(possiblePeople, shift[dayOfWeek][i]);
                }
            }
            console.log(`${dayOfWeek} : ${today}`);
            day++;
        }

        checkFair();
    }

    main();
    return [shift, thisWeek];
}