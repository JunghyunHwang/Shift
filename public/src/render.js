{
    'use strict';

    function renderingTable(data)
    {
        const root = document.querySelector('.table-shift');

        const table = document.createElement('table');
    
        table.classList.add('table-shift__table');
        
        table.innerHTML = `
            <thead>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <td></td>
                </tr>
            </tbody>
        `;
    
        root.append(table);
        console.log(root);

        table.querySelector('thead tr').textContent = "";
        table.querySelector('tbody').textContent = "";

        console.log(data);

        for(const header of data.headers)
        {
            table.querySelector('thead tr').insertAdjacentHTML('beforeend', `<th>${header}</th>`);
        }

        for(const row of data.rows)
        {
            console.log(row);
            table.querySelector('tbody').insertAdjacentHTML('beforeend', `
                <tr>
                    ${ row.map(col => `<td>${ col }</td>`).join("") }
                </tr>
            `)
        }
    }
}