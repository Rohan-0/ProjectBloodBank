$(document).ready(function(){
    display()
})

function display(){
    $.ajax({
        url:`display`,
        method:'get',
        success:function(result){
            console.log(result);
            displayHTMLtables(result);
        }
    })
}

function displayHTMLtables(data){
    var table = document.createElement('table');
    table.setAttribute('class','table table-bordered');
    var divTable = document.getElementById('ForTable');
    var arr = ['Donor_id','BloodCampId','BloodGrp','Age','Gender','MonthsLastDon','TotDon','VolDon'
        ,'MonthsFirstDon','BloodDonNxt'];
    var thead = document.createElement('thead');
    var trHead = document.createElement('tr');
    for(let i=0;i<arr.length;i++){
        let tdHead=document.createElement('th');
        let textNode=document.createTextNode(arr[i]);
        tdHead.appendChild(textNode);
        trHead.appendChild(tdHead);
    }

    thead.appendChild(trHead);
    table.appendChild(thead);

    for(let i=0;i<data.length;i++){
        let rowArr = Object.values(data[i]);
        console.log(rowArr);
        let tr = document.createElement('tr');
        for(let j=0;j<rowArr.length-2;j++){
            let td = document.createElement('td');
            let text = document.createTextNode(rowArr[j]);
            td.appendChild(text);
            tr.append(td);
        }
        table.appendChild(tr);
    }
    divTable.appendChild(table);
}
