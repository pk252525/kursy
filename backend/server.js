const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Prosta trasa testowa
app.get('/', (req, res) => {
  res.send('Serwer Express działa!');
});

// Przykładowa trasa API
app.get('/hello', (req, res) => {
  res.json({ message: 'Witaj z backendu!' });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});