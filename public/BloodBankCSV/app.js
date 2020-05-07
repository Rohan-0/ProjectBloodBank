$(document).ready(function(){
    var btn=document.getElementById('btnSubmit');
    var id = document.getElementById('id');
    var password = document.getElementById('password');
    var month = document.getElementById('month');
    var predVal = document.getElementById('CSVData');
    let divTable = document.getElementById('ForTable');
    var resultsIDName = []
    var resultRecieved = false;
    btn.onclick=function(){        
        CheckBloodCamp();
        function CheckBloodCamp(){
            console.log("BloodBank")
            var data={BloodCampId:id.value,password:password.value}
            $.ajax({
                url:`/CheckRowCamp`,
                method:"POST",
                data:data,
                success: function(result){
                    resultRecieved=true
                    resultsIDName.push({id:id.value})
                    FetchMonths()
                },
                error:function(e){
                    month.innerHTML = "";
                    divTable.innerHTML = "";
                    alert("Either the id or the password is incorrect");
                }
            })
            return false;
        }
        
        function FetchMonths(){
            $.ajax({
                url:'/fetchMonths',
                method:'POST',
                data:{id:id.value},
                success:function(result){
                    console.log(result)
                    month.innerHTML = "";
                    divTable.innerHTML = "";
                    for(let i=0;i<result.length;i++){
                        let option = document.createElement('option')
                        let text = document.createTextNode(result[i].Month)
                        option.appendChild(text)
                        month.appendChild(option)
                    }
                }
            })
        }

        let x = document.getElementById("allbb");
        x.style.display = "block";
    }

    predVal.onclick = function(){
        $.ajax({
            url:'/getDonors',
            method:"POST",
            data:{CampId:id.value,month:month.value},
            success:function(result){
                displayTable(result)
            }
        })

        function displayTable(data){
            var arr = ['Donor_id','Gender','BloodGrp','Age','MonthsLastDon','TotDon','VolDon'
                ,'MonthsFirstDon','BloodDonNxt'];

            divTable.innerHTML = "";
            let table = document.createElement('table');
            table.setAttribute('class','table table-bordered');
            let thead = document.createElement('thead');
            let trHead = document.createElement('tr')
            for(let i in arr){
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
    }

})