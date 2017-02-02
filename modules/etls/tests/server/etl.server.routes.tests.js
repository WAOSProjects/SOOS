'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Etl = mongoose.model('Etl'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, etl;

/**
 * Etl routes tests
 */
describe('Etl CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Etl
    user.save(function () {
      etl = {
        name: 'Etl name'
      };

      done();
    });
  });

  it('should be able to save a Etl if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Etl
        agent.post('/api/etls')
          .send(etl)
          .expect(200)
          .end(function (etlSaveErr, etlSaveRes) {
            // Handle Etl save error
            if (etlSaveErr) {
              return done(etlSaveErr);
            }

            // Get a list of Etls
            agent.get('/api/etls')
              .end(function (etlsGetErr, etlsGetRes) {
                // Handle Etl save error
                if (etlsGetErr) {
                  return done(etlsGetErr);
                }

                // Get Etls list
                var etls = etlsGetRes.body;

                // Set assertions
                (etls[0].user._id).should.equal(userId);
                (etls[0].name).should.match('Etl name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Etl if not logged in', function (done) {
    agent.post('/api/etls')
      .send(etl)
      .expect(403)
      .end(function (etlSaveErr, etlSaveRes) {
        // Call the assertion callback
        done(etlSaveErr);
      });
  });

  it('should not be able to save an Etl if no name is provided', function (done) {
    // Invalidate name field
    etl.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Etl
        agent.post('/api/etls')
          .send(etl)
          .expect(400)
          .end(function (etlSaveErr, etlSaveRes) {
            // Set message assertion
            (etlSaveRes.body.message).should.match('Please fill Etl name');

            // Handle Etl save error
            done(etlSaveErr);
          });
      });
  });

  it('should be able to update an Etl if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Etl
        agent.post('/api/etls')
          .send(etl)
          .expect(200)
          .end(function (etlSaveErr, etlSaveRes) {
            // Handle Etl save error
            if (etlSaveErr) {
              return done(etlSaveErr);
            }

            // Update Etl name
            etl.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Etl
            agent.put('/api/etls/' + etlSaveRes.body._id)
              .send(etl)
              .expect(200)
              .end(function (etlUpdateErr, etlUpdateRes) {
                // Handle Etl update error
                if (etlUpdateErr) {
                  return done(etlUpdateErr);
                }

                // Set assertions
                (etlUpdateRes.body._id).should.equal(etlSaveRes.body._id);
                (etlUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Etls if not signed in', function (done) {
    // Create new Etl model instance
    var etlObj = new Etl(etl);

    // Save the etl
    etlObj.save(function () {
      // Request Etls
      request(app).get('/api/etls')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Etl if not signed in', function (done) {
    // Create new Etl model instance
    var etlObj = new Etl(etl);

    // Save the Etl
    etlObj.save(function () {
      request(app).get('/api/etls/' + etlObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', etl.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Etl with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/etls/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Etl is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Etl which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Etl
    request(app).get('/api/etls/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Etl with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Etl if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Etl
        agent.post('/api/etls')
          .send(etl)
          .expect(200)
          .end(function (etlSaveErr, etlSaveRes) {
            // Handle Etl save error
            if (etlSaveErr) {
              return done(etlSaveErr);
            }

            // Delete an existing Etl
            agent.delete('/api/etls/' + etlSaveRes.body._id)
              .send(etl)
              .expect(200)
              .end(function (etlDeleteErr, etlDeleteRes) {
                // Handle etl error error
                if (etlDeleteErr) {
                  return done(etlDeleteErr);
                }

                // Set assertions
                (etlDeleteRes.body._id).should.equal(etlSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Etl if not signed in', function (done) {
    // Set Etl user
    etl.user = user;

    // Create new Etl model instance
    var etlObj = new Etl(etl);

    // Save the Etl
    etlObj.save(function () {
      // Try deleting Etl
      request(app).delete('/api/etls/' + etlObj._id)
        .expect(403)
        .end(function (etlDeleteErr, etlDeleteRes) {
          // Set message assertion
          (etlDeleteRes.body.message).should.match('User is not authorized');

          // Handle Etl error error
          done(etlDeleteErr);
        });

    });
  });

  it('should be able to get a single Etl that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Etl
          agent.post('/api/etls')
            .send(etl)
            .expect(200)
            .end(function (etlSaveErr, etlSaveRes) {
              // Handle Etl save error
              if (etlSaveErr) {
                return done(etlSaveErr);
              }

              // Set assertions on new Etl
              (etlSaveRes.body.name).should.equal(etl.name);
              should.exist(etlSaveRes.body.user);
              should.equal(etlSaveRes.body.user._id, orphanId);

              // force the Etl to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Etl
                    agent.get('/api/etls/' + etlSaveRes.body._id)
                      .expect(200)
                      .end(function (etlInfoErr, etlInfoRes) {
                        // Handle Etl error
                        if (etlInfoErr) {
                          return done(etlInfoErr);
                        }

                        // Set assertions
                        (etlInfoRes.body._id).should.equal(etlSaveRes.body._id);
                        (etlInfoRes.body.name).should.equal(etl.name);
                        should.equal(etlInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Etl.remove().exec(done);
    });
  });
});
