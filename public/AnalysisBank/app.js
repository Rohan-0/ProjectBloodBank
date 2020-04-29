$(document).ready(function(){
    var btn=document.getElementById('btnSubmit');
    var id = document.getElementById('id');
    var password = document.getElementById('password');
    var month = document.getElementById('month')
    var predVal = document.getElementById('predict')
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
                    alert("Either the id or the password is incorrect")
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
                    for(let i=0;i<result.length;i++){
                        let option = document.createElement('option')
                        let text = document.createTextNode(result[i].Month)
                        option.appendChild(text)
                        month.appendChild(option)
                    }
                }
            })
        }
    }


    let age = document.getElementById('age')
    age.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        // let x = document.getElementById("displayAgeGraph");
        // x.style.display = "block";
        let AgeGrp = [10,20,30,40,50]
        let AgeCount = [0,0,0,0,0]
        let AgeJsonObj = {}
        let count = 0
        for(let i=0;i<resultsIDName.length;i++){
            for(let j=0;j<AgeGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsIDName[i].id, month:month.value,age:AgeGrp[j],gender:"Any",bloodGrp:"Any",BloodDonNxt:predVal.value},
                    success:function(result){
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
        }
    }
    
    
    let gender = document.getElementById('gender')
    gender.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        // let x = document.getElementById("displayGenderGraph");
        // x.style.display = "block";
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
        }
    }



    let BloodGrp = document.getElementById('bloodGrp')
    BloodGrp.onclick = function(){
        if(resultRecieved==false){
            alert("Enter info If entered then no results found")
            return;
        }
        // let x = document.getElementById("displayBloodGpGraph");
        // x.style.display = "block";
        let BgGrp = ["O+","O-","B-","B+","AB+","AB-"]
        let BgCount = [0,0,0,0,0,0]
        let BgJsonObj = {}
        let count = 0
        for(let i=0;i<resultsIDName.length;i++){
            for(let j=0;j<BgGrp.length;j++){
                $.ajax({
                    url:'/countDonors',
                    method:"POST",
                    data:{BloodCampId:resultsIDName[i].id,month:month.value, age:"Any",gender:"Any",bloodGrp:BgGrp[i],BloodDonNxt:predVal.value},
                    success:function(result){
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
        }
    }
})