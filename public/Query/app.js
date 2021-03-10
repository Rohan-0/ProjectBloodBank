$(document).ready(function(){
    let btn = document.getElementById("btnSubmit")
    var resultRecieved = false
    let resultsIDName = []
    let queryBtn = document.getElementById('QueryBtn')

    btn.onclick = function(){
        let x = document.getElementById("closebb");
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
                    closestHospitals(result[0].zipCode)
                },
                error: function(e) {
                    console.log(e);
                    alert("Either the id or the name is wrong")
                }
            })
        }

        function closestHospitals(zC){
            $.ajax({
                url:`/Query/getall?zipCode=${zC}`,
                method:'GET',
                success:function(result){
                    resultRecieved = true
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
                    url:`https://www.zipcodeapi.com/rest/XQQyYcDw0K4JlD1nThsWhhXUckgYUVrbBLcXv20SbUSnmZeT0GDfZxWvaNe6wHaC/distance.json/${zipH}/${zipB}/`,
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
            }
        }
    }


    queryBtn.onclick = function(){
        let count =0;
        if(resultRecieved==false){
            alert("Please Enter the hospital details")
            return ;
        }
        let age = document.getElementById('Age')
        let gender = document.getElementById('Gender')
        let bloodGrp = document.getElementById('bloodGrp')
        let answer = 0
        let index;
        let len = resultsIDName.length
        for(let i=0; i<resultsIDName.length;i++){
            countDonors(i)
        }

        function countDonors(i){
            $.ajax({
                url:'/countDonors',
                method:"POST",
                data:{age:age.value,gender:gender.value,bloodGrp:bloodGrp.value,BloodCampId:resultsIDName[i].id},
                success:function(result){
                    if(parseInt(result)>parseInt(answer)){
                        index=resultsIDName[i].id;
                        answer=result;
                    }
                    count++;
                    if(count==len)
                        displayResult()
                },
                error:function(e){
                    console.log(e)
                }
            })
        }

        function displayResult(){
            let ans = document.getElementById('Ans')
            ans.style.display = "block";
            $.ajax({
                url:'/getBloodCamp',
                method:"POST",
                data:{ID:index},
                success:function(result){
                    let text = document.createTextNode(result[0].BloodCampId + " " + result[0].Name)
                    ans.appendChild(text)
                    ans.appendChild(document.createElement("br"))
                },
                error:function(e){
                    console.log(e)
                }
            })
        }
        
    }

})
