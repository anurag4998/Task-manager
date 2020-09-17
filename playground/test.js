// db.collection("users").insertOne({
//     _id: id,
//     name: "sai",
//     age: 22
// }, (error, result) => {
//     if (error)
//         return console.log("unable to inssert user")
//     console.log(result.ops)
// }
// )

// db.collection("users").findOne({ name: "anurag" }, (error, user) => {
//     if (error)
//         return console.log(error)

//     console.log(user)
// })

// db.collection("users").find({ age: 22 }).toArray((error, user) => {
//     console.log(user)
// })

// db.collection("users").updateOne({ _id: new ObjectID("5f55d9899452c6228c4617eb") }
//     , {
//         $set: { name: "Anurag Sai" }
//     })
//     .then((result) => {
//         console.log(result)
//     }).catch(error => console.log(error()))

// db.collection("tasks").updateMany({ completed: false }, {
//     $set: {
//         completed: true
//     }
// })

// db.collection("users").deleteOne({ description: "eat" }).then((result) => console.log(result)).catch((error) => console.log(error))