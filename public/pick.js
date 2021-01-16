/* 근무 짜는 프로그램*/
'use strict';
{
    uploadFile.addEventListener('change', (e) =>
    {
        let files = e.target.files;
        let f;
        let temp = [];
        let members = [];
        
        for(let i = 0; i < files.length; i++)
        {
            f = files[i];
            let reader = new FileReader();

            reader.onload = (e) =>
            {
                let data = e.target.result;

                let workbook = XLSX.read(data, {type: 'binary'});

                workbook.SheetNames.forEach(function(item, index, array)
                {
                    const membersData = XLSX.utils.sheet_to_json(workbook.Sheets[item]);
                    
                    if(!temp.length)
                    {
                        temp = membersData;
                    }
                    else if(membersData > temp)
                    {
                        for(const tempMember of temp)
                        {
                            for(const member of membersData)
                            {
                                if(member.name === tempMember.name)
                                {
                                    members.push(Object.assign(member, tempMember));
                                    let cutNum = membersData.indexOf(member);
                                    membersData.splice(cutNum, 1);
                                    break;
                                }
                                else
                                {
                                    continue;
                                }
                            }
                        }

                        // 남는 넘들임
                        for(const member of membersData)
                        {
                            members.push(member);
                        }
                        getData(members);
                    }
                    else
                    {
                        for(const member of membersData)
                        {
                            for(const tempMember of temp)
                            {
                                if(member.name === tempMember.name)
                                {
                                    members.push(Object.assign(member, tempMember));
                                    let cutNum = temp.indexOf(tempMember);
                                    temp.splice(cutNum, 1);
                                    break;
                                }
                                else
                                {
                                    continue;
                                }
                            }
                        }

                        for(const tempMember of temp)
                        {
                            members.push(tempMember);
                        }

                        getData(members);
                    }
                });
            };

            reader.readAsBinaryString(f);
        }
    });

    const api_url = '/api/shift';
    let typesOfShift = {};
    let score = {};
    let lastPick = "";

    async function getData(membersData)
    {
        const options =
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membersData)
        };

        const response = await fetch(api_url, options);
        const shiftData = await response.json();

        typesOfShift = shiftData.typesOfShift;
        score = shiftData.score;
        lastPick = shiftData.lastPick;
        
        for(const type in typesOfShift)
        {
            typesOfShift[type].sort(function(a, b)
            {
                return b['num'] - a['num'];
            });
        }

        createDate();
    }

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

    let id = 0;

    function setDayOfWeekArry(day, dayOfWeek, shiftType)
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
                    value = {id: id, workName: work.workName, time: workTime, day: thisWeek[day], score: 0, duo: work.duo, who: []};
                }
                else
                {
                    value = {id: id, workName: work.workName, time: workTime, day: thisWeek[day], score: 0, duo: work.duo, who: ""};
                }

                shift[dayOfWeek].push(value);
                id++;
            }
        }
    }

    function setShiftScore(dayOfWeekArry)
    {
        for(const point in score)
        {
            switch(point)
            {
                case "onePoint":
                    for(const _id of score[point])
                    {
                        for(const work of dayOfWeekArry)
                        {
                            if(work.id === _id)
                            {
                                work.score = 1;
                            }
                        }
                    }
                    break;
                case "twoPoint":
                    for(const _id of score[point])
                    {
                        for(const work of dayOfWeekArry)
                        {
                            if(work.id === _id)
                            {
                                work.score = 2;
                            }
                        }
                    }
                    break;
                case "threePoint":
                    for(const _id of score[point])
                    {
                        for(const work of dayOfWeekArry)
                        {
                            if(work.id === _id)
                            {
                                work.score = 3;
                            }
                        }
                    }
                    break;
                default:
                    console.log("It is impossible");
                    break;
            }
        }
    }

    function setShift()
    {
        let day = 0;

        for(const dayOfWeek in shift)
        {
            switch(dayOfWeek)
            {
                case "fri":
                    setDayOfWeekArry(day, dayOfWeek, typesOfShift.weekday);
                    setShiftScore(shift[dayOfWeek]);
                    break;
                case "sat":
                    setDayOfWeekArry(day, dayOfWeek, typesOfShift.weekend);
                    setShiftScore(shift[dayOfWeek]);
                    break;
                case "sun":
                    setDayOfWeekArry(day, dayOfWeek, typesOfShift.weekend);
                    setShiftScore(shift[dayOfWeek]);
                    break;
                default:
                    setDayOfWeekArry(day, dayOfWeek, typesOfShift.weekday);
                    setShiftScore(shift[dayOfWeek]); // re 따로 빼봐
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
        let minCount = (day === thisWeek[6]) ? 1 : 0; // 1이랑 0도 magicnumber 말고 다른걸로 날짜가 갈 수록 올라감
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
            
            console.log(`${dayOfWeek} : ${today}`);
            day++;
        }
        checkFair();
    }

    main();
    return [shift, thisWeek];
}