const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/todo';

mongoose.connect(url, {useNewUrlParser: true});

// exporta o mongoose para ser utilizado em outros lugares do projeto
module.exports = mongoose;
