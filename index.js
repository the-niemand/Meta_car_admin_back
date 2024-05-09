const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


dotenv.config();

app.use(express.static(path.join(__dirname , 'images')))
app.use(express.json());
app.use(cors())


require('./config/connect');

const BookRoute = require('./routes/CarRoute');
app.use('/car', BookRoute);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running successfully on port ${PORT}`);
});

