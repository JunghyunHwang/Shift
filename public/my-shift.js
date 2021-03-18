'use strict'
{
    const API_URL = '/api/get/shift';
    const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const YOIL = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let shift = {};
    let thisWeek = [];
    let lastWeek = [];

    function createBtnWeeks()
    {
        let weeks = document.getElementById('weeks');

        if(weeks.textContent)
        {
            weeks.textContent = null;
        }

        for(let week in shift)
        {
            let btnWeeks = document.createElement('button');
            // let reg = /\d{4}[-](\d{1,2}[-]\d{1,2})/g;
            // let startResult = reg.exec(shift[week].mon[0].date);
            // let endResult = reg.exec(shift[week].sun[0].date);
            // let startDate = startResult[1];
            // let EndDate = endResult[1];
            btnWeeks.textContent = `${shift[week].mon[0].date} ~ ${shift[week].sun[0].date}`;
            btnWeeks.classList.add('btn_week');
            weeks.append(btnWeeks);
        }

        btnWeeksAddListener();
    }

    function btnWeeksAddListener()
    {
        let classWeek = document.querySelectorAll('.btn_week');

        if(classWeek.length === 1)
        {
            classWeek[0].addEventListener('click', () =>
            {
                createBtnDate(thisWeek);
            });
        }
        else
        {
            for(let i = 0; i < classWeek.length; i++)
            {
                switch(i)
                {
                    case 0:
                        classWeek[i].addEventListener('click', () =>
                        {
                            createBtnDate(lastWeek);
                        });
                        break;
                    case 1:
                        classWeek[i].addEventListener('click', () =>
                        {
                            createBtnDate(thisWeek);
                        });
                        break;
                    default:
                        confirm("Unknown types");
                        break;
                }
            }
        }
    }

    function createBtnDate(week)
    {
        let dates = document.getElementById('select_Week');

        if(dates.textContent)
        {
            dates.textContent = null;
        }

        for(let i = 0; i < week.length; i++)
        {
            let btnDate = document.createElement('button');
            let dayOfWeek = WEEK.indexOf(week[i].day);
            btnDate.textContent = `${week[i].date} ${YOIL[dayOfWeek]}`;
            btnDate.classList.add('btn_date');
            dates.append(btnDate);
        }

        btnDateAddListener(week);
    }

    function btnDateAddListener(week)
    {
        let classDate = document.querySelectorAll('.btn_date');
        let targetWeek = {};

        for(let weekType in shift) // Change name
        {
            if(shift[weekType].mon[0].date === week[0].date)
            {
                targetWeek = shift[weekType];
                break;
            }
        } 

        for(let i = 0; i < classDate.length; i++)
        {
            let date = classDate[i].textContent.split(" ");
            let index = YOIL.indexOf(date[1]);
            
            classDate[i].addEventListener('click', () =>
            {
                classifyByWork(targetWeek, date[0], WEEK[index], week);
            });
        }
    }

    function classifyByWork(targetWeek, date, today, week)
    {
        let todayWorker = {};

        // How many work types in today?
        for(const work of targetWeek[today])
        {
            if(todayWorker[work.name])
            {
                continue;
            }
            else
            {
                todayWorker[work.name] = [];
            }
        }

        for(const workName in todayWorker)
        {
            for(const work of targetWeek[today])
            {
                if(workName === work.name)
                {
                    todayWorker[workName].push(work);
                }
            }
        }

        todayWorker.dayOfWeek = today;
        todayWorker.date = date;

        renderingTable(todayWorker, week);
    }

    function renderingTable(todayShift, week)
    {
        let tableLen = 0;
        let index = WEEK.indexOf(todayShift.dayOfWeek);
        let dayOfWeek = YOIL[index];
        let date = todayShift.date;

        delete todayShift.dayOfWeek;
        delete todayShift.date;

        for(const workName in todayShift)
        {
            if(todayShift[workName].length > tableLen)
            {
                tableLen = todayShift[workName].length;
            }
        }
        
        let isItTable = document.querySelector('.table-shift__table');

        if(isItTable)
        {
            isItTable.remove();
        }

        const root = document.querySelector('.table-shift');
        const table = document.createElement('table');
        table.classList.add('table-shift__table');
        root.append(table);

        // Draw table
        // shiftName
        let tableHeader = "<thead>";
        let numDuoWork = 0;
        let totalColspan = 0;

        for(const workName in todayShift)
        {
            if(todayShift[workName][0].duo)
            {
                tableHeader += `<th class="work_name" colspan=${3 * todayShift[workName][0].duo}>${workName}</th>`;
                numDuoWork++;
                totalColspan += (3 * todayShift[workName][0].duo);
            }
            else
            {
                tableHeader += `<th class="work_name" colspan=3>${workName}</th>`;
                totalColspan += 3;
            }
        }

        tableHeader += `
        </thead>
        `;
        table.innerHTML = tableHeader;
        const theaders = document.querySelector('thead');
        let title = `
        <tr>
            <th id="table_title" colspan=${totalColspan}>
                경 계 작 전 명 령 서
            </th>
        </tr>
        <tr>
            <th id="table_date" colspan=${totalColspan}>
                ${date}   ${dayOfWeek}
            </th>
        </tr>
        `;
        
        theaders.insertAdjacentHTML('afterbegin', title);
        // Draw body
        // information header
        let numberOfWorkTypes = Object.keys(todayShift).length + numDuoWork;
        let tableBody = "<tbody><tr class='table_info'>";

        for(let i = 0; i < numberOfWorkTypes; i++)
        {
            tableBody += `
            <td class="header_time">시간</td>
            <td class="header_name">이름</td>
            <td class="header_sign_here">서명</td>
            `;
        }

        tableBody += "</tr></tbody>";
        table.innerHTML += tableBody;

        // Draw worker
        for(let i = 0; i < tableLen; i++)
        {
            let row = "<tr class='table_who'>"
            for(const workName in todayShift)
            {
                if(todayShift[workName][i] === undefined)
                {
                    // continue
                    if(todayShift[workName][0].duo)
                    {
                        row += `
                        <td class="empty" colspan=${3 * todayShift[workName][0].duo}></td>
                        `;
                    }
                    else
                    {
                        row += `
                        <td class="empty" colspan=3></td>
                        `;
                    }
                }
                else if(todayShift[workName][i].duo)
                {
                    let len = todayShift[workName][i].who.length;
                    for(let j = 0; j < len; j++)
                    {
                        row += `
                        <td class="time">${todayShift[workName][i].time}</td>
                        <td class="name">${todayShift[workName][i].who[j]}</td>
                        <td class="sign_here"></td>
                        `;
                    }
                }
                else
                {
                    row += `
                    <td class="time">${todayShift[workName][i].time}</td>
                    <td class="name">${todayShift[workName][i].who}</td>
                    <td class="sign_here"></td>
                    `;
                }
            }
            row += "</tr>";
            table.querySelector('tbody').insertAdjacentHTML('beforeend', row);
        }

        // create print button
        const parent = document.getElementById('btn-print');
        
        if(parent.innerHTML)
        {
            parent.innerHTML = "";
        }

        const button = document.createElement('button');
        button.textContent = "프린트";
        button.id = 'btn_print';
        parent.append(button);

        const BTN_PRINT = document.getElementById('btn_print');
        BTN_PRINT.addEventListener('click', () =>
        {
            printPartial(week);
        });
    }

    function printPartial(week)
    {
        let initBody = document.body.innerHTML;
        let printTag = document.getElementById('print-table').innerHTML;
        document.body.innerHTML = printTag;
        window.print();
        document.body.innerHTML = initBody;

        // 이벤트 리스너들이 작동을 안함
        btnWeeksAddListener();
        btnDateAddListener(week);
        const BTN_PRINT = document.getElementById('btn_print');
        BTN_PRINT.addEventListener('click', () =>
        {
            printPartial(week);
        });
    }

    function createWeekDate(date)
    {
        let startDate = new Date(date);
        let week = [];

        for(let i = 0; i < 7; i++)
        {
            let year = startDate.getFullYear();
            let month = Number(startDate.getMonth()) + 1;
            let date = startDate.getDate();
            let day = startDate.getDay();

            week[i] = {
                date: `${year}-${month}-${date}`,
                day: WEEK[day]
            }
            startDate.setDate(startDate.getDate() + 1);
        }

        return week;
    }

    async function getShiftData()
    {
        const RESPONSE = await fetch(API_URL);
        const SHIFT_DATA = await RESPONSE.json();

        if(SHIFT_DATA.status)
        {
            if(SHIFT_DATA.lastWeek !== null)
            {
                let lastWeekShift = JSON.parse(SHIFT_DATA.lastWeek);
                shift.lastWeekShift = lastWeekShift;
                lastWeek = createWeekDate(shift.lastWeekShift.mon[0].date);
            }

            let thisWeekShift = JSON.parse(SHIFT_DATA.thisWeek);
            shift.thisWeekShift = thisWeekShift;
            thisWeek = createWeekDate(shift.thisWeekShift.mon[0].date);

            createBtnWeeks();
        }
        else
        {
            const ROOT = document.querySelector('#weeks');
            let noData = document.createElement('div');
            noData.id = "no_data";
            noData.textContent = "이전 근무가 없습니다.";
            ROOT.append(noData);
        }
    }
    
    getShiftData();
}