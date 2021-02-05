'use strict'
{
    function renderDateButton(date)
    {
        let todayWorker = {};
        let yoil = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
        let today = "";

        for(let i = 0; i < thisWeek.length; i++)
        {
            if(thisWeek[i] === date)
            {
                today = yoil[i];
            }
        }

        for(const dayOfWeek in shift)
        {
            if(shift[dayOfWeek][0].day === date)
            {
                switch(dayOfWeek)
                {
                    case "sat":
                        for(const work of typesOfShift.weekend)
                        {
                            todayWorker[work.workName] = [];
                        }
                        break;
                    case "sun":
                        for(const work of typesOfShift.weekend)
                        {
                            todayWorker[work.workName] = [];
                        }
                        break;
                    default:
                        for(const work of typesOfShift.weekday)
                        {
                            todayWorker[work.workName] = [];
                        }
                        break;
                }

                for(const workName in todayWorker)
                {
                    for(const work of shift[dayOfWeek])
                    {
                        if(workName === work.workName)
                        {
                            todayWorker[workName].push(work);
                        }
                    }
                }
            }
        }

        renderingTable(todayWorker, today, date);
    }

    function createDate()
    {
        uploadFile.remove();
        let week = document.getElementById('thisWeek');
        
        if(week.textContent)
        {
            week.textContent = null;
        }

        for(let i = 0; i < thisWeek.length; i++)
        {
            let date = document.createElement('button');
            date.textContent = thisWeek[i];
            date.classList.add('btn_date');
            week.append(date);
        }

        btnDateAddListener();
    }

    function btnDateAddListener()
    {
        let classDate = document.querySelectorAll('.btn_date');

        for(let i = 0; i < classDate.length; i++)
        {
            classDate[i].addEventListener('click', () =>
            {
                renderDateButton(classDate[i].textContent);
            });
        }
    }

    function renderingTable(todayShift, today, date)
    {
        let tableLen = 0;

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
        let dayOfWeek = today;

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
        let tableBody = "<tbody><tr class='table_info'>";

        let numberOfWorkTypes = Object.keys(todayShift).length + numDuoWork;

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

        const btnPrint = document.getElementById('btn_print');
        btnPrint.addEventListener('click', () =>
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
        const btnPrint = document.getElementById('btn_print');
        btnPrint.addEventListener('click', () =>
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

                    if(files.length < 2)
                    {
                        members = membersData;
                        checkPossibleWork(members);
                        getData(members);
                    }
                    else if(!temp.length)
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
                        checkPossibleWork(members);
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

                        checkPossibleWork(members);
                        getData(members);
                    }
                });
            };

            reader.readAsBinaryString(f);
        }
    });

    function checkPossibleWork(members)
    {
        for(const member of members)
        {
            if(member.work)
            {
                member.pw = member.work.split(" ");
                delete member.work;
            }
        }
    }

    const api_url = '/api/shift';
    let shift = {};
    let typesOfShift = {};
    let thisWeek = [];

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
        thisWeek = shiftData.thisWeek;
        typesOfShift = shiftData.typesOfShift;
        shift = shiftData.shift;
        
        for(const type in typesOfShift) // re 이 과정을 한번만 할 수 있을까?
        {
            typesOfShift[type].sort(function(a, b)
            {
                return b['num'] - a['num'];
            });
        }

        for(const dayOfWeek in shift)
        {
            let todayWorker = [];
            for(const work of shift[dayOfWeek])
            {
                todayWorker.push(work.who);
            }
            console.log(`${dayOfWeek} : ${todayWorker}`);
        }

        createDate();
    }
}