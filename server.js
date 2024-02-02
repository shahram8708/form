const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/submit', (req, res) => {
    const formData = req.body;

    const userEmail = formData?.contactInformation?.emailAddress;

    if (!userEmail) {
        console.log('Error: User email not found in form data.');
        return res.status(400).send('Error: User email not found in form data.');
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ram.coding8@gmail.com',
            pass: 'lkbf nrwm pmno xqdh'
        }
    });

    const userMailOptions = {
        from: 'ram.coding8@gmail.com',
        to: userEmail,
        subject: 'Form Submission Confirmation',
        text: 'Thank you for submitting the form. We have received your details.'
    };

    const adminMailOptions = {
        from: 'ram.coding8@gmail.com',
        to: 'ram.coding8@gmail.com',
        subject: 'New Form Submission',
        text: createEmailBody(formData),
    };

    transporter.sendMail(userMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending user confirmation email:', error);
        } else {
            console.log('User confirmation email sent:', info.response);
        }
    });

    transporter.sendMail(adminMailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email to admin:', error);
        } else {
            console.log('Email sent to admin:', info.response);
        }
    });

    res.send('Form submitted successfully!');
});

function createEmailBody(formData) {
    let emailBody = '';

    for (const section in formData) {
        emailBody += `${section.toUpperCase()}:\n`;

        for (const field in formData[section]) {
            emailBody += `${field}: ${formData[section][field]}\n`;
        }

        emailBody += '\n';
    }

    return emailBody;
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
