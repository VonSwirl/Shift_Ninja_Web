var mongoose = require('mongoose');
var expect = require('chai').expect
var Recruit = require('../models/recruitsModel');
var Post = require('./postTest');
var recruits = require('./testData/recruitTest.json').users
var posts = require('./testData/postTest.json').posts

mongoose.Promise = global.Promise

describe('mongoose-datatables', function () {
  before(function (done) {
    mongoose.connect('mongodb://localhost/mongoose-datatables', function (err) {
        Recruit.remove({})
      .then(function () { return Post.remove({}) })
      .then(function () { return Recruit.create(recruits) })
      .then(function () { return Post.create(posts) })
      .then(function () { done() })
    })
  })

  it('callback compatibily', function (done) {
    Recruit
      .dataTables({
        skip: 0,
        limit: 10,
      }, (err, table) => {
        expect(table.data.length).equal(2)
        expect(table.total).equal(2)
        done()
      })
  })

  it('no options', function (done) {
    Recruit
      .dataTables({
        skip: 0,
        limit: 10,
      }).then(table => {
        expect(table.data.length).equal(2)
        expect(table.total).equal(2)
        done()
      }).catch(done)
  })

  it('find', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 10,
      find: {
        username: 'berser'
      }
    }).then(table => {
      expect(table.data[0].username).equal('berser')
      done()
    }).catch(done)
  })

  it('select', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 10,
      select: {
        first_name: 1
      }
    }).then(table => {
      expect(table.data[0].username).undefined
      expect(table.data[0].last_name).undefined
      expect(table.data[0].first_name).exist
      done()
    }).catch(done)
  })

  it('sort', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 10,
      sort: {
        username: -1
      }
    }).then(table => {
      expect(table.data[0].username).equal('berser')
      done()
    }).catch(done)
  })

  it('sort using order and columns params', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 10,
      columns: [
        { data: 'first_name' },
        { data: 'last_name' },
        { data: 'username' },
      ],
      order: [
        {
          column: 0,
          dir: 'asc'
        }
      ]
    }).then(table => {
      expect(table.data[0].first_name).equal('Antonio')
      done()
    }).catch(done)
  });

  it('search', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 10,
      search: {
        value: 'archr',
        fields: ['username']
      },
    }).then(table => {
      expect(table.data.length).equal(1)
      expect(table.data[0].username).equal('archr')
      done()
    }).catch(done)
  })

  it('limit', function (done) {
    Recruit.dataTables({
      skip: 0,
      limit: 1,
    }).then(table => {
      expect(table.data.length).equal(1)
      expect(table.total).equal(2)
      expect(table.total).equal(2)
      done()
    }).catch(done)
  })

  describe('Datakey and totalKey', function () {
    it('no options', function (done) {
      Post.dataTables({}).then(table => {
        expect(table.amount).equal(2)
        expect(table.posts[0].title).equal('Top Node Links of the Week')
        expect(table.posts[1].title).equal('React’s new Context API')
        done()
      }).catch(done)
    })

    it('find', function (done) {
      Post.dataTables({
        find: {
          title: 'Top Node Links of the Week'
        }
      }).then(table => {
        expect(table.posts.length).equal(1)
        expect(table.amount).equal(1)
        expect(table.posts[0].title).equal('Top Node Links of the Week')
        done()
      }).catch(done)
    })

    it('should call formatter from query', function (done) {
      Post.dataTables({
        formatter: function(post) {
          return {
            item: post.title
          }
        }
      }).then(table => {
        expect(table.posts.length).equal(2)
        expect(table.amount).equal(2)
        expect(table.posts[0].item).equal('Top Node Links of the Week')
        expect(table.posts[1].item).equal('React’s new Context API')
        done()
      }).catch(done)
    })

    it('formatter from options', function (done) {
      Post.dataTables({
        formatter: 'toPublic',
      }).then(table => {
        expect(table.posts.length).equal(2)
        expect(table.amount).equal(2)
        expect(table.posts[0].item).equal('Top Node Links of the Week')
        expect(table.posts[1].item).equal('React’s new Context API')
        done()
      }).catch(done)
    })
  })

  describe('Formatters', function () {
    it('should call formatter from query', function (done) {
        Recruit.dataTables({
        formatter: function(user) {
          return {
            name: user.first_name + ' ' + user.last_name
          }
        }
      }).then(table => {
        expect(table.data.length).equal(2)
        expect(table.data[0].name).equal('Jorge Sandoval')
        expect(table.data[1].name).equal('Antonio Garcia')
        done()
      }).catch(done)
    })

    it('formatter from options', function (done) {
        Recruit.dataTables({
        formatter: 'toPublic',
      }).then(table => {
        expect(table.data.length).equal(2)
        expect(table.data[0].name).equal('Jorge Sandoval')
        expect(table.data[1].name).equal('Antonio Garcia')
        done()
      }).catch(done)
    })

    it('should throw error for invalid string name for a formatter', function (done) {
        Recruit.dataTables({
        formatter: 'invalid'
      }).then(table => {
        done(new Error('Error wasn\'t throw for invalid formatter'))
      }).catch(function (err) {
        expect(err.message).equal('Invalid formatter')
        done()
      })
    })

    it('should throw error for invalid formatter type', function (done) {
        Recruit.dataTables({
        formatter: {}
      }).then(table => {
        done(new Error('Error wasn\'t throw for invalid formatter'))
      }).catch(function (err) {
        expect(err.message).equal('Invalid formatter')
        done()
      })
    })
  })
})