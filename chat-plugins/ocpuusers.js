/**
 * OCPU Users Functions
 * OCPU Server - http://OCPU.psim.us/
 *
 * Various utility functions pertaining to custom user functions.
 *
 * This currently handles features such as:
 * Economy - "bucks," used to buy things from the "shop"
 * Offline Messaging (tells) - Offline private messaging system
 * Last seen - When a user was last on the server
 * Badges - Various accomplishments
 * VIP Status - Lets a user use specific features other user's can't
 * Proxy whitelisting - Trusting specific users to not get locked when using a proxy
 * User Statuses - Appears on user's profiles
 * User IP Logging - Used for various disiplinary actions
 * News - Much like main's news system appeared while connecting
 *
 * Credits: panpawn
 *
 * @license MIT license
 */
'use strict';

const fs = require('fs');
const Autolinker = require('autolinker');

OCPU.userData = Object.create(null);
function loadUserData() {
	fs.readFile('config/OCPUusers.json', 'utf8', function (err, file) {
		if (err) return;
		OCPU.userData = JSON.parse(file);
	});
}
loadUserData();

OCPU.punishments = Object.create(null);
function loadPunishments() {
	fs.readFile('config/OCPU-punishments.json', 'utf8', function (err, file) {
		if (err) return;
		OCPU.punishments = JSON.parse(file);
	});
}
loadPunishments();

try {
	Object.assign(OCPU, {

		/******************************
		 * Initialize User Functions  *
		 ******************************/
		createUser: function (user) { // doesn't save unless it gets edited
			user = toId(user);
			if (OCPU.userData[user] || user === 'constructor') return false;
			if (user.substr(0, 5) === 'guest') return false;

			OCPU.userData[user] = { // esteemed user data
				ips: [],
				friends: [],
				icon: false,
				proxywhitelist: false,
				status: '',
				friendcode: '',
			}; // we don't save blank user data objects until next save
		},
		saveData: function () {
			setTimeout(function () {
				fs.writeFileSync('config/OCPUusers.json', JSON.stringify(OCPU.userData));
			}, (1.25 * 1000)); // only save every 1.25 seconds - TOPS
		},
		initiateUser: function (user, ip) {	// when the user connections, this runs
			user = toId(user);
			if (!OCPU.userData[user]) OCPU.createUser(user);

			this.addIp(user, ip);
			this.updateSeen(user); // (saves)
		},
		checkExisting: function (user) {
			user = toId(user);
			if (!OCPU.userData[user]) OCPU.createUser(user);
			return OCPU.userData[user];
		},
		/*******************
		 * Misc. Functions *
		 *******************/
		customIcon: function (user, action, icon) {
			let data = this.checkExisting(user);
			if (!data.icon) data.icon = '';

			if (action === 'GIVE') {
				data.icon = icon;
			} else if (action === 'REMOVE') {
				data.icon = false;
			} else {
				return false;
			}

			this.saveData();
		},
		addIp: function (user, ip) { // sub-function of initialize user
			if (toId(user).substr(0, 5) === 'guest') return false;

			let data = this.checkExisting(user);
			if (!data.ips) data.ips = [];

			if (!data.ips.includes(ip)) data.ips.push(ip);
		},
		updateFriends: function (user, friend, action) {
			friend = toId(friend);
			let data = this.checkExisting(user);
			if (!data.friends) data.friends = [];

			if (action === 'ADD') {
				if (!data.friends.includes(friend))data.friends.push(friend);
			} else if (action === 'DELETE') {
				if (data.friends.includes(friend)) data.friends.splice(data.friends.indexOf(friend), 1);
			} else {
				return false;
			}

			this.saveData();
		},
		trustUser: function (user, action) {
			let data = this.checkExisting(user);
			if (!action) action = false;
			if (!data.proxywhitelist) data.proxywhitelist = false;

			data.proxywhitelist = action;

			this.saveData();
		},
		whois: function (user, online) {
			user = toId(user);
			if (user === 'constructor') return false;

			// variable declarations
			let ips = [], prevNames = [];
			let prevIps = OCPU.userData[user] && OCPU.userData[user].ips.length > 0 ? OCPU.userData[user].ips : false;
			let names = Object.keys(OCPU.userData);
			let buff = [], none = '<em style="color:gray">(none)</em>';
			let userSymbol = Users.usergroups[user] ? Users.usergroups[user].substr(0, 1) : 'Regular User';
			let userGroup = userSymbol !== ' ' && Config.groups[userSymbol] ? 'Global ' + Config.groups[userSymbol].name + ' (' + userSymbol + ')' : false;

			// get previous names and IPs
			if (prevIps) prevIps.forEach(f => { ips.push(f); });
			if (ips.length > 0) {
				names.forEach(name => {
					for (let i = 0; i < ips.length; i++) {
						if (OCPU.userData[name].ips.includes(ips[i]) && !prevNames.includes(name) && user !== name) {
							prevNames.push(name);
						}
					}
				});
			}
			if (online) {
				let altsDisplay = prevNames.length > 0;
				let ipsDisplay = ips.length > 0;
				if (altsDisplay) buff.push(`(All previously known alts used: ${prevNames.join(', ')})`);
				if (ipsDisplay) buff.push(`(All previously known IPs used: ${ips.join(', ')})`);
				if (altsDisplay || ipsDisplay) return buff.join('<br />');
			} else if (!online) {
				// header and last seen
				if (userGroup) buff.push(userGroup);
				buff.push('Last Seen: ' + this.getLastSeen(user) + '<br />');

				// get previous names and IPs
				buff.push(`Previous IP${Chat.plural(ips.length)}: ${ips.length > 0 ? ips.join(', ') : none}`);
				buff.push(`Previous alt${Chat.plural(prevNames.length)}: ${prevNames.length > 0 ? prevNames.join(', ') : none}`);

				return `${buff.join('<br />')}<br />`;
			}
			return false;
		},
		getIpRange: function (ip) { // strictly for IPv4 support only
			if (!ip) return;
			let ipArr = ip.split('.');
			let firstOctet = ipArr[0];
			let ipClass = '';
			if (firstOctet <= 126 || firstOctet <= 191) {
				ipClass = (firstOctet <= 126 ? 'A' : 'B');
				return [`${ipArr[0]}.${ipArr[1]}`, ipClass]; // this technically is not correct IP addressing
			} else if (firstOctet <= 223) {
				ipClass = 'C';
				return [`${ipArr[0]}.${ipArr[1]}.${ipArr[2]}`, ipClass];
			} else {
				return [undefined, 'unknown']; // this should never happen
			}
		},
		savePunishments: function () {
			setTimeout(function () {
				fs.writeFileSync('config/OCPU-punishments.json', JSON.stringify(OCPU.punishments));
			}, (1.25 * 1000)); // only save every 1.25 seconds - TOPS
		},
		pmAdmin: function (message, pmName) {
			if (!pmName) pmName = '~Server Emergency';
			Users.users.forEach(curUser => {
				if (curUser.group === '~') {
					curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message);
				}
			});
		},
		logCrash: function (stack, message) {
			for (let roomid of ['development', 'staff']) {
				let curRoom = Rooms(roomid);
				if (curRoom) curRoom.add(`|html|<div class="broadcast-red"><b>CUSTOM OCPU FUNCTIONALITY HAS CRASHED:</b><br />${stack}<br />Detailed message: ${message}<br /><br /><b>Please report this to a developer... so panpawn.`).update();
			}
		},
	});
} catch (e) {
	console.log('crash: ' + e.stack);
	let staff = Rooms('staff');
	if (staff) staff.add(`|html|<div class="broadcast-red"><b>CUSTOM OCPU FUNCTIONALITY HAS CRASHED:</b><br />${e.stack}<br /><br /><b>Please report this to a developer... so panpawn.`).update();
}

//Credit to SG
OCPU.nameColor = function (name, bold, userGroup) {
	let userGroupSymbol = Users.usergroups[toId(name)] ? '<strong><font color=#948A88>' + Users.usergroups[toId(name)].substr(0, 1) + '</font></strong>' : "";
	return (userGroup ? userGroupSymbol : "") + (bold ? "<strong>" : "") + "<font color=" + OCPU.hashColor(name) + ">" + (Users(name) && Users(name).connected && Users.getExact(name) ? Chat.escapeHTML(Users.getExact(name).name) : Chat.escapeHTML(name)) + "</font>" + (bold ? "</strong>" : "");
};
// usage: OCPU.nameColor(user.name, true) for bold OR OCPU.nameColor(user.name, false) for non-bolded.

OCPU.messageSeniorStaff = function (message, pmName, from) {
	pmName = (pmName ? pmName : '~Seinor Staff PM [DO NOT REPLY]');
	from = (from ? ' (PM from ' + from + ')' : '');
	Users.users.forEach(curUser => {
		if (curUser.group === '~' || curUser.group === '&') {
			curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message + from);
		}
	});
};

// format: OCPU.messageSeniorStaff('message', 'person')
//
// usage: OCPU.messageSeniorStaff('Mystifi is a confirmed user and they were banned from a public room. Assess the situation immediately.', '~Server')
//
// this makes a PM from ~OCPU Server stating the message


OCPU.pmStaff = function (message, pmName, from) {
	pmName = (pmName ? pmName : '~Staff PM [DO NOT REPLY]');
	from = (from ? ' (PM from ' + from + ')' : '');
	Users.users.forEach(curUser => {
		if (curUser.isStaff) {
			curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message + from);
		}
	});
};

OCPU.parseMessage = function (message) {
	if (message.substr(0, 5) === "/html") {
		message = message.substr(5);
		message = message.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\_\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
		message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<strong>$1</strong>'); // bold
		message = message.replace(/~~([^< ](?:[^<]*?[^< ])?)~~/g, '<strike>$1</strike>'); // strikethrough
		message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
		message = Autolinker.link(message.replace(/&#x2f;/g, '/'), {stripPrefix: false, phone: false, twitter: false});
		return message;
	}
	message = Chat.escapeHTML(message).replace(/&#x2f;/g, '/');
	message = message.replace(/__([^< ](?:[^<]*?[^< ])?)__(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
	message = message.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<strong>$1</strong>'); // bold
	message = message.replace(/~~([^< ](?:[^<]*?[^< ])?)~~/g, '<strike>$1</strike>'); // strikethrough
	message = message.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
	message = Autolinker.link(message, {stripPrefix: false, phone: false, twitter: false});
	return message;
};

OCPU.randomString = function (length) {
	return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
};
