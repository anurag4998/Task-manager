const mongoose = require('mongoose');

const connectionURL = process.env.MONGODB_URL

mongoose.connect(connectionURL, { useNewUrlParser: true, useCreateIndex: true })




// /Users/"Anurag Agrawal"/mongodb/bin/mongod.exe --dbpath=/Users/"Anurag Agrawal"/mongodb-data