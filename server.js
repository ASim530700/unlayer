const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb+srv://neil:neil140301@cluster0.g5a3e.mongodb.net/emailDb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('🟢 MongoDB ligado');
}).catch((err) => {
  console.error('🔴 Erro ao ligar MongoDB:', err);
});

// Mongo schema
const templateSchema = {
  templateId: Number,
  templateJson: String
};

const Template = mongoose.model("Template", templateSchema);

// API endpoints
app.get('/templates', async (req, res) => {
  try {
    const results = await Template.find();
    const templates = results.map(item => item.templateId);
    res.send(templates);
  } catch (err) {
    res.status(500).send('Erro ao obter templates');
  }
});

app.get('/template/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const template = await Template.find({ templateId: id });
    res.send(template);
  } catch (err) {
    res.status(500).send('Erro ao obter template');
  }
});

app.post('/template', async (req, res) => {
  try {
    const { templateId, templateJson } = req.body;
    const newTemplate = new Template({ templateId, templateJson });
    await newTemplate.save();
    res.send("Template criado com sucesso");
  } catch (err) {
    res.status(500).send('Erro ao criar template');
  }
});

app.put('/template/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { templateJson } = req.body;
    await Template.updateOne({ templateId: id }, { $set: { templateJson } });
    res.send("Template atualizado com sucesso");
  } catch (err) {
    res.status(500).send('Erro ao atualizar template');
  }
});

// Frontend static build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  });
}

// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor a correr na porta ${port}`);
});
