'use strict'
{
    let shiftSetting = document.getElementById('_settingForm');
    shiftSetting.innerHTML = `
    <input type="text" class="input_setting" name="numOfWorktypes" id="numOfWorktypes">
    `;
    let _guide = document.getElementById('_guide');
    _guide.textContent = "몇 가지 종류의 근무가 있습니까?";
    let pageCnt = document.getElementById('page_count');
    pageCnt.textContent = "0 / 5";
    let btnNext = document.getElementById('next_info');
    let numOfWorktypes = 0;
    let shiftData = 
    {
        mon:[],
        tue:[],
        wed:[],
        thr:[],
        fri:[],
        sat:[],
        sun:[]
    };
    let workDayOfWeek = [];
    let workWeekend = [];
    let page = 10;
    let temp = [];
    let testshift = {
        mon : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2}
        ],
        tue : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2}
        ],
        wed : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2}
        ],
        thr : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2}
        ],
        fri : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2}
        ],
        sat : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2},
            {workName: "위병소", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "위병소", time: "14:00 ~ 16:00", day: 0, score: 2}
        ],
        sun : [
            {workName: "cctv", time: "04:00 ~ 06:00", day: 0, score: 3},
            {workName: "cctv", time: "06:00 ~ 08:00", day: 0, score: 2},
            {workName: "cctv", time: "08:00 ~ 10:00", day: 0, score: 1},
            {workName: "cctv", time: "10:00 ~ 12:00", day: 0, score: 3},
            {workName: "cctv", time: "12:00 ~ 14:00", day: 0, score: 2},
            {workName: "cctv", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "cctv", time: "16:00 ~ 18:00", day: 0, score: 3},
            {workName: "cctv", time: "18:00 ~ 20:00", day: 0, score: 2},
            {workName: "cctv", time: "20:00 ~ 22:00", day: 0, score: 1},
            {workName: "cctv", time: "22:00 ~ 00:00", day: 0, score: 3},
            {workName: "불침번", time: "22:00 ~ 00:00", day: 0, score: 2},
            {workName: "불침번", time: "00:00 ~ 02:00", day: 0, score: 1},
            {workName: "불침번", time: "02:00 ~ 04:00", day: 0, score: 1},
            {workName: "불침번", time: "04:00 ~ 06:00", day: 0, score: 2},
            {workName: "위병소", time: "14:00 ~ 16:00", day: 0, score: 1},
            {workName: "위병소", time: "14:00 ~ 16:00", day: 0, score: 2}
        ]
    };


    function createInputBox() // page switch
    {
        // 이것들 이동시켜야함
        let valueWorkName = document.querySelectorAll('#workName');
        let checkDayOfWeek = document.querySelectorAll('#check_dayOfWeek');
        let checkWeekend = document.querySelectorAll('#check_weekend');
        let valueStartHour = document.querySelectorAll('#start_hour');
        let valueStartMinute = document.querySelectorAll('#start_minute');
        let valueTimeInterval = document.querySelectorAll('#time_interval');
        let _workTotal = document.querySelectorAll('#_work');
        let formCheck = "";

        switch(page)
        {
            case 1:
                pageCnt.textContent = `${page} / 10`;
                numOfWorktypes = Number(document.getElementById('numOfWorktypes').value);
                let formWorkName = "";
        
                for(let i = 0; i < numOfWorktypes; i++)
                {
                    formWorkName += `<input type="text" class="input_setting" name="workName" id="workName"></input>`;
                }

                shiftSetting.innerHTML = formWorkName;
                _guide.textContent = "각 근무에 이름을 적어 주세요";
                page++;
                break;
            case 2:
                pageCnt.textContent = `${page} / 10`;
                
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
                pageCnt.textContent = `${page} / 10`;

                for(const box of checkDayOfWeek)
                {
                    if(box.checked)
                    {
                        workDayOfWeek.push({workName: box.name, num: 0});
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
                pageCnt.textContent = `${page} / 10`;

                for(let i = 0; i < checkWeekend.length; i++)
                {
                    if(checkWeekend[i].checked)
                    {
                        workWeekend[i] = {workName: checkWeekend[i].name, num: 0};
                    }
                    else
                    {
                        continue;
                    }
                }
                
                let inputPerDay = ""

                for(const Work of workDayOfWeek)
                {
                    inputPerDay += `
                    <label id="work_per_day">${Work.workName}
                        <input type="text" class="input_setting" name="${Work.workName}" id="input_WorkPerDay" placeholder="하루근무개수">
                        <div id=set_time>
                            <input type="text" name="${Work.workName}" id="start_hour" placeholder="시작 시간">시
                            <input type="text" name="${Work.workName}" id="start_minute" placeholder="몇분">분
                            <select name="name="${Work.workName}"" id="time_interval" size=1>
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
            case 5:
                pageCnt.textContent = `${page} / 10`;

                let valueWorkPerDay = document.querySelectorAll('#input_WorkPerDay');

                for(let i = 0; i < valueWorkPerDay.length; i++)
                {
                    let hour = Number(valueStartHour[i].value);
                    let minute = Number(valueStartMinute[i].value);
                    minute = (minute === 30) ? 0.5 : 0; //시작 시간이 무조건 30분 단위라는 가정하에만
                    let firstWorkTime = hour + minute;

                    for(const Work of workDayOfWeek)
                    {
                        if(valueWorkPerDay[i].name === Work.workName)
                        {
                            Work.num = Number(valueWorkPerDay[i].value);
                            Work.firstWorkTime = firstWorkTime;
                            Work.timeInterval = Number(valueTimeInterval[i].value);
                        }
                    }
                }

                let inputPerDayWeekend = ""

                for(const Work of workWeekend)
                {
                    inputPerDayWeekend += `
                    <label id="work_per_day">${Work.workName}
                        <input type="text" class="input_setting" name="${Work.workName}" id="input_PerDayWeekend" placeholder="하루근무개수">
                        <div id=set_time>
                            <input type="text" name="${Work.workName}" id="start_hour" placeholder="시작 시간">시
                            <input type="text" name="${Work.workName}" id="start_minute" placeholder="몇분">분
                            <select name="${Work.workName}" id="time_interval" size=1>
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
            case 6:
                pageCnt.textContent = `${page} / 10`;

                let valuePerDayWeekend = document.querySelectorAll('#input_PerDayWeekend');

                for(let i = 0; i < valuePerDayWeekend.length; i++)
                {
                    let hour = Number(valueStartHour[i].value);
                    let minute = Number(valueStartMinute[i].value);
                    minute = (minute === 30) ? 0.5 : 0; //시작 시간이 무조건 30분 단위라는 가정하에만
                    let firstWorkTime = hour + minute;

                    for(const Work of workWeekend)
                    {
                        if(valuePerDayWeekend[i].name === Work.workName)
                        {
                            Work.num = Number(valuePerDayWeekend[i].value);
                            Work.firstWorkTime = firstWorkTime;
                            Work.timeInterval = Number(valueTimeInterval[i].value);
                        }
                    }
                }
                createShiftData();
                
                let inputDayScore = "";
                let dayOfWeek = shiftData.mon;

                for(const work of dayOfWeek)
                {
                    inputDayScore += `
                    <div id="_work">
                        ${work.workName} ${work.time}
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=1> 1점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=2> 2점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=3> 3점
                    </div>
                    `;
                }

                shiftSetting.innerHTML = inputDayScore;

                _guide.textContent = "평일(월 ~ 목) 근무의 점수를 설정해 주세요. (점수가 높을수록 힘든 근무 입니다.)";
                page++;
                break;
            case 7:
                pageCnt.textContent = `${page} / 10`;

                // 평일 근무 점수를 월요일에 저장
                for(let i = 0; i < _workTotal.length; i++)
                {
                    let dayWorkScore = _workTotal[i].querySelectorAll('#work_score');
                    for(const score of dayWorkScore)
                    {
                        if(score.checked)
                        {
                            shiftData.mon[i].score = Number(score.value);
                        }
                    }
                }

                // 월 ~ 목 까지 근무 점수를 같게 함
                for(const dayOfWeek in shiftData)
                {
                    switch(dayOfWeek)
                    {
                        case "sat":
                            break;
                        case "sun":
                            break;
                        case "fri":
                            break;
                        case "mon":
                            break;
                        default:
                            for(let i = 0; i < shiftData[dayOfWeek].length; i++)
                            {
                                shiftData[dayOfWeek][i].score = shiftData.mon[i].score;
                            }
                    }
                }

                console.log(shiftData);
                
                let inputFriScore = "";
                let friday = shiftData.fri;

                for(const work of friday)
                {
                    inputFriScore += `
                    <div id="_work">
                        ${work.workName} ${work.time}
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=1> 1점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=2> 2점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=3> 3점
                    </div>
                    `;
                }

                shiftSetting.innerHTML = inputFriScore;
                _guide.textContent = "금요일 근무의 점수를 설정해 주세요. (점수가 높을수록 힘든 근무 입니다.)";
                page++;
                break;
            case 8:
                pageCnt.textContent = `${page} / 10`;

                // 금요일근무 점수 저장
                for(let i = 0; i < _workTotal.length; i++)
                {
                    let FriWorkScore = _workTotal[i].querySelectorAll('#work_score');
                    for(const score of FriWorkScore)
                    {
                        if(score.checked)
                        {
                            shiftData.fri[i].score = Number(score.value);
                        }
                    }
                }

                let inputSatScore = "";
                let satDay = shiftData.sat;

                for(const work of satDay)
                {
                    inputSatScore += `
                    <div id="_work">
                        ${work.workName} ${work.time}
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=1> 1점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=2> 2점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=3> 3점
                    </div>
                    `;
                }

                shiftSetting.innerHTML = inputSatScore;
                _guide.textContent = "토요일 근무의 점수를 설정해 주세요. (점수가 높을수록 힘든 근무 입니다.)";
                page++;
                break;
            case 9:
                pageCnt.textContent = `${page} / 10`;

                // 토요일근무 점수 저장
                for(let i = 0; i < _workTotal.length; i++)
                {
                    let satWorkScore = _workTotal[i].querySelectorAll('#work_score');
                    for(const score of satWorkScore)
                    {
                        if(score.checked)
                        {
                            shiftData.sat[i].score = Number(score.value);
                        }
                    }
                }

                let inputSunScore = "";
                let sunDay = shiftData.sun;

                for(const work of sunDay)
                {
                    inputSunScore += `
                    <div id="_work">
                        ${work.workName} ${work.time}
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=1> 1점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=2> 2점
                        <input type="radio" name="${work.workName}${work.time}" id="work_score" value=3> 3점
                    </div>
                    `;
                }

                shiftSetting.innerHTML = inputSunScore;
                _guide.textContent = "일요일 근무의 점수를 설정해 주세요. (점수가 높을수록 힘든 근무 입니다.)";
                page++;
                break;
            case 10:
                
                // 일요일근무 점수 저장
                /*
                for(let i = 0; i < _workTotal.length; i++)
                {
                    let sunWorkScore = _workTotal[i].querySelectorAll('#work_score');
                    for(const score of sunWorkScore)
                    {
                        if(score.checked)
                        {
                            shiftData.sun[i].score = Number(score.value);
                        }
                    }
                }
                console.log(shiftData);*/

                // 확인 시켜 주기
                let settingForm = document.querySelector('#shift_setting');
                if(settingForm.innerHTML)
                {
                    settingForm.remove();
                }

                checkShiftData(testshift);
                break;
            default:
                alert("홈페이지로 돌아가 주세요");
                break;
        }
    }

    function checkShiftData(testshift)
    {
        const root = document.querySelector('#check_shift');
        const table = document.createElement('table');
        table.classList.add('check_shift__table');
        root.append(table);

        // Draw table
        table.innerHTML = `
            <thead>
                <th>요일/시간</th>
                <th>월요일</th>
                <th>화요일</th>
                <th>수요일</th>
                <th>목요일</th>
                <th>금요일</th>
                <th>토요일</th>
                <th>일요일</th>
            </thead>
            <tbody>
            </tbody>
        `;

        for(let i = 0; i < testshift.mon.length; i++)
        {
            let row = "<tr>";
            row += `<td>${testshift.mon[i].workName}${testshift.mon[i].time}</td>`;
            for(const dayOfWeek in testshift)
            {
                if(testshift[dayOfWeek][i].score === undefined)
                {
                    row += `
                        <td colspan=7></td>
                    `;
                }
                else
                {
                    row += `
                        <td>${testshift[dayOfWeek][i].score}점</td>
                    `;
                }
            }
            row += "</tr>";
            table.querySelector('tbody').insertAdjacentHTML('beforeend', row);
        }
    }

    function createTimeData(typesOfWork, dayOfWeek)
    {
        let value ={};
        let startTime = 0;
        let endTime = 0;
        let workMinute = "00";
        let workTime = "";

        for(const Work of typesOfWork)
        {
            for(let i = 0; i < Work.num; i++)
            {
                startTime = Work.firstWorkTime + i * Work.timeInterval;
                endTime = startTime + Work.timeInterval;
                startTime = (startTime >= 24) ? startTime -= 24 : startTime;
                endTime = (endTime >= 24) ? endTime -= 24 : endTime;

                if(startTime % 1)
                {
                    workMinute = "30"; // re
                    startTime = Math.floor(startTime);
                    endTime = startTime + Work.timeInterval;
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    workTime = `${startTime}:${workMinute} ~ ${startTime + Work.timeInterval}:${workMinute}`;
                }
                else
                {
                    startTime = (startTime / 10 < 1) ? `0${startTime}` : String(startTime);
                    endTime = (endTime / 10 < 1) ? `0${endTime}` : String(endTime);
                    workTime = `${startTime}:${workMinute} ~ ${endTime}:${workMinute}`;
                }

                value = {workName: Work.workName, time: workTime, day: 0, score: 0};
                shiftData[dayOfWeek].push(value);
            }
        }
    }

    function createShiftData()
    {
        for(const dayOfWeek in shiftData)
        {
            switch(dayOfWeek)
            {
                case "sat":
                    createTimeData(workWeekend, dayOfWeek);
                    break;
                case "sun":
                    createTimeData(workWeekend, dayOfWeek);
                    break;
                default:
                    createTimeData(workDayOfWeek, dayOfWeek);
                    break;
            }
        }
        console.log(shiftData);
    }

    btnNext.addEventListener('click', () =>
    {
        createInputBox();
    });
}