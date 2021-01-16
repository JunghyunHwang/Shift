'use strict'
{    
    let shift = {};
    let typesOfShift = {};
    let thisWeek = [];

    function renderDateButton(date)
    {
        let todayWorker = {};

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

        renderingTable(todayWorker);
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

        let classDate = document.querySelectorAll('.btn_date');

        for(let i = 0; i < classDate.length; i++)
        {
            classDate[i].addEventListener('click', () =>
            {
                renderDateButton(classDate[i].textContent);
            });
        }
    }

    function renderingTable(todayWorkTypes)
    {
        let tableLen = 0;

        for(const work in todayWorkTypes)
        {
            if(todayWorkTypes[work].length > tableLen)
            {
                tableLen = todayWorkTypes[work].length;
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
        // Draw header
        let tableHeader = "<thead>";
        let numDuoWork = 0;

        for(const workType in todayWorkTypes) // re change name workType
        {
            if(todayWorkTypes[workType][0].duo)
            {
                tableHeader += `<th class="work_name" colspan=${3 * todayWorkTypes[workType][0].duo}>${workType}</th>`;
                numDuoWork++;
            }
            else
            {
                tableHeader += `<th class="work_name" colspan=3>${workType}</th>`;
            }
        }

        tableHeader += `
        </thead>
        `;
        table.innerHTML = tableHeader;
        
        // Draw body
        let tableBody = "<tbody><tr class='header'>";

        let numberOfWorkTypes = Object.keys(todayWorkTypes).length + numDuoWork;

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

        for(let i = 0; i < tableLen; i++)
        {
            let row = "<tr>"
            for(const workType in todayWorkTypes)
            {
                if(todayWorkTypes[workType][i] === undefined)
                {
                    if(todayWorkTypes[workType][0].duo)
                    {
                        row += `
                        <td class="empty" colspan=${3 * todayWorkTypes[workType][0].duo}></td>
                        `;
                    }
                    else
                    {
                        row += `
                        <td class="empty" colspan=3></td>
                        `;
                    }
                }
                else if(todayWorkTypes[workType][i].duo)
                {
                    for(let j = 0; j < todayWorkTypes[workType][i].duo; j++)
                    {
                        row += `
                        <td class="time">${todayWorkTypes[workType][i].time}</td>
                        <td class="name">${todayWorkTypes[workType][i].who[j]}</td>
                        <td class="sign_here"></td>
                        `;
                    }
                }
                else
                {
                    row += `
                    <td class="time">${todayWorkTypes[workType][i].time}</td>
                    <td class="name">${todayWorkTypes[workType][i].who}</td>
                    <td class="sign_here"></td>
                    `;
                }
            }
            row += "</tr>";
            table.querySelector('tbody').insertAdjacentHTML('beforeend', row);
        }
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
        
        for(const type in typesOfShift)
        {
            typesOfShift[type].sort(function(a, b)
            {
                return b['num'] - a['num'];
            });
        }

        createDate();
    }
}