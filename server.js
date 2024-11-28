// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const PORT = 3000;

// // Middleware to parse JSON requests
// app.use(express.json());

// // Serve static files (HTML, images, etc.)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname , 'public','index.html'));
//   });


// // Function to check if userId is unique
// function isUniqueId(userId, callback) {
//     fs.readFile('user_logs.txt', 'utf8', (err, data) => {
//         if (err && err.code !== 'ENOENT') {
//             console.error('Error reading log file:', err);
//             return callback(false); // Assume not unique if an error occurs
//         }
//         const isUnique = !data || !data.includes(`User ID: ${userId},`);
//         callback(isUnique);
//     });
// }

// // Endpoint to log data
// app.post('/log', (req, res) => {
//     const { userId, timestamp } = req.body;

//     if (!userId || !timestamp) {
//         return res.status(400).json({ error: 'Invalid request payload' });
//     }

//     isUniqueId(userId, (isUnique) => {
//         if (isUnique) {
//             const logEntry = `User ID: ${userId}, Timestamp: ${timestamp}\n`;
//             fs.appendFile('user_logs.txt', logEntry, (err) => {
//                 if (err) {
//                     console.error('Error writing to log file:', err);
//                     return res.status(500).json({ error: 'Failed to log data' });
//                 }
//                 console.log(`Logged unique User ID: ${userId}, Timestamp: ${timestamp}`);
//                 return res.status(200).json({ message: 'Data logged successfully' });
//             });
//         } else {
//             console.log(`Duplicate User ID: ${userId} was not logged.`);
//             return res.status(200).json({ message: 'Duplicate User ID. No logging occurred.' });
//         }
//     });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });



//--------------------------------------------------------------------------------------------------------

const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'ramlakman98@gmail.com', // Your Gmail address
        pass: 'gzdv ston ffoj btae',   // Your Gmail app password
    },
});

// Function to check if userName is unique
function isUniqueName(userName, callback) {
    fs.readFile('user_logs.txt', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading log file:', err);
            return callback(false); // Assume not unique if an error occurs
        }
        const isUnique = !data || !data.includes(`Name: ${userName},`);
        callback(isUnique);
    });
}

// Route to handle link clicks and log user data
app.get('/open-link', (req, res) => {
    const userName = req.query.name; // Capture name from query parameter
    const userId = req.query.userId; // Capture userId from query parameter
    const timestamp = new Date().toISOString(); // Capture the current time in ISO format

    if (!userName || !userId) {
        return res.status(400).send('Name and User ID are required');
    }

    // Check if userName is unique and log data if it is
    isUniqueName(userName, (isUnique) => {
        if (isUnique) {
            const logEntry = `Name: ${userName}, User ID: ${userId}, Timestamp: ${timestamp}\n`;
            fs.appendFile('user_logs.txt', logEntry, (err) => {
                if (err) {
                    console.error('Error writing to log file:', err);
                    return res.status(500).send('Failed to log data');
                }
                console.log(`Logged Name: ${userName}, User ID: ${userId}, Timestamp: ${timestamp}`);
                res.send(`Link opened by Name: ${userName} (User ID: ${userId}) at ${timestamp}`);
            });
        } else {
            console.log(`Duplicate Name: ${userName} was not logged.`);
            res.send(`Duplicate Name: ${userName}. No logging occurred.`);
        }
    });
});

// Serve static HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the Express app
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Express app running on port ${PORT}`));

console.log('Server is running at http://localhost:4000');
