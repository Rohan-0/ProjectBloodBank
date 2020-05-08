$(document).ready(function(){
    $.ajax({
        url:'/getAll',
        method:"POST",
        success:function(result){
            displayTable(result);
        }
    })

    function displayTable(data){
        let arr = ["Name","Blood Bank ID","Area","Zip Code"];
        let divTable = document.getElementById('ForTable');
        let table = document.createElement('table');
        table.setAttribute('class','table table-bordered');
        let thead = document.createElement('thead');
        let trHead = document.createElement('tr');
        for(let i=0;i<arr.length;i++){
            let th = document.createElement('th');
            let text = document.createTextNode(arr[i]);
            th.appendChild(text);
            trHead.appendChild(th);
        }
        thead.appendChild(trHead);
        table.appendChild(thead);

        for(let i=0;i<data.length;i++){
            let tr = document.createElement('tr');
            for(let key in data[i]){
                let td = document.createElement('td');
                let text = document.createTextNode(data[i][key]);
                td.appendChild(text);
                tr.appendChild(td);
            }
            table.appendChild(tr);
        }
        divTable.appendChild(table);
    }
})