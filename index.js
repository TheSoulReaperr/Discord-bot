const Discord = require('discord.js');
const client = new Discord.Client();
var data = {};
var events = [];
client.login('');

client.on('ready', () => {
	console.log('Success');
});

client.on('message', (msg) => {
	if(msg.content[0] == '?' && (msg.channel.id == '410827254042591243' || msg.channel.id == '807661922706784296')) {
		//var content = msg.content.toLowerCase();
		var content = msg.content.split(" ");
		content = content.filter((item) => { return item != ''});
		data.command = content[0].replace('?', '');
		data.user = msg.author.username;
		switch(data.command) {
			case 'newEvent': createNewEvent(msg, data.user, content[1], content[2], content[3], content[4], content[5]); break;
			case 'showEvents': showAllEvents(msg); break;
			case 'bet': placeNewBet(msg, data.user, content[1], content[2], content[3], content[4]); break;
			case 'showAllBets': showAllBets(msg, content[1]); break;
			case 'event': showEventDetails(msg, content[1]); break;
			case 'closeMap': closeMap(msg, data.user, content[1], content[2]); break;
			case 'closeEvent': closeEvent(msg, data.user, content[1]);
			case 'help': showHelp(msg);
		}
	}
});

function showHelp(msg) {
	var displayText = '```\n Help\n ?help										   Commands on managing the bot \n' + 
					' ?newEvent Player1 Player2 Map1 Map2 Map3		To create a new Event \n' + 
					' ?showEvents									 Shows all created Events \n' + 
					' ?event EventName								Shows the details of the Event \n' +
					' ?bet EventName Player Map Money				 Bet on a Player on a Map \n' +
					' ?showAllBets EventName						  Shows all bets \n' +
					' ?closeMap EventName Map						 Close betting on the Map \n' +
					' ?closeEvent EventName						   Close betting on the Map'
	msg.channel.send(displayText + '```');
}

function createNewEvent(msg, user, p1, p2, m1, m2, m3) {
	if(user == 'kingstun' || user == 'Soul_Reaper' || user == 'hemu') {
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
	} else if(!events[eventIndex].eventStatus) {
		msg.reply(eventName + ' is Closed');
	} else {
		events[eventIndex].placeBet(msg, user, p, m, b);
	}
}

function showAllEvents(msg) {
	var eventName = '```';
	for(var i=0; i<events.length; i++) {
		eventName += '\n' + events[i].name + '   ' + (events[i].eventStatus ? 'Open': 'Closed');
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

function showEventDetails(msg, eventName) {
	var eventIndex = getEventFromName(msg, eventName);
	if(eventIndex == -1) {
		msg.reply('Event Not Found');
	} else {
		events[eventIndex].displayBets(msg);
	}
}

function closeMap(msg, user, eventName, map) {
	if(user == 'kingstun' || user == 'Soul_Reaper' || user == 'hemu') {
		var eventIndex = getEventFromName(msg, eventName);
		if(eventIndex == -1) {
			msg.reply('Event Not Found');
		} else {
			events[eventIndex].closeMap(msg, map);
		} 
	} else
		msg.reply('You dont have the Permission');
}

function closeEvent(msg, user, eventName) {
	if(user == 'kingstun' || user == 'Soul_Reaper' || user == 'hemu') {
		var eventIndex = getEventFromName(msg, eventName);
		if(eventIndex == -1) {
			msg.reply('Event Not Found');
		} else {
			events[eventIndex].eventStatus = false;
			msg.reply(eventName + ' is closed');
		} 
	} else
		msg.reply('You dont have the Permission');
}

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
		this.map1Status = true;
		this.map2Status = true;
		this.map3Status = true;
		this.eventStatus = true;
	}

	displayNewEvent() {
		this.message.channel.send('```\n New Event Created: ' + this.name + '\n Player1: ' + this.player1 + '\n Player2: ' + this.player2 + '\n Map1: ' + this.map1 + '\n Map2: ' + this.map2 + '\n Map3: ' + this.map3 + '```');
	}

	displayBets(msg) {
		var displayText = '```\n' + this.name + '\n';
		displayText += this.player1 + ':\n  ' + this.map1 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player1 && this.bets[i].map == this.map1) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			}
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		displayText += '\n  ' + this.map2 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player1 && this.bets[i].map == this.map2) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			} 
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		displayText += '\n  ' + this.map3 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player1 && this.bets[i].map == this.map3) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			} 
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		displayText += '\n' + this.player2 + ':\n  ' + this.map1 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player2 && this.bets[i].map == this.map1) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			} 
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		displayText += '\n  ' + this.map2 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player2 && this.bets[i].map == this.map2) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			} 
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		displayText += '\n  ' + this.map3 + ': ';
		for(var i=0; i<this.bets.length; i++) {
			var total = 0;
			var flag = false;
			if(this.bets[i].player == this.player2 && this.bets[i].map == this.map3) {
				displayText += '\n    ' + this.bets[i].user + ': ' + this.bets[i].bet;
				total += this.bets[i].bet;
				flag = true;
			}
			if(flag) displayText += '\n    Total: ' + parseInt(total);
		}
		msg.channel.send(displayText + '```');
	}

	displayBetHistory(msg) {
		var displayText = '```\n';
		if(this.bets.length == 0) {
			displayText = 'No bets have been placed for ' + this.name;
		} else {
			displayText += 'Event' + this.name + '\n';
			for(var i=0; i<this.bets.length; i++) {
				displayText += this.bets[i].user + ' is betting ' + this.bets[i].bet + ' on ' + this.bets[i].player + ' for ' + this.bets[i].map + '\n';
			}
			displayText += '```';
		}
		msg.channel.send(displayText);
	}

	placeBet(msg, u, p, m, b) {
		if(p == this.player1) {
			if(m == this.map1) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map1Status);
			} else if(m == this.map2) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map2Status);
			} else if(m == this.map3) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map3Status);
			} else {
				msg.reply('Invalid Map');
			}
		} else if(p == this.player2) {
			if(m == this.map1) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map1Status);
			} else if(m == this.map2) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map2Status);
			} else if(m == this.map3) {
				this.insertOrUpdateBet(msg, u, p, m, b, 1 , 1, this.map3Status);
			} else {
				msg.reply('Invalid Map');
			}
		} else {
			msg.reply('Invalid Player Name');
		}
	}

	insertOrUpdateBet(msg, u, p, m, b , pi, mi, mS) {
		if(mS) {
			var exists = false;
			for(let i=0; i<this.bets.length; i++) {
				if(this.bets[i].user == u && this.bets[i].player == p && this.bets[i].map == m) {
					this.totalBets[pi-1][mi-1] + (this.bets[i].bet - b);
					this.bets[i].bet = b;
					msg.reply('Your bet is updated');
					exists = true;
					break;
				}
			}
			if(!exists) {
				this.bets.push(new Bet(u, p, m, b))
				this.totalBets[pi-1][mi-1] += b;
				msg.reply('Your bet is placed');
			}
		} else {
			msg.reply('Betting for ' + m + ' is closed');
		}
	}

	closeMap(msg, map) {
		var reply = 'Betting on ' + map + 'is closed';
		if(map == this.map1) this.map1Status = false;
		else if(map == this.map2) this.map2Status = false;
		else if(map == this.map3) this.map3Status = false;
		else reply = 'Invalid Map Name';
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