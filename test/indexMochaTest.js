var mongoose = require('mongoose');
var expect = require('chai').expect
var Recruit = require('../models/recruitsModel');
var recruitsData = require('./testData/recruitTestData.json');

mongoose.Promise = global.Promise

//"C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe"
//LOCAL DB MUST BE RUNNING
//To run suite terminal => npm test
describe('#### SHIFT NINJA WEB, MOCHA TEST SUITE ####' +
  '\n\t-Tests include:' +
  '\n\t-DataTables configuration, ordering, ' +
  '\n\tsearching, and formatting.' +
  '\n\t-Recruits Model key value validation.' +
  '\n###########################################################', function () {
    before(function (done) {
      mongoose.connect('mongodb://localhost/recruits', function (err) {
        if (err) {
          console.log(err);
        } else {
          Recruit.remove({})
            //.then(function () { return Post.remove({}) })
            .then(function () { return Recruit.create(recruitsData) })
            .then(function () { done() }).catch(err);
        }
      });
    });

    it('Recruit Datatable callback compatibily', function (done) {
      Recruit
        .dataTables({
          skip: 0,
          limit: 10,
        }, (err, table) => {
          expect(table.data.length).equal(3)
          expect(table.total).equal(3)
          done()
        }).catch(done)
    })

    it('Recruit Datatable with additional no options included', function (done) {
      Recruit
        .dataTables({
          skip: 0,
          limit: 10,
        }).then(table => {
          expect(table.data.length).equal(3)
          expect(table.total).equal(3)
          done()
        }).catch(done)
    })

    it('Find a Recruit by recRecruitRef:', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 10,
        find: {
          recRecruitRef: '001Ref'
        }
      }).then(table => {
        expect(table.data[0].recFirstN).equal('John')
        done()
      }).catch(done)
    })

    it('Datatable select single Recruit', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 10,
        select: {
          first_name: 1
        }
      }).then(table => {
        expect(table.data[0].username).undefined
        expect(table.data[0].last_name).undefined
        expect(table.data[0].first_name).not.exist
        done()
      }).catch(done)
    })

    it('Sort Datatable by first name', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 10,
        sort: {
          recFirstN: -1
        }
      }).then(table => {
        expect(table.data[0].recFirstN).equal('Paul')
        done()
      }).catch(done)
    })

    it('Sort Datatable using order and columns params', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 10,
        columns: [
          { data: 'recID' },
          { data: 'recRecruitRef' },
          { data: 'recTitle' },
          { data: 'recFirstN' },
          { data: 'recSurN' },
          { data: 'recForeN' },
          { data: 'recAddress' },
          { data: 'recMobile' },
          { data: 'allQuals' },
          { data: 'recActive' },
          { data: 'recExperience' },
          { data: 'recProfilePic' },
          { data: 'allShifts' }
        ],
        order: [
          {
            column: 0,
            dir: 'asc'
          }
        ]
      }).then(table => {
        expect(table.data[0].recFirstN).equal('John')
        expect(table.data[0].recActive).equal(true)
        done()
      }).catch(done)
    });

    it('Search for Recruit via Datatable search function', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 10,
        search: {
          value: 'Emma',
          fields: ['recFirstN']
        },
      }).then(table => {
        expect(table.data.length).equal(1)
        expect(table.data[0].recFirstN).equal('Emma')
        done()
      }).catch(done)
    })

    it('Limit the amount of rows loaded on each Datatable page', function (done) {
      Recruit.dataTables({
        skip: 0,
        limit: 1,
      }).then(table => {
        expect(table.data.length).equal(1)
        expect(table.total).equal(3)
        done()
      }).catch(done)
    })

    describe('Formatters option tests', function () {
      it('Should call formatter from query  first name + last name', function (done) {
        Recruit.dataTables({
          formatter: function (recruit) {
            return {
              name: recruit.recFirstN + ' ' + recruit.recSurN
            }
          }
        }).then(table => {
          expect(table.data.length).equal(3)
          expect(table.data[0].name).equal('John Smith')
          expect(table.data[1].name).equal('Paul Harrison')
          expect(table.data[2].name).equal('Emma Bates')
          done()
        }).catch(done)
      })

      it('Should throw error for invalid string name for a formatter', function (done) {
        Recruit.dataTables({
          formatter: 'invalid'
        }).then(table => {
          done(new Error('Error wasn\'t throw for invalid formatter'))
        }).catch(function (err) {
          expect(err.message).equal('Invalid formatter')
          done()
        })
      })

      it('Should throw error for invalid formatter type', function (done) {
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