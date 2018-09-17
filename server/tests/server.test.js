const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should return 3 todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(3);
    })
    .end(done);
  });
});

describe('GET /todo/:id', () => {
  it('should return a todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return a todo for ObjectID not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID()}`)
    .expect(404)
    .end(done);
  });
  
  it('should not return a todo for invalid ObjectID', (done) => {
    request(app)
    .get('/todos/1234')
    .expect(400)
    .end(done);
  });
});

describe('DELETE /todo/:id', () => {
  it('should return a todo that was deleted', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      Todo.findById(hexId).then((findRes) => {
        expect(findRes).toNotExist();
        done();
      });
    });   
  });

  it('should return a 404 on a todo not found', (done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
    .end(done);
  });

  it('should return 400 for and invalid todo id', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(400)
    .end(done);
  });
});

describe('PATCH /todo/:id', () => {
  it('should change completed to true', (done) => {
    request(app)
    .patch(`/todos/${todos[1]._id}`)
    .send(
      {
        text: 'Second test todo updated',
        completed: true
      })
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe('Second test todo updated');
      expect(res.body.completed).toBeTruthy();
      expect(res.body.completedAt).toNotBe('333444');
    })
    .end(done);
  });

  it('should change the completed to false', (done) => {
    request(app)
    .patch(`/todos/${todos[1]._id}`)
    .send(
      {
        completed: false
      })
    .expect(200)
    .expect((res) => {
      expect(res.body.completed).toBe(false);
      expect(res.body.completedAt).toNotExist();
    })
    .end(done)
  })
});

describe('GET /users/me', () => {
  it('should return user if autenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
  });

  it('should return 401 if not autenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var newUser = {
      email: 'suzyido3@yahoo.com',
      password: 'userThreePass',  
    };

    request(app)
    .post('/users')
    .send(newUser)
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body.email).toBe(newUser.email);
      expect(res.body._id).toExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.find({email: newUser.email}).then((user) => {
        expect(user).toExist();
        expect(user.length).toBe(1);
        expect(user.password).toNotBe(newUser.password);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({email: 'abcd', password: ''})
    .expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
    request(app)
    .post('/users')
    .send({email: users[0].email, password: users[0].password})
    .expect(400)
    .end(done);
  });
});

describe('POST /users/login', () => {
  it('should return a token when a valid email/password is sent', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: users[1].password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(users[1].email);
      expect(res.headers['x-auth']).toExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((err) => done(err));
    });
  });

  it('should return 400 when an invalid email/password is sent', (done) => {
    request(app)
    .post('/users/login')
    .send({email: users[1].email, password: 'wrongpassword'})
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toNotExist();
    })
    .end((err, res) => {
      if(err) {
        return done(err);
      }
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((err) => done(err));
    });
  }); 
});