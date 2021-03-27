const readDb = require('./readOps.js');
const writeDb = require('./writeOps.js');

module.exports.getQuestions = (id, page = 1, count = 5) => {
  let query = {
    product_id: parseInt(id),
    reported: 0
  };
  let omitFields = {
    'product_id': 0,
    'asker_email': 0
  };
  return readDb.getList('Questions', query, omitFields, page, count).then((results) => {
    results = results.filter((q) => {
      return q.reported === 0;
    });
    return results;
  });;
};

module.exports.addQuestion = (newQ) => {
  let doc = {
    product_id: parseInt(newQ.product_id),
    body: newQ.body,
    asker_name: newQ.name,
    asker_email: newQ.email,
    date_written: new Date(),
    reported: 0,
    helpful: 0,
    answers: []
  }
  console.log(doc);
  return writeDb.addDoc('Questions', doc);
};

module.exports.markHelpful = (question_id) => {
  let filter = { _id: question_id};
  let updateDoc = {
    $inc: {
      helpful: 1
    }
  }
  return writeDb.updateDoc('Questions', filter, updateDoc);
};

module.exports.report = (question_id) => {
  let filter = { _id: question_id };
  let updateDoc = {
    $inc: {
      report: 1
    }
  }
  return writeDb.updateDoc('Questions', filter,)
};
