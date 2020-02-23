const yaml = require('js-yaml');
const fs = require('fs');

const common = require('./lib/common.js');
const log = new common.logger('index.js');

try {
  doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/config.yaml`, 'utf8'));
  log.success('app', `Configuration file loaded from ${__dirname}/config.yaml`);
} catch (e) {
  log.error('app', `Error loading configuration file ${e}`);
  process.exit()
}

const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const MongoFacade = require('./lib/db.js');

const db = new MongoFacade(doc.database.mongo);

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

nunjucks.configure('templates', {
  autoescape: true,
  express: app
});

app.use(express.static('./res'))

// new registration key
app.get(
  '/api/register',
  (req, res) => {
    db.newOTP()
      .then((result) => {
        res.send(result)
      })
      .catch((err) => {
        res.status(500).send(err);
      })
  }
)

// new entity
app.post(
  '/api/entity/new',
  (req, res) => {
    try {
      db.registerNewEntity(req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (err) {
      res.status(500).send(err);
    };
  }
)

// find entity
app.post(
  '/api/entity/find',
  (req, res) => {
    try {
      db.findEntity(req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (err) {
      res.status(500).send(err);
    };
  }
)

// register ephemeral
app.post(
  '/api/ephemeral/register',
  (req, res) => {
    try {
      db.registerEphemeral(req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (err) {
      res.status(500).send(err);
    };
  }
)

// find ephemeral
app.post(
  '/api/ephemeral/find',
  (req, res) => {
    try {
      db.findEphemeral(req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    } catch (err) {
      res.status(500).send(err);
    };
  }
)

app.get(
  '/',
  (req, res) => {
    res.render('getOTP.html', {
      title: 'Generate OTP'
    });
  }
)

async function init() {
  try {
    await db.initialize();
  } catch (err) {
    return
  };

  app.listen(
    doc.serve.port,
    () => {
      log.success('app', `Listening on ${doc.serve.port}`);
    }
  )
}

init();