$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    let resultsIDName = []
    let predVal = document.getElementById("Predict")
    let BloodBankVal = document.getElementById("BloodBank")
    let month = document.getElementById('month')
    btn.onclick = function(){
        let x = document.getElementById("allbb");
        x.style.display = "block";
        let hID = document.getElementById("hospitalId")
        let password = document.getElementById("password")
        getResults(hID.value,password.value)
                
        function getResults(hID,password){
            $.ajax({
                url:`/getResult`,
                method:'POST',
                data:{hospitalId:hID,password:password},
                success:function(result){
                    console.log(result)
                    console.log(result[0].zipCode)
                    getAllBloodBanks(result[0].zipCode)
                },
                error: function(e) {
                    console.log(e);
                    alert("Either the id or the password is wrong")
                }
            })
        }

        function getAllBloodBanks(zC){
            $.ajax({
                url:`/Analysis/getall`,
                method:'GET',
                success:function(result){
                   
                    resultRecieved = true
                    // Api Call to zip distance 
                    console.log(result)
                    for(let i=0;i<result.length;i++){
                        resultsIDName.push({
                            id:result[i].BloodCampId,
                            name:result[i].Name
                        })
                    }
                    let listBank = document.getElementById('listBank')
                    for(let i=0;i<resultsIDName.length;i++){
                        let li = document.createElement('li')
                        let text = document.createTextNode(resultsIDName[i].name)
                        li.appendChild(text)
                        listBank.appendChild(li)
                    }
                    appendBloodBanks();
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
    }

    function appendBloodBanks(){
        let anyoption = document.createElement('option')
        let anytext = document.createTextNode("Any")
        anyoption.appendChild(anytext)
        BloodBankVal.appendChild(anyoption)
        for(let i=0;i<resultsIDName.length;i++){
            let option = document.createElement('option')
            let text = document.createTextNode(resultsIDName[i].name)
            option.appendChild(text)
            BloodBankVal.appendChild(option)
        }
    }


    var myAgeChart;
    var myGenderChart;
    var myBloodGpChart;    

    let age = document.getElementById('age')
    age.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayAgeGraph");
        x.style.display = "block";
        let AgeGrp = [10,20,30,40,50]
        let AgeCount = [0,0,0,0,0]
        let AgeJsonObj = {}
        let count = 0
        for(let i=0;i<resultsIDName.length;i++){
            for(let j=0;j<AgeGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsIDName[i].id,month:month.value, age:AgeGrp[j],gender:"Any",bloodGrp:"Any",BloodDonNxt:predVal.value},
                    success:function(result){
                        if(BloodBankVal.value==resultsIDName[i].name || BloodBankVal.value=="Any")
                            AgeCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsIDName.length * AgeGrp.length))
                            DisplayAge()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayAge(){
            for(let i=0;i<AgeGrp.length;i++)
            AgeJsonObj[AgeGrp[i]]=AgeCount[i]
            console.log("Age Count Here ",AgeJsonObj)

            if (myAgeChart) {
                myAgeChart.destroy();
            }

            var ctx = document.getElementById('ageBarGraph').getContext('2d');
            myAgeChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['10-20', '20-30', '30-40', '40-50', 'Above 50'],
                    datasets: [{
                        label: 'Number of donors in different age groups',
                        data: AgeCount,
                        backgroundColor: [
                            '#003f5c','#58508d','#bc5090','#ff6361','#ffa600'
                        ],
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
    }


    let gender = document.getElementById('gender')
    gender.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayGenderGraph");
        x.style.display = "block";
        let GenderGrp = ['M','F']
        let GenderCount = [0,0]
        let GenderJsonObj = {}
        let count = 0;
        for(let i=0;i<resultsIDName.length;i++){
            for(let j=0;j<GenderGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsIDName[i].id, month:month.value,age:"Any",gender:GenderGrp[j],bloodGrp:"Any",BloodDonNxt:predVal.value},
                    success:function(result){
                        if(BloodBankVal.value==resultsIDName[i].name || BloodBankVal.value=="Any")
                            GenderCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsIDName.length * GenderGrp.length))
                            DisplayGender()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayGender(){
            for(let i=0;i<GenderGrp.length;i++)
            GenderJsonObj[GenderGrp[i]]=GenderCount[i]
            console.log("Gender Count Here ",GenderJsonObj)

            if (myGenderChart) {
                myGenderChart.destroy();
            }

            var ctx = document.getElementById('genderPieChart').getContext('2d');
            myGenderChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Male','Female'],
                    datasets: [{
                        label: 'Number of donors gender wise',
                        data: GenderCount,
                        backgroundColor: [
                            'rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)'
                        ],
                    }]
                },
            });
        }    
    }


    let BloodGrp = document.getElementById('BloodGrp')
    BloodGrp.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        let x = document.getElementById("displayBloodGpGraph");
        x.style.display = "block";
        let BgGrp = ["O+","O-","B-","B+","AB+","AB-"]
        let BgCount = [0,0,0,0,0,0]
        let BgJsonObj = {}
        let count = 0
        for(let i=0;i<resultsIDName.length;i++){
            for(let j=0;j<BgGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsIDName[i].id, month:month.value,age:"Any",gender:"Any",bloodGrp:BgGrp[j],BloodDonNxt:predVal.value},
                    success:function(result){
                        if(BloodBankVal.value==resultsIDName[i].name || BloodBankVal.value=="Any")
                            BgCount[j] += parseInt(result)
                        count++;
                        if(count== parseInt(resultsIDName.length * BgGrp.length))
                            DisplayBg()
                    },
                    error:function(e){
                        console.log(e)
                    }
                })
            }
        }

        function DisplayBg(){
            for(let i=0;i<BgGrp.length;i++)
            BgJsonObj[BgGrp[i]]=BgCount[i]
            console.log("Blood group Count Here ",BgJsonObj)

            if (myBloodGpChart) {
                myBloodGpChart.destroy();
            }

            var ctx = document.getElementById('bloodGrpBarGraph').getContext('2d');
            myBloodGpChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: BgGrp,
                    datasets: [{
                        label: 'Number of different blood group donors',
                        data: BgCount,
                        backgroundColor: [
                            '#ffa600','#ff6361','#bc5090','#36a2eb','#58508d','#003f5c'
                        ],
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }  
    }

})
