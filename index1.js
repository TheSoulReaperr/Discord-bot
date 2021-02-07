const Discord = require('discord.js');
const client = new Discord.Client();
var data = {};
var events = [];
client.login('ODA1ODMzNDg4ODgzMzg0MzUx.YBgo6w.W3Sspy0jor52I0pw0tjH7w-3bkc');

client.on('ready', () => {
	console.log('Success');
});

client.on('message', (msg) => {
	if(msg.content[0] == '?' && msg.channel.id == '410827254042591243') {
		var content = msg.contentsplit(" ");
		data.command = content[0].replace('?', '');
		data.user = msg.author.username;
		switch(data.command) {
			case 'new': createNewEvent(msg, data.user, content[1], content[2], content[3], content[4], content[5]); break;
			//case 'showEvents': showAllEvents(msg); break;
			//case 'bet': placeNewBet(msg, data.user, content[1], content[2], content[3], content[4]); break;
			//case 'showAllBets': showAllBets(msg, content[1]); break;
			//case 'showTotals': showTotalBets(msg, content[1]); break;
			//case 'event': showEventDetails(msg, content[1]); break;
		}
	}
});

class Event {
	bets = [];
	totalBets = [[0, 0, 0], [0, 0, 0]];
	constructor(msg, user, p1, p2, m1, m2, m3) {
		this.message = msg;
		this.user = user;
		this.name = p1 + 'vs' + p2;
		this.displayText;
		this.player1 = p1;
		this.player2 = p2;
		this.map1 = m1;
		this.map2 = m2;
		this.map3 = m3;
	}
}