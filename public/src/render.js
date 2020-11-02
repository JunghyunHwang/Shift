{
    let btnSetShift = document.getElementById('setShift');
    
    function renderingTable(root)
    {
        const table = root.querySelector('.table-shift__table');
        console.log(table);
    }

    function createRoot()
    {
        const root = document.querySelector('.table-shift');

        const table = document.createElement('table');
    
        table.classList.add('table-shift__table');
        
        table.innerHTML = `
            <thead>
                <tr>
                    <th>시간 / 요일</th>
                    <th colspan="2">월요일</th>
                    <th colspan="2">화요일</th>
                    <th colspan="2">수요일</th>
                    <th colspan="2">목요일</th>
                    <th colspan="2">금요일</th>
                    <th colspan="2">토요일</th>
                    <th colspan="2">일요일</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        `;
    
        root.append(table);
        renderingTable(root);
    }

    createRoot();

    btnSetShift.addEventListener("click", () =>
    {
        pick();
    });
}