const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const id = new ObjectID();
const otherId = new ObjectID();

const todos = [
  {
    _id: id,
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: false,
    completedAt: 333444
  },
  {
    text: 'Third test todo'
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
    .get(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should not return a todo for ObjectID not found', (done) => {
    request(app)
    .get(`/todos/${otherId}`)
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
    var hexId = id.toHexString();
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
    var hexId = otherId.toHexString();
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