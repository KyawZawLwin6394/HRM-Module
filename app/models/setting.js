'use strict';

const mongoose = require('mongoose');
mongoose.promise = global.Promise;
const Schema = mongoose.Schema;

let SettingSchema = new Schema({
    referenceLat: {
        type: Number
    },
    referenceLon: {
        type: Number
    },
    refAddress: {
        type: String
    },
    deal:{
        type: String
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    fstpenalty: {
        pName: {
            type: String
        },
        pTime: {
            type: String
        },
        pPercent: {
            type: Number,
            default: 0
        },
        pAmount: {
            type: Number,
            default: 0
        }
    },
    secpenalty: {
        pName: {
            type: String
        },
        pTime: {
            type: String
        },
        pPercent: {
            type: Number
        },
        pPercent: {
            type: Number,
            default: 0
        },
        pAmount: {
            type: Number,
            default: 0
        }
    },
    thdpenalty: {
        pName: {
            type: String
        },
        pTime: {
            type: String
        },
        pPercent: {
            type: Number
        },
        pPercent: {
            type: Number,
            default: 0
        },
        pAmount: {
            type: Number,
            default: 0
        }
    },
    fnlpenalty: {
        pName: {
            type: String
        },
        pTime: {
            type: String
        },
        pPercent: {
            type: Number
        },
        pPercent: {
            type: Number,
            default: 0
        },
        pAmount: {
            type: Number,
            default: 0
        }
    }
});

SettingSchema.pre('save', function (next) {
    let attachment = this;
    return next()
});

module.exports = mongoose.model('Settings', SettingSchema);
