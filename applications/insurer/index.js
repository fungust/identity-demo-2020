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
const Identity = require('./lib/identity.js');

// db to persist key, a bit of an overkill but for demonstration purposes, why not
const db = new MongoFacade(doc.database.mongo);

const app = express()

let id = null;
let key = null;

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

// signing api
app.post(
  '/api/sign',
  (req, res) => {
    res.send(id.sign(String(req.body.value)));
  }
)

app.post(
  '/api/verify',
  (req, res) => {
    let body = req.body;
    if ((typeof body.publicKey != 'string') || (typeof body.data != 'string') || (typeof body.signature != 'string')) {
      res.send('false');
      return
    };
    res.send(id.verify(body))
  }
)

function loadKey(body, res) {
  if ((typeof body.private != 'string') || (typeof body.public != 'string')) {
    res.status(500).send('Invalid key structure');
    return
  }
  try {
    id = new Identity({ identity: body });
  } catch (err) {
    res.status(500).send('Key parsing failed');
    return
  }
  db.writeKey(body);
  key = body;
  res.send('OK');
}

app.post(
  '/api/loadKey',
  (req, res) => {
    let body = req.body;
    if (key) { res.status(500).send('Key already loaded'); return } // do not respond to any key load requests after initialize
    db.readKey()
      .then((dbKey) => {
        if (dbKey) {
          key = dbKey;
          id = new Identity({ identity: key });
          res.status(500).send('Key already loaded'); return
        } else {
          loadKey(body, res);
        };
      })
      .catch(() => {
        loadKey(body, res);
      });
  }
)

function renderInvoice(res) {
  res.render('invoice.html', {
    title: 'Invoice Validator',
    registryPath: doc.registry.path
  });
}

function renderLoadKey(res) {
  res.render('loadkey.html', {
    title: 'Initialize Signing Server',
    registryPath: doc.registry.path
  });
}

app.get(
  '/',
  (req, res) => {
    if (key) {
      renderInvoice(res);
    } else {
      db.readKey()
        .then((dbKey) => {
          if (dbKey) {
            key = dbKey;
            id = new Identity({ identity: key });
            renderInvoice(res);
          } else {
            renderLoadKey(res);
          };
        })
        .catch(() => {
          renderLoadKey(res);
        });
    };
  }
)

async function init() {
  try {
    await db.initialize();
    key = await db.readKey();
  } catch (err) {
    return
  };

  if (key) {
    id = new Identity({ identity: key });
  };

  app.listen(
    doc.serve.port,
    () => {
      log.success('app', `Listening on ${doc.serve.port}`);
    }
  )
}

init();