'use strict'
{
    const API_URL = '/api/pick/shift';
    let shift = {};
    let workInfo = {};
    let thisWeek = [];
    const YOIL = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    function classifyByWork(date, today)
    {
        let todayWorker = {};

        // How many work types in today?
        for(const work of shift[today])
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
            for(const work of shift[today])
            {
                if(workName === work.name)
                {
                    todayWorker[workName].push(work);
                }
            }
        }

        todayWorker.dayOfWeek = today;
        todayWorker.date = date;

        renderingTable(todayWorker);
    }

    function createDate()
    {
        uploadFile.remove();
        let btnDate = document.getElementById('thisWeek');
        
        if(btnDate.textContent)
        {
            btnDate.textContent = null;
        }

        for(let i = 0; i < thisWeek.length; i++)
        {
            let date = document.createElement('button');
            let btnDayOfWeek = WEEK.indexOf(thisWeek[i].day);
            date.textContent = `${thisWeek[i].date} ${YOIL[btnDayOfWeek]}`;
            date.classList.add('btn_date');
            btnDate.append(date);
        }

        btnDateAddListener();
    }

    function btnDateAddListener()
    {
        let classDate = document.querySelectorAll('.btn_date');

        for(let i = 0; i < classDate.length; i++)
        {
            let date = classDate[i].textContent.split(" ");
            let index = YOIL.indexOf(date[1]);

            classDate[i].addEventListener('click', () =>
            {
                classifyByWork(date[0], WEEK[index]);
            });
        }
    }

    function renderingTable(todayShift)
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
            printPartial();
        });
    }

    function printPartial()
    {
        let initBody = document.body.innerHTML;
        let printTag = document.getElementById('print-table').innerHTML;
        document.body.innerHTML = printTag;
        window.print();
        document.body.innerHTML = initBody;

        // 이벤트 리스너들이 작동을 안함
        btnDateAddListener();
        const BTN_PRINT = document.getElementById('btn_print');
        BTN_PRINT.addEventListener('click', () =>
        {
            printPartial();
        });
    }

    let uploadFile = document.getElementById('upload_file');

    uploadFile.addEventListener('change', (e) =>
    {
        let files = e.target.files;
        let f;
        let temp = [];
        let membersData = [];
        
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
                    const inputData = XLSX.utils.sheet_to_json(workbook.Sheets[item]);

                    if(files.length < 2)
                    {
                        membersData = inputData;
                        pickMember(membersData);
                    }
                    else if(!temp.length)
                    {
                        temp = inputData;
                    }
                    else if(inputData > temp)
                    {
                        for(const tempMember of temp)
                        {
                            for(const member of inputData)
                            {
                                if(member.name === tempMember.name)
                                {
                                    membersData.push(Object.assign(member, tempMember));
                                    let cutNum = inputData.indexOf(member);
                                    inputData.splice(cutNum, 1);
                                    break;
                                }
                                else
                                {
                                    continue;
                                }
                            }
                        }

                        // 남는 넘들임
                        for(const member of inputData)
                        {
                            membersData.push(member);
                        }

                        pickMember(membersData);
                    }
                    else
                    {
                        for(const member of inputData)
                        {
                            for(const tempMember of temp)
                            {
                                if(member.name === tempMember.name)
                                {
                                    membersData.push(Object.assign(member, tempMember));
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
                            membersData.push(tempMember);
                        }

                        pickMember(membersData);
                    }
                });
            };

            reader.readAsBinaryString(f);
        }
    });

    async function pickMember(membersData)
    {
        const OPTIONS =
        {
            method: 'POST',
            headers:
            {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(membersData)
        };

        const RESPONSE = await fetch(API_URL, OPTIONS);
        const PICK_DATA = await RESPONSE.json();
        thisWeek = PICK_DATA.thisWeek;
        workInfo = PICK_DATA.work_info;
        shift = PICK_DATA.shift;

        for(let type in workInfo) // re 이 과정을 한번만 할 수 있을까?
        {
            workInfo[type].sort(function(a, b)
            {
                return b['num'] - a['num'];
            });
        }

        // re
        for(let dayOfWeek in shift)
        {
            let todayWorker = [];

            for(let work of shift[dayOfWeek])
            {
                todayWorker.push(work.who);
            }

            console.log(`${dayOfWeek} : ${todayWorker}`);
        }

        createDate();
    }
}