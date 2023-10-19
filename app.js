const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const lodash = require('lodash')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/contactDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.log(err);
  });

const contactSchema = new mongoose.Schema({
  name: String,
  Address: String,
  email: String,
  number: Number,
});

const emailSchema = new mongoose.Schema({
  email: String,
  password: String,
  Name:String
});

const Email = mongoose.model('Email', emailSchema);
const Contact = mongoose.model('Contact', contactSchema);

app.get('/', (req, res) => {
  res.render('login');
});

app.get('/contact', (req, res) => {
  Contact.find()
    .then((foundItems) => {
      res.render('contact', { addlist: foundItems, length: foundItems.length });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/', (req, res) => {
  const reg = req.body.registerlogin;
  const login = req.body.login;
  const password = req.body.password;

  const loginemail = req.body.email.toString();

  if (reg === 'registerlogin') {
    res.render('register');
  } else if (login === 'loginemail') {
    Email.findOne({ email: loginemail, password: password })
      .then((foundEmail) => {
        if (foundEmail) {
            const ename = lodash.upperCase(foundEmail.Name)
          res.render('welcome',{Name:ename});
        } else {
          res.send('Wrong password or email or not registered');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

app.post('/form1', (req, res) => {
  const login = req.body.Login;
  const register = req.body.register;

  if (register === 'register') {
    res.render('register');
  } else if (login === 'login') {
    res.render('login');
  }
});

app.post('/register', (req, res) => {
  const log = req.body.registerlogin;
  const email = req.body.email;
  const password = req.body.password;
  const str = email.toString();
  const name = req.body.name;

  const email1 = new Email({
    email: str,
    password: password,
    Name:name
  });

  email1.save();

  if (log === 'registerlogin') {
    res.render('login');
  } else {
    res.render('login');
  }
});

app.post('/add', (req, res) => {
  res.render('create');
});

app.post('/form2', (req, res) => {
  const logout = req.body.logout;
  const create = req.body.create;
  const contact = req.body.contact;

  if (logout === 'logout') {
    res.render('login');
  } else if (create === 'createcontact') {
    res.render('create');
  } else if (contact === 'showallcontact') {
    res.redirect('/contact');
  }
});

app.post('/addcontact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  const number = req.body.number;

  const contact1 = new Contact({
    name: name,
    Address: address,
    email: email,
    number: number,
  });

  contact1.save()
    .then(() => {
      res.redirect('/contact');
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/reload', (req, res) => {
  res.redirect('/contact');
});

app.post('/update', (req, res) => {
  const id = req.body.click;
  console.log(id);

  Contact.findById(id)
    .then((foundItem) => {
      if (foundItem) {
        res.render('update', { addlist: foundItem });
      } else {
        console.log('Item not found');
        res.redirect('/contact');
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post('/updatecontact', (req, res) => {
  const updateBtn = req.body.update;
  const deleteBtn = req.body.delete;
  const name = req.body.name;
  const email = req.body.email;
  const address = req.body.address;
  const number = req.body.number;

  if (updateBtn) {
    Contact.findByIdAndUpdate(updateBtn, { name: name, Address: address, email: email, number: number })
      .then(() => {
        console.log('Successfully updated');
        res.redirect('/contact');
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (deleteBtn) {
    Contact.findByIdAndDelete(deleteBtn)
      .then(() => {
        console.log('Successfully deleted');
        res.redirect('/contact');
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    console.log('Invalid operation');
    res.redirect('/contact');
  }
});

app.listen(3001, () => {
  console.log('Server is running on localhost:3000');
});
