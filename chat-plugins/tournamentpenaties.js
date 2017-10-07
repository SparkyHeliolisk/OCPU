'use strict';

//const path = require('path');
const FS = require('fs');

exports.commands = {
	sm: 'stopmatch',
	stopmatch: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		this.add("|raw|<div class=\"broadcast-red\"><center>You must stop the match until the tournament judge " + user.name + " has said otherwise. If you do not, you will recieve a warning</center></div>.");
		let message = " MATCHSTOP: " + room.id + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	cm: 'continuematch',
	continuematch: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		this.add("|raw|<div class=\"broadcast-green\"<center>Tournament judge " + user.name + " has allowed the match to continue. If this is not the same judge that stopped the match, the head judge and/or TO must be called in and declare the match to be allowed to continue.</center></div>");
		let message = " MATCHCONTINUE: " + room.id + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	warning: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		this.add(this.target + " has been warned for breaking a tournament rule by tournament judge " + user.name + ".");
		targetUser.popup("You have been warned for breaking a tournament rule. You will be notified by tournament judge " + user.name + " as to why you recieved a warning.");
		let message = " WARNING: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	hpdrop: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has been recieved the HP Drop penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have recieved the HP Drop penalty from tournament judge " + user.name +". You should get an explination as to why you recieved this punishment.");
		let message = " HP DROP: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	ko: 'knockout',
	knockout: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has recieved the Knockout penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have recieved the Knockout penalty from tournament judge " + user.name + ". You should get an explination as to why you recieved this punishment.");
		let message = " KNOCKOUT: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	mko: 'multiknockout',
	multiknockout: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has recieved the Multi-Knockout penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have recieved the Multi-Knockout penalty from tournament judge " + user.name + ". You should get an explination as to why you recieved this punishment.");
		let message = " MULTI-KNOCKOUT: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	gl: 'gameloss',
	gameloss: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has recieved the Game Loss penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have recieved the Game Loss penalty from tournament judge " + user.name + ". You should get an explination as to why you recieved this punishment.");
		let message = " GAMELOSS: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	mgl: 'multigameloss',
	multigameloss: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has recieved the Multi-Game Loss penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have recieved the Multi-Game Loss penalty from tournament judge " + user.name + ". You should get an explination as to why you recieved this punishment.");
		let message = " MULTI-GAMELOSS: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	dq: 'disqualification',
	disqualification: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(this.target + " has been disqualified by tournament judge " + user.name + ".");
		room.modchat = '&';
		this.add("|raw|<div class=\"broadcast-red\"><center>This match MUST stop and a global & or ~ called into the match. All global staff have been notified.The judge " + user.name + " MUST tell the head judge and/or TO and the & or ~ why they gave this penalty.</cetner></div>");
		this.add("|raw|<div class=\"broadcast-red\"><center>The & or ~ will tell the offending player in this chat about the reason why. Even if no action is taken agaisnt that user, their record must still be expunged.</center></div>");
		targetUser.popup("You have been disqualificated by tournament judge " + user.name + ". You should get an explination as to why you recieved this punishment by a global & or ~.");
		let message = " DISQUALIFICATION: " + this.target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
}
