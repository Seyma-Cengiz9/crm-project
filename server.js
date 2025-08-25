const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;
const DATA_FILE = "./customers.json";

// Müşteri verilerini tutacak JSON dosyasını oluştur

app.use(bodyParser.json());


// JSON dosyasını okumak için bir fonksiyon
function readData() {
  const data = fs.readFileSync(DATA_FILE);
  return JSON.parse(data);
}

// JSON dosyasına yazmak için bir fonksiyon
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}


// 1. Müşteri Listeleme
app.get("/customers", (req, res) => {
  const customers = readData();
  res.json(customers);
});

// 2. Müşteri Ekleme
app.post("/customers", (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name ve Email zorunludur" });
  }

  const customers = readData();
  const newCustomer = {
    id: Date.now(),
    name,
    email,
    phone,
  };

  customers.push(newCustomer);
  writeData(customers);

  res.status(201).json(newCustomer);
});

// 3. Müşteri Silme
app.delete("/customers/:id", (req, res) => {
  const customers = readData();
  const id = parseInt(req.params.id);

  const filtered = customers.filter((c) => c.id !== id);

  if (filtered.length === customers.length) {
    return res.status(404).json({ error: "Müşteri bulunamadı" });
  }

  writeData(filtered);
  res.json({ message: "Müşteri silindi" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

