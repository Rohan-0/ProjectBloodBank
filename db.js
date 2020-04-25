const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes

const db = new Sequelize({
  storage: __dirname + '/bloodDonor.db',
  dialect: 'sqlite'
})
const dbBloodCamp = new Sequelize({
    storage: __dirname + '/bloodCamp.db',
    dialect: 'sqlite'
})
const dbHospital = new Sequelize({
    storage: __dirname + '/hospital.db',
    dialect: 'sqlite'
})

const hospital = dbHospital.define('hospital',{
    hospitalId:{
        type:DT.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    Name:{
        type:DT.STRING,
        allowNull:false,
    },
    
    Area:{
        type:DT.STRING,
        allowNull:false
    },
    zipCode:{
        type:DT.INTEGER,
        allowNull:false
    },
    Contact:{
        type:DT.TEXT,
        allowNull:false
    }
})

const bloodCamp = dbBloodCamp.define('bloodCamp',{
    BloodCampId:{
        type:DT.INTEGER,
        allowNull:false,
        primaryKey:true
    },
    Name:{
        type:DT.STRING,
        allowNull:false,
    },
    
    Area:{
        type:DT.STRING,
        allowNull:false
    },
    zipCode:{
        type:DT.INTEGER,
        allowNull:false
    }
})
const bloodDonor = db.define('bloodDonor',{
    Donor_id:{
        type:DT.INTEGER,
        allowNull: false,
        primaryKey:true
    },
    BloodCampId:{
        type:DT.INTEGER,
        allowNull:false,
    },
    BloodGrp:{
        type:DT.STRING,
        allowNull: false
    },
    Age:{
        type:DT.INTEGER,
        allowNull: false
    },
    
    Gender:{
        type:DT.STRING,
        allowNull: false
    },
    MonthsLastDon:{
        type:DT.INTEGER,
        allowNull: false
    },
    
    TotDon:{
        type:DT.INTEGER,
        allowNull: false
    },
    
    VolDon:{
        type:DT.INTEGER,
        allowNull: false
    },
    
    MonthsFirstDon:{
        type:DT.INTEGER,
        allowNull: false
    },
    BloodDonNxt:{
        type:DT.BOOLEAN,
        allowNull:false
    }
    
})
db.sync()
dbBloodCamp.sync()
dbHospital.sync()
module.exports = {
    bloodDonor,
    bloodCamp,
    db,
    dbBloodCamp,
    hospital
}