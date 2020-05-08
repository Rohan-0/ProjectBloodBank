const express = require('express');
const Sequelize = require('sequelize')
var app = express();
const bloodDonor = require('./db').bloodDonor
const bloodCamp = require('./db').bloodCamp
const bodyParser = require('body-parser');
const hospital = require('./db').hospital
const { Op } = require("sequelize");
var PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use('/', express.static('./public') );
app.post('/insertRowDonor',async (req,res)=>{

  await bloodDonor.create({
    Donor_id: req.body.Donor_id,
    BloodCampId:req.body.BloodCampId,
    BloodGrp: req.body.BloodGrp,
    Age: req.body.Age,
    Gender: req.body.Gender,
    MonthsLastDon: req.body.MonthsLastDon,
    TotDon: req.body.TotDon,
    VolDon: req.body.VolDon,
    MonthsFirstDon: req.body.MonthsFirstDon,
    BloodDonNxt: req.body.BloodDonNxt,
    Month:req.body.Month
  })
  res.sendStatus(200)

})
app.post('/CheckRowCamp',async(req,res)=>{
  let result = await bloodCamp.findAll({
    where:{
      [Op.and]:{
        BloodCampId:req.body.BloodCampId,
        password:req.body.password
      }
    }
  })
  console.log(result)
  if(result == 0)
    res.sendStatus(400)
  res.sendStatus(200)
})
app.post('/fetchMonths',async(req,res)=>{
  let result = await bloodDonor.findAll({
    attributes:[Sequelize.fn('DISTINCT', Sequelize.col('Month')) ,'Month'],
    where:{
      BloodCampId: req.body.id
    }
  })
  res.send(result)
})
app.post('/insertRowCamp',async(req,res)=>{
    await bloodCamp.create({
        BloodCampId: req.body.BloodCampId,
        Name:req.body.Name,
        password:req.body.password,
        Area: req.body.Area,
        zipCode :req.body.zipCode
      })
    res.sendStatus(200);
})
app.post('/insertRow',async(req,res)=>{
    await hospital.create({
        hospitalId: req.body.hospitalId,
        Name:req.body.Name,
        Area: req.body.Area,
        Contact: req.body.Contact,
        zipCode: req.body.zipCode,
        password: req.body.password
      })
    res.sendStatus(200)
})
app.get('/Display/display',async(req,res)=>{
     var result = await bloodDonor.findAll()
    res.send(result)
})
app.get('/Query/getall',async(req,res)=>{
    var result = await bloodCamp.findAll()
    res.send(result)
})
app.get('/Analysis/getall',async(req,res)=>{
  var result = await bloodCamp.findAll()
  res.send(result)
})
app.post('/getAll',async(req,res)=>{
  var result = await bloodCamp.findAll({
    attributes: ['Name','BloodCampId','Area','zipCode']
  })
  res.send(result)
})
app.post('/getAllHospital',async(req,res)=>{
  var result = await hospital.findAll({
    attributes: ['Name','hospitalId','Area','zipCode','Contact']
  })
  res.send(result)
})
app.post('/getResult',async (req,res)=>{
  // console.log(req.body.hospitalId)
  var result =  await hospital.findAll({
    attributes: ['zipCode'],
    where:{
      [Op.and]:{
        hospitalId:req.body.hospitalId,
        password:req.body.password
      }
    }
    })
    console.log(result)
    if(result == 0)
      res.sendStatus(400)
     res.send(result)
})
app.post('/getDonors',async(req,res)=>{
  var result = await bloodDonor.findAll({
    attributes:['Donor_id','Gender','BloodGrp','Age','MonthsLastDon','TotDon','VolDon','MonthsFirstDon','BloodDonNxt'],
    where:{
      [Op.and]:{
        BloodCampId:req.body.CampId,
        Month:req.body.month
      }
    }
  })
  res.send(result)
})
app.post('/countDonors',async(req,res)=>{
  let gender, minAge, maxAge, bloodGrp,pred=true,month=['January','February','March','May','April','June','July','August','September','October','November','December'];
  if(req.body.gender=="Any"){
    gender=["M","F"]
  }
  else{
    gender = req.body.gender
  }
  if(req.body.age == "Any"){
    minAge = 10;
    maxAge = 60;
  }
  else{
    minAge = parseInt(req.body.age);
    maxAge = parseInt(minAge + 10);
  }
  if(req.body.bloodGrp == "Any"){
    bloodGrp = ["O+","O-","B-","B+","AB+","AB-"]
  }
  else{
    bloodGrp = req.body.bloodGrp
  }
  if(req.body.month){
    if(req.body.month != "Any")
      month = req.body.month;
  }
  if(req.body.BloodDonNxt){
    if(req.body.BloodDonNxt == "No")
      pred = [true,false]
  }
  const amount = await bloodDonor.count({
    where: {
      [Op.and]:[
        {BloodCampId : req.body.BloodCampId},
        {BloodDonNxt: pred},
        {Age : {
          [Op.gt]:minAge,
          [Op.lte]:maxAge
          }
        },
        {Gender:gender},
        {BloodGrp:bloodGrp},
        {Month:month}
      ]
    }
  });
  // let amt = JSON.stringify(amount)
  // console.log(amount)s
  let amt = amount.toString()
  // console.log(amt)
  res.send(amt)
})
app.post("/getBloodCamp",async(req,res)=>{
  let result = await bloodCamp.findAll({
    where:{
      BloodCampId:req.body.ID
    }
  })
  res.send(result)
})
app.listen(PORT, function(){
    console.log('Server is listening on 5000');
})