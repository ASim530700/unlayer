const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://neil:neil140301@cluster0.g5a3e.mongodb.net/emailDb");

// Schema e modelo
const templateSchema = {
  templateId: Number,
  templateJson: String
};
const Template = mongoose.model("Template", templateSchema);

// API routes
app.get('/templates', async (req, res) => {
  const results = await Template.find();
  const templates = results.map(item => item.templateId);
  res.send(templates);
});

app.get('/template/:id', async (req, res) => {
  const { id } = req.params;
  const template = await Template.find({ templateId: id });
  res.send(template);
});

app.post('/template', async (req, res) => {
  const { templateId, templateJson } = req.body;
  const newTemplate = new Template({ templateId, templateJson });
  await newTemplate.save();
  res.sendStatus(201);
});

app.put('/template/:id', async (req, res) => {
  const { id } = req.params;
  const { templateJson } = req.body;
  await Template.updateOne({ templateId: id }, { $set: { templateJson } });
  res.send("updated");
});

// Static frontend (React) build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Express is running on port ${port}`);
});
