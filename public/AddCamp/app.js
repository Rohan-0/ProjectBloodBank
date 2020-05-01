$(document).ready(function(){
    let btn = document.getElementById('btnSubmit');
    let id = document.getElementById('ID')
    let name = document.getElementById('Name')
    let password = document.getElementById('password')
    let area = document.getElementById('Area')
    let zipCode = document.getElementById('zipCode')
    btn.onclick = function(){
        InsertBloodCamp();
    }
    function InsertBloodCamp(){
        var data={BloodCampId:id.value,password:password.value,Name:name.value,Area:area.value,zipCode:zipCode.value}
        $.ajax({
            url:`/insertRowCamp`,
            method:"POST",
            data:data,
            success: function(result){
                //Write a success message
                console.log("successfully appended")
                alert("Blood Bank successfully added.")
            }
        })
        return false;
    }
})