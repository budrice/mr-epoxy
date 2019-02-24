let express = require('express');
let router = express.Router();
let Db = require('./database_queries.js');
let db = new Db();

router.get('/getproducts', (req, res) => {
    db.GetProducts(req.body).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.post('/login', (req, res) => {
    db.Login(req.body).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.post('/register', (req, res) => {
    db.Register(req.body).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.get('/usersearch/:key/:value', (req, res) => {
    db.UserSearch(req.params.key, req.params.value).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.get('/basicsearch/:table/:key/:value/:id', (req, res) => {
    let search_object = {};
    let token = req.headers['x-access-token'] ? null : req.headers['x-access-token'];

    if (req.params.key !== null) {
        search_object[req.params.key] = req.params.value;
    }
    db.Search(req.params.table, search_object, token, req.params.id).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.post('/insert', (req, res) => {
    db.Insert(req.body).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.put('/update', (req, res) => {
    db.Update(req.body.table, req.body.id, req.body.values).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.get('/getinvoice/:id/:key/:invoice', (req, res) => {
    db.GetInvoice(req.params.id, req.params.key, req.params.invoice).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});
router.post('/updateunassignedinvoice', (req, res) => {
    db.UpdateUnassignedInvoices(req.body.inv, req.body.id).then((result) => {
        res.json(result);
    }, (error) => {
        res.json(error);
    });
});

module.exports = router;