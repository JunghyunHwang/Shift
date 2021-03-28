'use strict'
{
    let shiftSetting = document.getElementById('setting_form');
    shiftSetting.innerHTML = `
    <select name="" id="numOfWorktypes" size=1>
        <option value=1>1가지</option>
        <option value=2>2가지</option>
        <option value=3>3가지</option>
        <option value=4>4가지</option>
        <option value=5>5가지</option>
        <option value=6>6가지</option>
    </select>
    `;
    let _guide = document.getElementById('_guide');
    _guide.textContent = "총 몇 가지 종류의 근무가 있습니까?"; // re 젤 앞에 중대 이름
    let btnNext = document.getElementById('next_info');
    let numOfWorktypes = 0;
    let shiftData = {
        mon:[],
        tue:[],
        wed:[],
        thr:[],
        fri:[],
        sat:[],
        sun:[]
    };
    let typesOfShift = {
        weekday: [],
        weekend: []
    };
    let page = 1;
    let relationPage = 0;
    let temp = [];
    let relation = {
        weekday: {},
        weekend: {}
    };
    /* re let relation = {
        0: 5,
        1: 6,
        2: 7,
        3: 8,
        4: 9,
        14: 19,
        15: 20,
        16: 21,
        17: 22,
        18: 23,
        28: 33,
        29: 34,
        30: 35,
        31: 36,
        32: 37,
        42: 47,
        43: 48,
        44: 49,
        45: 50,
        46: 51,
        56: 61,
        57: 62,
        58: 63,
        59: 64,
        60: 65,
        70: 75,
        71: 76,
        72: 77,
        73: 78,
        74: 79,
        85: 90,
        86: 91,
        87: 92,
        88: 93,
        89: 94
    };*/
    let boolRelation;

    btnNext.addEventListener('click', () =>
    {
        createInputBox();
    });

    function createInputBox() // page switch
    {
        // 이것들 이동시켜야함
        let valueWorkName = document.querySelectorAll('.input_work_name');
        let valueStartHour = document.querySelectorAll('.start_hour');
        let valueStartMinute = document.querySelectorAll('.start_minute');
        let valueTimeInterval = document.querySelectorAll('#time_interval');
        let formCheck = "";

        switch(page)
        {
            case 1:
                numOfWorktypes = Number(document.getElementById('numOfWorktypes').value);
                let formWorkName = "";
        
                for(let i = 0; i < numOfWorktypes; i++)
                {
                    formWorkName += `<input type="text" class="input_work_name" name="workName">`;
                }

                shiftSetting.innerHTML = formWorkName;
                _guide.textContent = "각 근무에 이름을 적어 주세요";
                page++;
                break;
            case 2:
                
                for(const input of valueWorkName)
                {
                    temp.push(input.value);
                }

                formCheck = "";

                for(const Value of temp)
                {
                    formCheck += `<input type="checkbox" class="input_setting" name='${Value}' id="check_dayOfWeek"/> ${Value}`;
                }
                
                shiftSetting.innerHTML = formCheck;
                _guide.textContent = "이 중 평일 근무를 모두 체크해주세요.";
                page++;
                break;
            case 3:
                let checkDayOfWeek = document.querySelectorAll('#check_dayOfWeek');

                for(const box of checkDayOfWeek)
                {
                    if(box.checked)
                    {
                        typesOfShift.weekday.push({workName: box.name, num: 0, duo: 0});
                    }
                }

                formCheck = "";

                for(const Value of temp)
                {
                    formCheck += `<input type="checkbox" class="input_setting" name='${Value}' id="check_weekend"/> ${Value}`;
                }

                shiftSetting.innerHTML = formCheck;
                _guide.textContent = "이 중 주말 근무를 모두 체크해주세요.";
                page++;
                break;
            case 4:
                let checkWeekend = document.querySelectorAll('#check_weekend');

                for(const box of checkWeekend)
                {
                    if(box.checked)
                    {
                        typesOfShift.weekend.push({workName: box.name, num: 0, duo: 0});
                    }
                }

                formCheck = "";

                for(const Value of temp)
                {
                    formCheck += `<input type="checkbox" class="input_setting" name='${Value}' id="check_duo"/> ${Value}`;
                }

                shiftSetting.innerHTML = formCheck; 
                _guide.textContent = "이 중 2명 이상 같이 하는 근무를 선택해 주세요.";
                page++;
                break;
            case 5:

                let checkDuo = document.querySelectorAll('#check_duo');
                let duoWorkName = [];

                for(const value of checkDuo)
                {
                    if(value.checked)
                    {
                        duoWorkName.push(value.name);
                    }
                }

                for(const workName of duoWorkName)
                {
                    for(const type in typesOfShift)
                    {
                        let index = typesOfShift[type].findIndex(work => work.workName === workName);
                        if(index >= 0)
                        {
                            typesOfShift[type][index].duo = 2;
                        }
                    }
                }

                let inputPerDay = ""

                for(const work of typesOfShift.weekday)
                {
                    inputPerDay += `
                    <label id="work_per_day">${work.workName}
                        <input type="text" class="input_weekday_info" name="${work.workName}" placeholder="하루근무개수">
                        <div id=set_time>
                            <input type="text" class="start_hour" name="${work.workName}" placeholder="시작 시간">시
                            <input type="text" class="start_minute" name="${work.workName}" placeholder="몇분">분
                            <select name="${work.workName}" id="time_interval" size=1>
                                <option value=1>1시간씩</option>
                                <option value=2>2시간씩</option>
                                <option value=3>3시간씩</option>
                                <option value=4>4시간씩</option>
                            </select>
                        </div>
                    </label>`;
                }

                shiftSetting.innerHTML = inputPerDay;
                _guide.textContent = "평일 근무 개수, 근무 시작 시간과 몇 시간씩 근무하는지 선택해주세요.";
                page++;
                break;
            case 6:

                let valueWorkPerDay = document.querySelectorAll('.input_weekday_info');

                for(let i = 0; i < valueWorkPerDay.length; i++)
                {
                    let hour = Number(valueStartHour[i].value);
                    let minute = Number(valueStartMinute[i].value);
                    minute = (minute === 30) ? 0.5 : 0; //시작 시간이 무조건 30분 단위라는 가정하에만
                    let firstWorkTime = hour + minute;

                    for(const work of typesOfShift.weekday)
                    {
                        if(valueWorkPerDay[i].name === work.workName)
                        {
                            work.num = Number(valueWorkPerDay[i].value);
                            work.firstWorkTime = firstWorkTime;
                            work.timeInterval = Number(valueTimeInterval[i].value);
                        }
                    }
                }

                let inputPerDayWeekend = ""

                for(const work of typesOfShift.weekend)
                {
                    inputPerDayWeekend += `
                    <label id="work_per_day">${work.workName}
                        <input type="text" class="input_weekend_info" name="${work.workName}" placeholder="하루근무개수">
                        <div id=set_time>
                            <input type="text" class="start_hour" name="${work.workName}" placeholder="시작 시간">시
                            <input type="text" class="start_minute" name="${work.workName}" placeholder="몇분">분
                            <select name="${work.workName}" id="time_interval" size=1>
                                <option value=1>1시간씩</option>
                                <option value=2>2시간씩</option>
                                <option value=3>3시간씩</option>
                                <option value=4>4시간씩</option>
                            </select>
                        </div>
                    </label>`;
                }

                shiftSetting.innerHTML = inputPerDayWeekend;

                _guide.textContent = "주말 근무 개수, 근무 시작 시간과 몇 시간씩 근무하는지 선택해주세요.";
                page++;
                break;
            case 7:
                let valuePerDayWeekend = document.querySelectorAll('.input_weekend_info');

                for(let i = 0; i < valuePerDayWeekend.length; i++)
                {
                    let hour = Number(valueStartHour[i].value);
                    let minute = Number(valueStartMinute[i].value);
                    minute = (minute === 30) ? 0.5 : 0; //시작 시간이 무조건 30분 단위라는 가정하에만
                    let firstWorkTime = hour + minute;

                    for(const work of typesOfShift.weekend)
                    {
                        if(valuePerDayWeekend[i].name === work.workName)
                        {
                            work.num = Number(valuePerDayWeekend[i].value);
                            work.firstWorkTime = firstWorkTime;
                            work.timeInterval = Number(valueTimeInterval[i].value);
                        }
                    }
                }
                
                for(const type in typesOfShift)
                {
                    typesOfShift[type].sort((a, b) =>
                    {
                        return b['num'] - a['num'];
                    });
                }

                boolRelation = confirm("하루에 연관된 근무들이 있습니까? 예) 위병소 초번 근무를 한 사람이 불침번 초번 근무를 한다.");

                if(boolRelation)
                {   
                    setShiftData();
                    hasRelation();
                    page++;
                }
                else
                {
                    checkInfo();
                }
                break;
            case 8:
                if(boolRelation)
                {
                    inputRelationData();
                    hasRelation();
                }
                else
                {
                    inputRelationData();
                    checkInfo();
                }
                break;
            default:
                const settingWrong = `
                <div id="settingWrong">
                    <h4><a href"/">홈페이지로 돌아가 주세요</a></h4>
                </div>
                `;
                shiftSetting.innerHTML = settingWrong;
                break;
        }
    }

    function inputRelationData()
    {
        let valueRelation = document.querySelectorAll("#input_relation");
        let relationData = {};

        for(const input of valueRelation)
        {
            if(input.children[0].value === "")
            {
                continue;
            }
            else
            {
                let base = input.children[0].value;
                let target = Number(input.children[1].value);
                relationData[base] = target;
            }
        }

        switch(relationPage)
        {
            case 0:
                relation.weekday = relationData;
                break;
            case 1:
                relation.weekend = relationData;
                break;
            default:
                alert("Unknown type...");
                break;
        }

        relationPage++;
    }

    function hasRelation()
    {
        switch(relationPage)
        {
            case 0:
                createRelation(shiftData.mon);
                break;
            case 1:
                createRelation(shiftData.sat);
                boolRelation = false;
                break;
            default:
                confirm("Unknown type");
                break;
        }
    }

    function createRelation(dayOfWeek)
    {
        let inputRelation = "";

        for(let i = 0; i < dayOfWeek.length; i++)
        {
            inputRelation += `
            <div id="ex_relation">
                ${i}번 ${dayOfWeek[i].workName} ${dayOfWeek[i].time}
            </div>
            `;
        }

        let inputCnt = dayOfWeek.length / 2;

        for(let i = 0; i < inputCnt; i++)
        {
            inputRelation += `
            <div id="input_relation">
                <input type="text" class="_base">과
                <input type="text" class="_target">
            </div>
            `;
        }

        shiftSetting.innerHTML = inputRelation;

        switch(relationPage)
        {
            case 0:
                _guide.textContent = "'평일' 연관이 있는 근무를 적어주세요";
                break;
            case 1:
                _guide.textContent = "'주말' 연관이 있는 근무를 적어주세요";
                break;
            default:
                confirm("Unknown type");
                break;
        }
    }

    function setShiftValues(typesOfWork, dayOfWeek)
    {
        let value ={};
        let startTime = 0;
        let endTime = 0;
        let workMinute = "00";
        let workTime = "";

        for(const shiftType of typesOfWork)
        {
            for(let i = 0; i < shiftType.num; i++)
            {
                startTime = shiftType.firstWorkTime + i * shiftType.timeInterval;
                endTime = startTime + shiftType.timeInterval;
                startTime = (startTime >= 24) ? startTime -= 24 : startTime;
                endTime = (endTime >= 24) ? endTime -= 24 : endTime;

                if(startTime % 1)
                {
                    workMinute = "30"; // re
                    startTime = Math.floor(startTime);
                    endTime = startTime + shiftType.timeInterval;
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    workTime = `${startTime}:${workMinute} ~ ${startTime + shiftType.timeInterval}:${workMinute}`;
                }
                else
                {
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    endTime = (endTime / 10 < 1) ? `0${endTime}` : String(endTime);
                    workTime = `${startTime}:${workMinute} ~ ${endTime}:${workMinute}`;
                }

                // value = {name: work.workName, time: workTime, date: thisWeek[day].date, day: dayOfWeek, duo: work.duo};
                // value.who = (work.duo) ? [] : "";
                
                if(shiftType.duo)
                {
                    value = {workName: shiftType.workName, time: workTime, day: 0, score: 0, duo: shiftType.duo, who: []};
                }
                else
                {
                    value = {workName: shiftType.workName, time: workTime, day: 0, score: 0, duo: shiftType.duo, who: ""};
                }

                shiftData[dayOfWeek].push(value);
            }
        }
    }

    function checkInfo()
    {
        let settingForm = document.querySelector('#shift_setting');
        settingForm.remove();

        let isWeekdayRelation = Object.keys(relation.weekday).length;
        let isWeekendRelation = Object.keys(relation.weekend).length;

        // none relation
        if(!isWeekdayRelation && !isWeekendRelation)
        {
            relation = null;
        }

        let shift =
        {
            shift_info: typesOfShift,
            relation: relation
        };
        console.log(shift);
        sendData();
    }

    function setShiftData()
    {   
        // Set object shiftData values
        for(const dayOfWeek in shiftData)
        {
            switch(dayOfWeek)
            {
                case "sat":
                    setShiftValues(typesOfShift.weekend, dayOfWeek);
                    break;
                case "sun":
                    setShiftValues(typesOfShift.weekend, dayOfWeek);
                    break;
                default:
                    setShiftValues(typesOfShift.weekday, dayOfWeek);
                    break;
            }
        }
    }

    function sendData()
    {
        let shift =
        {
            shift_info: typesOfShift,
            relation_info: relation
        };
        const jsonShift = JSON.stringify(shift);

        const root = document.querySelector('#check_shift');
        const formSendData = document.createElement('form');
        const shiftInfo = document.createElement('input');
        const btnSubmit = document.createElement('button');

        formSendData.action = '/auth/setting';
        formSendData.method = 'POST';
        formSendData.id = 'submit_form';

        shiftInfo.type = 'hidden';
        shiftInfo.name = 'shift_info';
        shiftInfo.value = jsonShift;

        btnSubmit.type = 'submit'
        btnSubmit.textContent = '완료';
        btnSubmit.id = 'btn_submit';

        formSendData.insertAdjacentElement('beforeend', shiftInfo);
        formSendData.insertAdjacentElement('beforeend', btnSubmit);
        root.append(formSendData);
    }
}