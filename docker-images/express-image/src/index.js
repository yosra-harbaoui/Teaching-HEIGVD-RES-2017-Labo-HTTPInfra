var Chance = require('chance');
var chance = new Chance();

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send(generateCreditCards());
});

app.listen(3000, function () {
  console.log('Accepting HTTP requests on port 3000!');
});

function generateCreditCards() {
	var numberOfCreditCards = chance.integer({
		min: 0,
		max: 10
	});
	console.log(numberOfCreditCards);
	var creditCards = [];
	for(var i = 0; i < numberOfCreditCards; i++) {
		var cc_type = chance.cc_type();
		var cc_number = chance.cc({type: cc_type});
		creditCards.push({
			creditCardType: cc_type,
			creditCardNumber : cc_number
		});	
	};
	console.log(creditCards)
	return creditCards;
}