const express = require('express');
const userRoutes = require('./routes/userRoutes');
const userNormal = require('./routes/userNormalRoutes');
const path = require('path');
var method_override = require('method-override');
const app = express();
require('./db');
const hbs = require('hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(method_override('method'));
app.set('view engine', 'hbs');
app.set('view option', { layout: 'layout' });

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

hbs.registerHelper('constructUpdate', function () {
  return `/user/update/${this.user_id}`;
});

hbs.registerHelper('constructDelete', function () {
  return `/delete/${this.user_id}?method=DELETE`;
});
 
hbs.registerHelper('constructUpdateAPI', function () {
  return `/update/${this.id}?method=PUT`;
});
app.use(express.static(path.join(__dirname, 'static')));
// app.get("/" , (req,res)=> res.send("hello world"))
app.use(userRoutes);
app.use(userNormal);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === 'MulterError') return res.status(400).send(err.message);
  res.send(err.message);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log('server start'));
