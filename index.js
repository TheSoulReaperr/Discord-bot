const Discord = require('discord.js');
const client = new Discord.Client();
var data = {};
var events = [];
client.login('ODA1ODMzNDg4ODgzMzg0MzUx.YBgo6w.ep8L5t7Ch1pxAMOZIb3MRQtfagw');

client.on('ready', () => {
	console.log('Success');
});

client.on('message', (msg) => {
	if(msg.content[0] == '?' && msg.channel.id == '410827254042591243') {
		var content = msg.content.split(" ");
		data.command = content[0].replace('?', '');
		data.user = msg.author.username;
		switch(data.command) {
			case 'new': createNewEvent(msg, data.user, content[1], content[2], content[3], content[4], content[5]); break;
			case 'showEvents': showAllEvents(msg); break;
			case 'bet': placeNewBet(msg, data.user, content[1], content[2], content[3], content[4]); break;
			case 'showAllBets': showAllBets(msg, content[1]); break;
			case 'showTotals': showTotalBets(msg, content[1]);
		}
	}
});

function createNewEvent(msg, user, p1, p2, m1, m2, m3) {
	if(user == 'kingstun' || user == 'Soul_Reaper') {
		events.push(new Event(msg, user, p1, p2, m1, m2, m3));
		events[events.length - 1].displayNewEvent();
	} else {
		msg.channel.send('You dont have the permission to create events');
	}
}

function placeNewBet(msg, user, event, p, m, b) {
	var eventIndex = getEventFromName(msg, event);
	if(eventIndex == -1) {
		msg.reply('Event Not Found');
	} else {
		events[eventIndex].placeBet(msg, user, p, m, b);
	}
}

function showAllEvents(msg) {
	var eventName = '```';
	for(var i=0; i<events.length; i++) {
		eventName += '\n' + events[i].name;
	}
	msg.channel.send(eventName + '```');
}

function showAllBets(msg, eventName) {
	var eventIndex = getEventFromName(msg, eventName);
	if(eventIndex == -1) {
		msg.reply('Event Not Found');
	} else {
		events[eventIndex].displayBetHistory(msg);
	}
}

function showTotalBets(msg, eventName) {
	var eventIndex = getEventFromName(msg, eventName);
	if(eventIndex == -1) {
		msg.reply('Event Not Found');
	} else {
		events[eventIndex].displayTotalBets(msg);
	}
}

class Event {
	bets = [];
	totalBets =[[]];
	constructor(msg, user, p1, p2, m1, m2, m3) {
		this.message = msg;
		this.user = user;
		this.name = p1 + 'vs' + p2;
		this.player1 = p1;
		this.player2 = p2;
		this.map1 = m1;
		this.map2 = m2;
		this.map3 = m3;
	}

	displayNewEvent() {
		this.message.channel.send('```\n New Event Created: ' + this.name + '\n Player1: ' + this.player1 + '\n Player2: ' + this.player2 + '\n Map1: ' + this.map1 + '\n Map2: ' + this.map2 + '\n Map3: ' + this.map3 + '```');
	}

	displayTotalBets() {
		for(let)
	}

	displayBet(msg) {
		var displayText = '```';
		if(this.bets.length == 0) {
			displayText = 'No bets have been placed for ' + this.name;
		} else {
			displayText += this.name;
			for(var i=0; i<this.bets.length; i++) {
				displayText += '\n' + this.bets[i].player + ':\n   ' + this.bets[i].map + ':\n      ' + this.bets[i].user + ': ' + this.bets[i].bet;
			}
			displayText += '```';
		}
		msg.channel.send(displayText);
	}

	displayBetHistory(msg) {
		var displayText = '```';
		if(this.bets.length == 0) {
			displayText = 'No bets have been placed for ' + this.name;
		} else {
			displayText += this.name;
			for(var i=0; i<this.bets.length; i++) {
				displayText += '\n' + this.bets[i].user + ' is betting ' + this.bets[i].bet + ' on ' + this.bets[i].player + ' for ' + this.bets[i].map;
			}
			displayText += '```';
		}
		msg.channel.send(displayText);
	}

	placeBet(msg, u, p, m, b) {
		if(p == this.player1) {
			if(m == this.map1) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1);
			} else if(m == this.map2) {
				this.bets.push(new Bet(u, p, m, b))
				this.p1m2total += b;
				msg.reply('Your bet is placed');
			} else if(m == this.map3) {
				this.bets.push(new Bet(u, p, m, b))
				this.p1m3total += b;
				msg.reply('Your bet is placed');
			} else {
				msg.reply('Invalid Map');
			}
		} else if(p == this.player2) {
			if(m == this.map1) {
				this.bets.push(new Bet(u, p, m, b))
				this.p2m1total += b;
				msg.reply('Your bet is placed');
			} else if(m == this.map2) {
				this.bets.push(new Bet(u, p, m, b))
				this.p2m2total += b;
				msg.reply('Your bet is placed');
			} else if(m == this.map3) {
				this.bets.push(new Bet(u, p, m, b))
				this.p2m3total += b;
				msg.reply('Your bet is placed');
			} else {
				msg.reply('Invalid Map');
			}
		} else {
			msg.reply('Invalid Player Name');
		}
	}

	insertOrUpdateBet(msg, u, p, m, b , pi, mi) {
		var exists = false;
		for(let i=0; i<this.bets.length; i++) {
			if(this.bets[i].user == u && this.bets[i].player == p && this.bets[i].map == m) {
				this.totalBets[pi-1][mi-1] + (this.bets[i].bet - b);
				this.bets[i].bet = b;
				msg.reply(this.totalBets[pi-1][mi-1]+'Your bet is updated');
				exists = true;
				break;
			}
		}
		if(!exists) {
			this.bets.push(new Bet(u, p, m, b))
			this.totalBets[pi-1][mi-1] += b;
			msg.reply(this.totalBets[pi-1][mi-1]+'Your bet is placed');
		}
	}
}

class Bet {
	constructor(u, p, m, b) {
		this.user = u;
		this.player = p;
		this.map = m;
		this.bet = b;
	}
}

function getEventFromName(msg, eventName) {
	for(let i=0; i<events.length; i++) {
		if(events[i].name == eventName) {
			return i;
		}
	}
	return -1;
}