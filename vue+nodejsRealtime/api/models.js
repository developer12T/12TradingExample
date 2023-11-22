const mongoose = require('mongoose')

const dataOrderSchema = mongoose.Schema(
    {
        id:{type:String,require:true},
        idShop:{type:String,require:true},
        saleCode:{type:String,require:true},
        balance:{type:String,require:true},
        status:{type:String,require:true},
    })

const DataOrder = mongoose.model('dataOrder',dataOrderSchema)

module.exports = { DataOrder }