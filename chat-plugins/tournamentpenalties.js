'use strict';

//const path = require('path');
const FS = require('fs');

exports.commands = {
	sm: 'stopmatch',
	stopmatch: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		this.add("|raw|<div class=\"broadcast-red\"><center>You must stop the match until the tournament judge " + user.name + " has said otherwise. If you do not, you will receive a warning</center></div>.");
		let message = "MATCHSTOP: " + room.id + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] ' + message + '\n');
	},
	cm: 'continuematch',
	continuematch: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		this.add("|raw|<div class=\"broadcast-green\"<center>Tournament judge " + user.name + " has allowed the match to continue. If this is not the same judge that stopped the match, the head judge and/or TO must be called in and declare the match to be allowed to continue.</center></div>");
		let message = "MATCHCONTINUE: " + room.id + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	warning: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		this.add(target + " has been warned for breaking a tournament rule by tournament judge " + user.name + ".");
		targetUser.popup("You have been warned for breaking a tournament rule. You will be notified by tournament judge " + user.name + " as to why you received a warning.");
		let message = " WARNING: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	hpdrop: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has been received the HP Drop penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have received the HP Drop penalty from tournament judge " + user.name + ". You should get an explanation as to why you received this punishment.");
		let message = "HP DROP: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	ko: 'knockout',
	knockout: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has received the Knockout penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have received the Knockout penalty from tournament judge " + user.name + ". You should get an explanation as to why you received this punishment.");
		let message = "KNOCKOUT: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	mko: 'multiknockout',
	multiknockout: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has received the Multi-Knockout penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have received the Multi-Knockout penalty from tournament judge " + user.name + ". You should get an explanation as to why you received this punishment.");
		let message = "MULTI-KNOCKOUT: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	gl: 'gameloss',
	gameloss: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has received the Game Loss penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have received the Game Loss penalty from tournament judge " + user.name + ". You should get an explanation as to why you recieved this punishment.");
		let message = "GAMELOSS: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	mgl: 'multigameloss',
	multigameloss: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has received the Multi-Game Loss penalty by tournament judge " + user.name + ".");
		targetUser.popup("You have received the Multi-Game Loss penalty from tournament judge " + user.name + ". You should get an explanation as to why you received this punishment.");
		let message = "MULTI-GAMELOSS: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
	dq: 'disqualification',
	disqualification: function (target, room, user) {
		if (!this.can('tournamentstaff')) return this.errorReply("You cannot use this command!");
		if (!room.battle) return this.errorReply("This can only be used in a battle!");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User ' " + this.targetUsername + " ' not found.");
		this.add(target + " has been disqualified by tournament judge " + user.name + ".");
		room.modchat = '&';
		this.add("|raw|<div class=\"broadcast-red\"><center>This match MUST stop and a global & or ~ called into the match. All global staff have been notified.The judge " + user.name + " MUST tell the head judge and/or TO and the & or ~ why they gave this penalty.</cetner></div>");
		this.add("|raw|<div class=\"broadcast-red\"><center>The & or ~ will tell the offending player in this chat about the reason why. Even if no action is taken against that user, their record must still be expunged.</center></div>");
		targetUser.popup("You have been disqualificated by tournament judge " + user.name + ". You should get an explanation as to why you received this punishment by a global & or ~.");
		let message = "DISQUALIFICATION: " + target + " by judge " + user.name + ".";
		FS.appendFile('logs/modlog/modlog_servertournament.txt', '[' + new Date().toUTCString() + '] (servertournament) ' + message + '\n');
	},
};
