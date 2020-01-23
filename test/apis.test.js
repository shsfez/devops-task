// import chai, chai-http
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);

const fs = require('fs');
const filePath = require('path').join(__dirname, "..", "data", "simple_file.json");

// import server app
const server = require('../dist/app').app;

// helper function to delete the json file
function deleteJsonFile() {
    if (!fs.existsSync(filePath)) {
        console.log('file not found')
        return;
    }
    fs.unlinkSync(filePath);
    console.log('file successfuly deleted')
}

describe("GENERAL other paths & undefined paths", () => {
    it('requests to / should be redirected to angular page', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                res.should.have.status(200);

                let responseValidation = res.text.toLowerCase().startsWith('<!doctype html>');
                responseValidation.should.be.eql(true);
                done();
            });
    });
    it('request to /api/* that are not defined should return error', (done) => {
        chai.request(server)
            .get('/api/not_defined_request')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.be.empty;
                done();
            });
    });
    it('requests to other undefined path than /api/* should be redirected to angular page', (done) => {
        chai.request(server)
            .get('/not_defined')
            .end((err, res) => {
                res.should.have.status(404);


                let responseValidation = res.text.toLowerCase().startsWith('<!doctype html>');
                responseValidation.should.be.eql(true);
                done();
            });
    });
});

describe("Unitests - GET /api/test", () => {
    it('Request /api/test should return a body with "status" "ok"', (done) => {
        chai.request(server)
            .get('/api/test')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('ok');
                done();
            });
    });
});

describe("Unitests - GET /api/update_date", () => {
    it('Request the updated date when no file exists, should return actual date', (done) => {
        deleteJsonFile();
        chai.request(server)
            .get('/api/update_date')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('ok');

                let messageValidation = res.body.message.startsWith('The last update date was at');
                messageValidation.should.be.eql(true);
                done();
            });
    });

    it('Request the updated date when file exists, should return ok with a date', (done) => {
        chai.request(server)
            .get('/api/update_date')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('ok');

                let messageValidation = res.body.message.startsWith('The last update date was at');
                messageValidation.should.be.eql(true);
                done();
            });
    });
});

describe("Unitests - POST /api/update_date", () => {
    it('Post request to change the date, assert response ok', (done) => {
        chai.request(server)
            .post('/api/update_date')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql('ok');
                res.body.should.have.property('message').eql('Date was updated in the file!');
                done();
            });
    });
    it('update date then request it to assure is the same', (done) => {
        var returnedDate;
        chai.request(server)
            .post('/api/update_date')
            .end((err, res) => {
                returnedDate = res.body.timestamp;
                returnedDate.should.have.lengthOf.at.least(1);
                chai.request(server)
                    .get('/api/update_date')
                    .end((err, res) => {
                        res.body.should.have.property('message').eql(`The last update date was at ${returnedDate}`);
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('status').eql('ok');
                        return done();
                    });
            });
    });
});

describe("Unitests - POST /api/update_redis", () => {
    it('Send post without param value should return error 400', (done) => {
        chai.request(server)
            .post('/api/update_redis?key=hello')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.empty;
                done();
            });
    });
    it('Send post without param key should return error 400', (done) => {
        chai.request(server)
            .post('/api/update_redis?value=world')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.empty;
                done();
            });
    });
    it('Send post without param key and value should return error 400', (done) => {
        chai.request(server)
            .post('/api/update_redis')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.empty;
                done();
            });
    });
    it('Send post with both params key and value should return error 400', (done) => {
        chai.request(server)
            .post('/api/update_redis?key=hello&value=world')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.empty;
                done();
            });
    });
    it('Send post, then request the key should return the same value', (done) => {
        var key = "hello"
        var value = "world";

        chai.request(server)
            .post(`/api/update_redis?key=${key}&value=${value}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.empty;

                chai.request(server)
                    .get(`/api/from_redis?key=${key}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.be.eql(value);
                        done();
                    });
            });
    });
});

describe("Unitests - GET /api/from_redis", () => {
    it('Get request without key in params should return error', (done) => {
        chai.request(server)
            .get('/api/from_redis')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.empty;
                done();
            });
    });
    it('Get undefined key should return error 400', (done) => {
        var undefinedkey = 'UNDEFINEDKEY_' + new Date().toISOString();
        chai.request(server)
            .get(`/api/from_redis?key=${undefinedkey}`)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.empty;
                done();
            });
    });

    it('Define key/value pair then check the value is equal', (done) => {
        var key = 'TESTKEY_' + new Date().toISOString();
        var value = 'TESTVALUE_' + new Date().toISOString();
        chai.request(server)
            .post(`/api/update_redis?key=${key}&value=${value}`)
            .end((err, res) => {
                chai.request(server)
                    .get(`/api/from_redis?key=${key}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.text.should.be.eql(value);
                        done();
                    });
            });
    });
});