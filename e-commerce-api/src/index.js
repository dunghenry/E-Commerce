const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
dotenv.config();
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
const connectDB = require('./configs/connectBD');
const logEvents = require('./helpers/logEvents');
const routes = require('./routes');
const port = process.env.PORT || 4000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("dev"));
connectDB();
app.use("/api/v1", routes);

app.get('*', (req, res) => {
    res.json({
        status: 404,
        message: "API not found!"
    });
})
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
