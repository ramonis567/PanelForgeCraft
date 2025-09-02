const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const exportRoutes = require('./routes/export');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/export', exportRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
