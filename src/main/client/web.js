var express = require('express'),
    morgan  = require('morgan'),
    app     = express();

app.use(morgan('combined'));
app.use(express.static(''+__dirname));
app.listen(process.env.PORT || 5000);