$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    let resultsIDName = []
    let predVal = document.getElementById("Predict")
    let BloodBankVal = document.getElementById("BloodBank")
    
    btn.onclick = function(){
        let x = document.getElementById("closebb");
        x.style.display = "block";
        let hID = document.getElementById("hospitalId")
        let name = document.getElementById("name")
        getResults(hID.value,name.value)
                
        function getResults(hID,name){
            $.ajax({
                url:`/getResult`,
                method:'POST',
                data:{hospitalId:hID,Name:name},
                success:function(result){
                    console.log(result)
                    console.log(result[0].zipCode)
                    getAllBloodBanks(result[0].zipCode)
                },
                error: function(e) {
                    console.log(e);
                    alert("Either the id or the name is wrong")
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
                    closestBloodBanks(result,zC)
                },
                error:function(e){
                    console.log(e)
                }
            })
        }

        function closestBloodBanks(bloodBanks,zipCodeHospital){
            let distBloodBank = []
            let count = 0
            for(let i=0;i<bloodBanks.length;i++){
                getDist(zipCodeHospital,bloodBanks[i].zipCode,bloodBanks[i].Name,bloodBanks[i].BloodCampId)
            }

            function getDist(zipH,zipB,BloodBankName,BloodBankId){
                $.ajax({
                    url:`http://www.zipcodeapi.com/rest/HtCqfRiusxpErSXWvn5NIAo3VGXTO5mpbeemzzHFZn6my2CU42LJb5ZZmQKLF61W/distance.json/${zipH}/${zipB}/<units>`,
                    success:function(result){
                        count++;
                        distBloodBank.push({
                            distance: result.distance,
                            BankName: BloodBankName,
                            BankId : BloodBankId
                        })
                        if(count == bloodBanks.length)
                            getTop3Bloodbanks();
                    }
                })
            }

            function getTop3Bloodbanks(){
                let id1=-1 ,id2=-1, id3=-1, dist1=Number.MAX_SAFE_INTEGER, dist2=Number.MAX_SAFE_INTEGER, dist3=Number.MAX_SAFE_INTEGER;
                let name1,name2,name3;
                if(distBloodBank.length<=3){
                    for(let i=0;i<distBloodBank.length;i++){
                        resultsIDName.push({
                            id:distBloodBank[i].BankId,
                            name:distBloodBank[i].BankName
                        })
                    }
                }
                else{
                    for(let i=0;i<distBloodBank.length;i++){
                        if(dist1>distBloodBank[i].distance){
                            dist3 = dist2
                            id3=id2
                            name3=name2
                            dist2 = dist1
                            id2 = id1
                            name2=name1
                            dist1 = distBloodBank[i].distance
                            id1 = distBloodBank[i].BankId
                            name1 = distBloodBank[i].BankName
                        }
                        else if(dist2>distBloodBank[i].distance){
                            dist3 = dist2
                            id3 = id2
                            name3 = name2
                            dist2 = distBloodBank[i].distance
                            id2 = distBloodBank[i].BankId
                            name2 = distBloodBank[i].BankName
                        }
                        else if(dist3>distBloodBank[i].distance){
                            name3 = distBloodBank[i].BankName
                            dist3 = distBloodBank[i].distance
                            id3 = distBloodBank[i].BankId
                        }
                    }
                    resultsIDName.push({
                        id:id1,
                        name:name1
                    })
                    resultsIDName.push({
                        id:id2,
                        name:name2
                    })
                    resultsIDName.push({
                        id:id3,
                        name:name3
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
            }
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
                    data:{BloodCampId:resultsIDName[i].id, age:AgeGrp[j],gender:"Any",bloodGrp:"Any",BloodDonNxt:predVal.value},
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
                    data:{BloodCampId:resultsIDName[i].id, age:"Any",gender:GenderGrp[j],bloodGrp:"Any",BloodDonNxt:predVal.value},
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
                    data:{BloodCampId:resultsIDName[i].id, age:"Any",gender:"Any",bloodGrp:BgGrp[i],BloodDonNxt:predVal.value},
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
            console.log("Age Count Here ",BgJsonObj)

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
