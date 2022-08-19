const express = require('express')
const path = require('path')
const app = express()
const port = 3000

app.use('/', express.static(path.join(__dirname, '../dist/spa')))

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})