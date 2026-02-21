const express = require("express");

const app = express();

app.listen(4000, 'localhost', () => {
  console.log('server started at port 4000')
})
