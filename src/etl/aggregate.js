
var MongoClient = require('mongodb').MongoClient;
var {DATABASE_NAME, CONNECTION_URL} = require('../config.js');


/*
This sets up the mongodb client so aggregates can run using node
*/
MongoClient.connect(CONNECTION_URL, function (err, db) {
  if (err) throw err;
  var dbo = db.db(DATABASE_NAME);
  //this adds each photo's url to its respective answer as an array

  dbo.collection('photos').aggregate(
      { $group:
        {
          _id: "$answer_id", photos: { $push: '$url'}
          //ex: { _id: ~answer#123~ photos: [~url1~, ~url2~]}
        }},
      { $addFields:
        {
          id: "$_id" //duplicate id field to match answer index
        } },
      { $unset: '_id'
      //_id matches the photo _id, which
      //will prevent merging with answers
      },
      { $merge:
        {
          into: 'answers',
          on: 'id',
          //find where the photo group's answer_id matches an answer's indexed id
          //this adds the photos property to the answer document
        }
      });
};

//same step as above minus the comments
//all the commands below are for use in mongo CLI
db.photos.aggregate(
    { $group:
      {
        _id: "$answer_id", photos: { $push: '$url'}
        //ex: { _id: ~answer#123~ photos: [~url1~, ~url2~]}
      }},
    { $addFields:
      {
        id: "$_id" //duplicate id field to match answer index
      } },
    { $unset: '_id'
    //_id matches the photo _id, which
    //will prevent merging with answers
    },
    { $merge:
      {
        into: 'answers',
        on: 'id',
        //find where the photo group's answer_id matches an answer's indexed id
        //this adds the photos property to the answer document
      }
    })

//this embeds all answers as an array of subdocuments into their respective questions
db.answers.aggregate([
  {
    $group:
    {_id: "$question_id", answers: { $push: '$$ROOT' }}
  },
  {
    $merge:
    {
      into: 'questions',
      on: '_id',
    }
  }], { "allowDiskUse": true });

db.photos.aggregate([
  {
    $group:
    {
      _id: "$answer_id", photos: { $push: '$url' }
    }
  },
  {
    $merge:
    {
      into: 'answers',
      on: '_id',
    }
  }], { "allowDiskUse": true })