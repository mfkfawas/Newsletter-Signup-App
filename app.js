const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
        res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;

    // The recieved data is turning into object of key value pairs accordingly to mailchimp's API
        var data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
                }
            }
        ]
    };

    // Convert 'data' to a JSON bcoz mailchimp only accepts as JSON
    const jsonData = JSON.stringify(data);

    const url = 'https://us1.api.mailchimp.com/3.0/lists/92c32b095a';
    const options = {
        method: 'post',
        auth: 'mfkfawas:45bce9c4c3c624770d21b68a0c902ca0-us1'
    }

    const request = https.request(url, options, (response) => {
            if(response.statusCode === 200){
                res.sendFile(__dirname + '/success.html');
            } else {
                res.sendFile(__dirname + '/failure.html');
            }

            // response.on('data', (data) => {
            //     console.log(JSON.parse(data));
            // });
    });

    request.write(jsonData);
    request.end();
});

app.post('/failure', (req, res) => {
    res.redirect('/');
});


app.listen(process.env.PORT || 3000, (req, res)=> {
   console.log('Server is running on port 3000');
});

// mailChimpApi 45bce9c4c3c624770d21b68a0c902ca0-us1

//mailchimp listId 92c32b095a