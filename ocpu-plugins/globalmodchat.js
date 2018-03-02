/**
* This plugin is a security plugin made so that any sysop, if needed, could quickly change all room, pm, and ladder modchat if neccessary
* Created by Jolt(S Jolteon)
*/

'use strict';

exports.commands = {
	lmc: 'laddermodchat',
	laddermodchat: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/laddermodchat - Access denied.");
		}
		if (!Config.gmodchatlock) {
			switch (target) {
				case "off":
					if (Config.laddermodchat === false) return this.errorReply("Ladder Modchat is already disabled!");
					Config.laddermodchat = false;
					this.popupReply("Ladder Modchat disabled.");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">Ladder modchat was disabled!</div>").update();
					});
					break;
				case "ac":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "+":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "%":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "@":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "*":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "&":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "~":
					if (Config.laddermodchat === target) return this.errorReply("Ladder Modchat is already set to " + target + "!");
					Config.laddermodchat = target;
					this.popupReply("Ladder Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Ladder Modchat was set to " + target + ".</div>").update();
					});
					break;
				default:
					return this.errorReply("You have selected a wrong value. Possible values are: off, ac, +, %, @, *, &, ~.");
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},

	pmc: 'pmmodchat',
	pmmodchat: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/pmmodchat - Access denied.");
		}
		if (!Config.gmodchatlock) {
			switch (target) {
				case "off":
					if (Config.pmmodchat === false) return this.errorReply("PM Modchat is already disabled!");
					Config.pmmodchat = false;
					this.popupReply("PM Modchat disabled.");
					Rooms.rooms.forEach((curRoom, id) => {
					if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">PM modchat was disabled!</div>").update(); 
					});
					break;
				case "ac":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "+":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "%":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "@":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "*":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "&":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				case "~":
					if (Config.pmmodchat === target) return this.errorReply("PM Modchat is already set to " + target + "!");
					Config.pmmodchat = target;
					this.popupReply("PM Modchat set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">PM Modchat was set to " + target + ".</div>").update();
					});
					break;
				default:
					return this.errorReply("You have selected a wrong value. Possible values are: off, ac, +, %, @, *, &, ~.");
			}
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},

	rmc: 'roommodchat',
	roommodchat: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/roommodchat - Access denied.");
		}
		if (!Config.gmodchatlock) {
			switch (target) {
				case "off":
					if (Config.chatmodchat === false) return this.errorReply("Global room modchat is currently disabled!");

					Config.chatmodchat = false;
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-green\">Room modchat was disabled!</div>").update();
						curRoom.modchat = false;
					});
					this.popupReply("Room Modchat was disabled.");
					break;
				case "ac":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "+":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "%":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "@":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "*":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "&":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				case "~":
					if (Config.chatmodchat === target) return this.errorReply("Global room modchat is currently set to " + target + "!");

					Config.chatmodchat = target;
					this.popupReply("Room Modchat was set to " + target + ". Battle modchat was also set to " + target + ".");
					Rooms.rooms.forEach((curRoom, id) => {
						if (id !== 'global') curRoom.addRaw("<div class=\"broadcast-blue\">Room modchat was set to " + target + ".</div>").update();
						curRoom.modchat = target;
					});
					Config.battlemodchat = target;
					break;
				default:
					return this.errorReply("You have selected a wrong value. Possible values are: off, ac, +, %, @, *, &, ~.");
			}
		} else {
			return this.errorReply("Global lock is enabled. This is unabled to be changed at this current time. PM zellman01 if you think the lock should be removed.");
		}
	},

	gmcl: 'globalmodchatlock',
	globalmodchatlock: function (target, room, user, connection, cmd) {
		let allowed = ['joltsjolteon'];
		if (allowed.includes(user.userid)) {
			if (!Config.gmodchatlock) {
				this.send("Enabling global modchat lock...");
				Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + " enabled global modchat lock.");
				Config.gmodchatlock = true;
				console.log(Chat.escapeHTML(user.name) + " has enabled the Global modchat lock.");
			} else {
				this.send("Disabling global mod lock...");
				Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + "  disabled global modchat lock.");
				Config.gmodchatlock = false;
				console.log(Chat.escapeHTML(user.name) + " has disabled the Global modchat lock.");
			}
		} else {
			return this.errorReply("The command \"/globalmodchatlock\" does not exist. To send a message starting with \"/globalmodchatlock\", type \"//globalmodchatlock\".");
		}
	},

	gmclc: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/gmclc - Access denied.");
		}
		this.sendReply(Config.gmodchatlock);
	},

	mclc: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/mclc - Access denied.");
		}
		this.sendReply(Config.modchatlock);
	},

	mcl: 'modchatlock',
	modchatlock: function (target, room, user, connection, cmd) {
		if (!this.can('forcewin')) {
			return this.errorReply("/modchatlock - Access denied.");
		}
		if (!Config.modchatlock) {
			this.send("Enabling modchat lock...");
			Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + " enabled modchat lock.");
			Config.modchatlock = true;
			console.log(Chat.escapeHTML(user.name) + " has enabled the modchat lock.");
		} else {
			this.send("Disabling modchat lock...");
			Rooms.get("staff").add("|raw|<div class='broadcast-blue'>" + Chat.escapeHTML(user.name) + "  disabled modchat lock.");
			Config.modchatlock = false;
			console.log(Chat.escapeHTML(user.name) + " has disabled the modchat lock.");
		}
	},
};
