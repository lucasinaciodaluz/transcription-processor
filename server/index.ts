const path = require('path');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
