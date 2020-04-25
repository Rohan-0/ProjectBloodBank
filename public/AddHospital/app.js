$(document).ready(function(){
    let btnSubmit = document.getElementById('btnSubmit')
    btnSubmit.onclick = function(){
        let id = document.getElementById('ID')
        let name = document.getElementById('Name')
        let area = document.getElementById('Area')
        let contact = document.getElementById('contact')
        let zipCode = document.getElementById('zipCode')
        $.ajax({
            url:`/insertRow`,
            method:"POST",
            data:{hospitalId:id.value,Name:name.value,Area:area.value,Contact:contact.value,zipCode:zipCode.value},
            success:function(result){
                print("OK")
            }
        })
    }
})
function addAHospital(){
    

}