const express = require('express');
const bodyParser = require('body-parser');
const positionController = require('./controllers/positionController');

const app = express();
app.use(bodyParser.json());

app.post('/open-position', positionController.openPosition);
app.post('/close-position', positionController.closePosition);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
