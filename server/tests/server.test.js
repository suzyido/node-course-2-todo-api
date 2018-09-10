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
    text: 'Second test todo'
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