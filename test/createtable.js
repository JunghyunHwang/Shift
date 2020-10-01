let btnSetShift = document.getElementById('setShift');
let tbody = document.getElementById('contents');
let shiftName = ["cctv04", "cctv06", "cctv08", "cctv10", "cctv12", "cctv14", "cctv16", "cctv18", "cctv20", "cctv22", "nightshift_Firstfirst", "nightshift_Second", "nightshift_Third", "nightshift_Fourth", "guardhouse1", "guardhouse2"];

function createTable()
{
    let count = document.getElementById('in_shiftCount').value;
    let workCount = 0;

    for(let i = 0; i < count; i++)
    {
        let tableRow = document.createElement('tr');
        tableRow.id = i;
        for(let j = 0; j < 8; j++)
        {
            let td = document.createElement('td');
            if(j === 0)
            {
                td.className = shiftName[workCount];
                td.textContent = shiftName[workCount];
            }
            else
            {
                td.id = yoill[j - 1];
            }
            tableRow.appendChild(td);
        }
        workCount++;
        tbody.appendChild(tableRow);
    }
}

btnSetShift.addEventListener("click", createTable);