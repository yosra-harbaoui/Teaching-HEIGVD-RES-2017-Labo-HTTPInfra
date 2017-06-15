$(function() {
	console.log("Loading students.js");

	function loadCreditCards() {
		$.getJSON( "/api/cards/", function( cards ) {
			console.log(cards);
            var message = "No cards available";
            if( cards.length > 0 ) {
				message = cards[0].creditCardType + " " + cards[0].creditCardNumber;
            }
            $(".lead").text(message);
        });
	};   
	loadCreditCards();
	setInterval(loadCreditCards, 2000);
});