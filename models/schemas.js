const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  url: Number,
})

const answerSchema = new mongoose.Schema({
  id: Number,
  quesion_id: Number,
  body: String,
  date: { type: Date, default: Date.now },
  answerer_name: String,
  helpfulness: Number,
  reported: { type: Number, default: 0 },
  photos: [photoSchema]
});

const questionSchema = new mongoose.Schema({
  product_id: Number,
  id: Number,
  body: String,
  date: { type: Date, default: Date.now },
  asker_name: String,
  asker_email: String,
  helpfulness: Number,
  reported: { type: Number, default: 0 },
  answers: [answerSchema]
});

const Photo = mongoose.model('Photo', photoSchema);
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = {
  Photo: Photo,
  Question: Question,
  Answer: Answer
}