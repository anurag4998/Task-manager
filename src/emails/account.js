const sgmail = require("@sendgrid/mail");
const sendGridApi = process.env.SENDGRID_API_KEY

sgmail.setApiKey(sendGridApi)

// sgmail.send({
//     to: "anuragraohbk003@gmail.com",
//     from: "anuragapp4998@gmail.com",
//     subject: "This is my first mail",
//     text: "Hello there"
// })

const sendWelcomeEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: "anuragapp4998@gmail.com",
        subject: "Thanks for Joining!!",
        text: `Welcome to Task Manager ${name} !!`
    })
}

const sendCancelEmail = (email, name) => {
    sgmail.send({
        to: email,
        from: "anuragapp4998@gmail.com",
        subject: "We hope to see you back again",
        text: `Goodbye ${name} , Let Us know If you have any inputs for us!!`
    })
}
module.exports = { sendWelcomeEmail, sendCancelEmail }