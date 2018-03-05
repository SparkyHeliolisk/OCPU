/* Because it was forgotten to be placed: heavy credits to Gold/Wisp for code. */

'use strict';

// modules and constants
const fs = require('fs');
const http = require('http');
const https = require('https');

let bubbleLetterMap = new Map([
	['a', '\u24D0'], ['b', '\u24D1'], ['c', '\u24D2'], ['d', '\u24D3'], ['e', '\u24D4'], ['f', '\u24D5'], ['g', '\u24D6'], ['h', '\u24D7'], ['i', '\u24D8'], ['j', '\u24D9'], ['k', '\u24DA'], ['l', '\u24DB'], ['m', '\u24DC'],
	['n', '\u24DD'], ['o', '\u24DE'], ['p', '\u24DF'], ['q', '\u24E0'], ['r', '\u24E1'], ['s', '\u24E2'], ['t', '\u24E3'], ['u', '\u24E4'], ['v', '\u24E5'], ['w', '\u24E6'], ['x', '\u24E7'], ['y', '\u24E8'], ['z', '\u24E9'],
	['A', '\u24B6'], ['B', '\u24B7'], ['C', '\u24B8'], ['D', '\u24B9'], ['E', '\u24BA'], ['F', '\u24BB'], ['G', '\u24BC'], ['H', '\u24BD'], ['I', '\u24BE'], ['J', '\u24BF'], ['K', '\u24C0'], ['L', '\u24C1'], ['M', '\u24C2'],
	['N', '\u24C3'], ['O', '\u24C4'], ['P', '\u24C5'], ['Q', '\u24C6'], ['R', '\u24C7'], ['S', '\u24C8'], ['T', '\u24C9'], ['U', '\u24CA'], ['V', '\u24CB'], ['W', '\u24CC'], ['X', '\u24CD'], ['Y', '\u24CE'], ['Z', '\u24CF'],
	['1', '\u2460'], ['2', '\u2461'], ['3', '\u2462'], ['4', '\u2463'], ['5', '\u2464'], ['6', '\u2465'], ['7', '\u2466'], ['8', '\u2467'], ['9', '\u2468'], ['0', '\u24EA'],
]);

let asciiMap = new Map([
	['\u24D0', 'a'], ['\u24D1', 'b'], ['\u24D2', 'c'], ['\u24D3', 'd'], ['\u24D4', 'e'], ['\u24D5', 'f'], ['\u24D6', 'g'], ['\u24D7', 'h'], ['\u24D8', 'i'], ['\u24D9', 'j'], ['\u24DA', 'k'], ['\u24DB', 'l'], ['\u24DC', 'm'],
	['\u24DD', 'n'], ['\u24DE', 'o'], ['\u24DF', 'p'], ['\u24E0', 'q'], ['\u24E1', 'r'], ['\u24E2', 's'], ['\u24E3', 't'], ['\u24E4', 'u'], ['\u24E5', 'v'], ['\u24E6', 'w'], ['\u24E7', 'x'], ['\u24E8', 'y'], ['\u24E9', 'z'],
	['\u24B6', 'A'], ['\u24B7', 'B'], ['\u24B8', 'C'], ['\u24B9', 'D'], ['\u24BA', 'E'], ['\u24BB', 'F'], ['\u24BC', 'G'], ['\u24BD', 'H'], ['\u24BE', 'I'], ['\u24BF', 'J'], ['\u24C0', 'K'], ['\u24C1', 'L'], ['\u24C2', 'M'],
	['\u24C3', 'N'], ['\u24C4', 'O'], ['\u24C5', 'P'], ['\u24C6', 'Q'], ['\u24C7', 'R'], ['\u24C8', 'S'], ['\u24C9', 'T'], ['\u24CA', 'U'], ['\u24CB', 'V'], ['\u24CC', 'W'], ['\u24CD', 'X'], ['\u24CE', 'Y'], ['\u24CF', 'Z'],
	['\u2460', '1'], ['\u2461', '2'], ['\u2462', '3'], ['\u2463', '4'], ['\u2464', '5'], ['\u2465', '6'], ['\u2466', '7'], ['\u2467', '8'], ['\u2468', '9'], ['\u24EA', '0'],
]);

// misc
const ADVERTISEMENT_COST = 45; // how much does /advertise cost to use?
let regdateCache = {};
let customColors = {};

global.parseStatus = function (text, encoding) {
	if (encoding) {
		text = text.split('').map(function (char) {
			return bubbleLetterMap.get(char);
		}).join('');
	} else {
		text = text.split('').map(function (char) {
			return asciiMap.get(char);
		}).join('');
	}
	return text;
};

OCPU.pmAll = function (message, pmName) {
	pmName = (pmName ? pmName : '~Server PM [DO NOT REPLY]');
	Users.users.forEach(curUser => {
		curUser.send('|pm|' + pmName + '|' + curUser.getIdentity() + '|' + message);
	});
};

function pluralFormat(length, ending) {
	if (!ending) ending = 's';
	if (isNaN(Number(length))) return false;
	return (length === 1 ? '' : ending);
}

regdate: function (target, callback) {
	target = toId(target);
	if (regdateCache[target]) return callback(regdateCache[target]);
	let req = https.get('https://pokemonshowdown.com/users/' + target + '.json', res => {
		let data = '';
		res.on('data', chunk => {
			data += chunk;
		}).on('end', () => {
			try {
				data = JSON.parse(data);
			} catch (e) {
				return callback(false);
			}
			let date = data['registertime'];
			if (date !== 0 && date.toString().length < 13) {
				while (date.toString().length < 13) {
					date = Number(date.toString() + '0');
				}
			}
			if (date !== 0) {
				regdateCache[target] = date;
				saveRegdateCache();
			}
			callback((date === 0 ? false : date));
		});
	});
	req.end();
},

OCPU.reloadCSS = function () {
	const cssPath = 'ocpu'; // This should be the server id if Config.serverid doesn't exist. Ex: 'serverid'
	let options = {
		host: 'play.pokemonshowdown.com',
		port: 80,
		path: '/customcss.php?server=' + (Config.serverid || cssPath),
		method: 'GET',
	};
	http.get(options);
};

OCPU.formatName = function (name) {
	if (Users.getExact(name) && Users(name).connected) {
		return '<i>' + OCPU.nameColor(Users.getExact(name).name, true) + '</i>';
	} else {
		return OCPU.nameColor(name, false);
	}
};

function loadRegdateCache() {
	try {
		regdateCache = JSON.parse(fs.readFileSync('config/regdate.json', 'utf8'));
	} catch (e) {}
}
loadRegdateCache();

function saveRegdateCache() {
	fs.writeFileSync('config/regdate.json', JSON.stringify(regdateCache));
}

function parseStatus(text, encoding) {
	if (encoding) {
		text = text
			.split('')
			.map(char => bubbleLetterMap.get(char))
			.join('');
	} else {
		text = text
			.split('')
			.map(char => asciiMap.get(char))
			.join('');
	}
	return text;
}

function load() {
	fs.readFile('config/customcolors.json', 'utf8', function (err, file) {
		if (err) return;
		customColors = JSON.parse(file);
	});
}
setInterval(function () {
	load();
}, 500);

function updateColor() {
	fs.writeFileSync('config/customcolors.json', JSON.stringify(customColors));

	let newCss = '/* COLORS START */\n';

	for (let name in customColors) {
		newCss += generateCSS(name, customColors[name]);
	}
	newCss += '/* COLORS END */\n';

	let file = fs.readFileSync('config/custom.css', 'utf8').split('\n');
	if (~file.indexOf('/* COLORS START */')) file.splice(file.indexOf('/* COLORS START */'), (file.indexOf('/* COLORS END */') - file.indexOf('/* COLORS START */')) + 1);
	fs.writeFileSync('config/custom.css', file.join('\n') + newCss);
	OCPU.reloadCSS();
}

function generateCSS(name, color) {
	let css = '';
	let rooms = [];
	name = toId(name);
	Rooms.rooms.forEach((curRoom, id) => {
		if (id === 'global' || curRoom.type !== 'chat' || curRoom.isPersonal) return;
		if (!isNaN(Number(id.charAt(0)))) return;
		rooms.push('#' + id + '-userlist-user-' + name + ' strong em');
		rooms.push('#' + id + '-userlist-user-' + name + ' strong');
		rooms.push('#' + id + '-userlist-user-' + name + ' span');
	});
	css = rooms.join(', ');
	css += '{\ncolor: ' + color + ' !important;\n}\n';
	css += '.chat.chatmessage-' + name + ' strong {\n';
	css += 'color: ' + color + ' !important;\n}\n';
	return css;
}

/*eslint-disable */
function MD5(e) {
	function t(e, t) {
		var n, r, i, s, o;
		i = e & 2147483648;
		s = t & 2147483648;
		n = e & 1073741824;
		r = t & 1073741824;
		o = (e & 1073741823) + (t & 1073741823);
		return n & r ? o ^ 2147483648 ^ i ^ s : n | r ? o & 1073741824 ? o ^ 3221225472 ^ i ^ s : o ^ 1073741824 ^ i ^ s : o ^ i ^ s;
	}

	function n(e, n, r, i, s, o, u) {
		e = t(e, t(t(n & r | ~n & i, s), u));
		return t(e << o | e >>> 32 - o, n);
	}

	function r(e, n, r, i, s, o, u) {
		e = t(e, t(t(n & i | r & ~i, s), u));
		return t(e << o | e >>> 32 - o, n);
	}

	function i(e, n, r, i, s, o, u) {
		e = t(e, t(t(n ^ r ^ i, s), u));
		return t(e << o | e >>> 32 - o, n);
	}

	function s(e, n, r, i, s, o, u) {
		e = t(e, t(t(r ^ (n | ~i), s), u));
		return t(e << o | e >>> 32 - o, n);
	}

	function o(e) {
		var t = "",
			n = "",
			r;
		for (r = 0; r <= 3; r++) n = e >>> r * 8 & 255, n = "0" + n.toString(16), t += n.substr(n.length - 2, 2);
		return t
	}
	var u = [],
		a, f, l, c, h, p, d, v, e = function(e) {
			for (var e = e.replace(/\r\n/g, "\n"), t = "", n = 0; n < e.length; n++) {
				var r = e.charCodeAt(n);
				r < 128 ? t += String.fromCharCode(r) : (r > 127 && r < 2048 ? t += String.fromCharCode(r >> 6 | 192) : (t += String.fromCharCode(r >> 12 | 224), t += String.fromCharCode(r >> 6 & 63 | 128)), t += String.fromCharCode(r & 63 | 128));
			}
			return t;
		}(e),
		u = function(e) {
			var t, n = e.length;
			t = n + 8;
			for (var r = ((t - t % 64) / 64 + 1) * 16, i = Array(r - 1), s = 0, o = 0; o < n;) t = (o - o % 4) / 4, s = o % 4 * 8, i[t] |= e.charCodeAt(o) << s, o++;
			i[(o - o % 4) / 4] |= 128 << o % 4 * 8;
			i[r - 2] = n << 3;
			i[r - 1] = n >>> 29;
			return i;
		}(e);
	h = 1732584193;
	p = 4023233417;
	d = 2562383102;
	v = 271733878;
	for (e = 0; e < u.length; e += 16) a = h, f = p, l = d, c = v, h = n(h, p, d, v, u[e + 0], 7, 3614090360), v = n(v, h, p, d, u[e + 1], 12, 3905402710), d = n(d, v, h, p, u[e + 2], 17, 606105819), p = n(p, d, v, h, u[e + 3], 22, 3250441966), h = n(h, p, d, v, u[e + 4], 7, 4118548399), v = n(v, h, p, d, u[e + 5], 12, 1200080426), d = n(d, v, h, p, u[e + 6], 17, 2821735955), p = n(p, d, v, h, u[e + 7], 22, 4249261313), h = n(h, p, d, v, u[e + 8], 7, 1770035416), v = n(v, h, p, d, u[e + 9], 12, 2336552879), d = n(d, v, h, p, u[e + 10], 17, 4294925233), p = n(p, d, v, h, u[e + 11], 22, 2304563134), h = n(h, p, d, v, u[e + 12], 7, 1804603682), v = n(v, h, p, d, u[e + 13], 12, 4254626195), d = n(d, v, h, p, u[e + 14], 17, 2792965006), p = n(p, d, v, h, u[e + 15], 22, 1236535329), h = r(h, p, d, v, u[e + 1], 5, 4129170786), v = r(v, h, p, d, u[e + 6], 9, 3225465664), d = r(d, v, h, p, u[e + 11], 14, 643717713), p = r(p, d, v, h, u[e + 0], 20, 3921069994), h = r(h, p, d, v, u[e + 5], 5, 3593408605), v = r(v, h, p, d, u[e + 10], 9, 38016083), d = r(d, v, h, p, u[e + 15], 14, 3634488961), p = r(p, d, v, h, u[e + 4], 20, 3889429448), h = r(h, p, d, v, u[e + 9], 5, 568446438), v = r(v, h, p, d, u[e + 14], 9, 3275163606), d = r(d, v, h, p, u[e + 3], 14, 4107603335), p = r(p, d, v, h, u[e + 8], 20, 1163531501), h = r(h, p, d, v, u[e + 13], 5, 2850285829), v = r(v, h, p, d, u[e + 2], 9, 4243563512), d = r(d, v, h, p, u[e + 7], 14, 1735328473), p = r(p, d, v, h, u[e + 12], 20, 2368359562), h = i(h, p, d, v, u[e + 5], 4, 4294588738), v = i(v, h, p, d, u[e + 8], 11, 2272392833), d = i(d, v, h, p, u[e + 11], 16, 1839030562), p = i(p, d, v, h, u[e + 14], 23, 4259657740), h = i(h, p, d, v, u[e + 1], 4, 2763975236), v = i(v, h, p, d, u[e + 4], 11, 1272893353), d = i(d, v, h, p, u[e + 7], 16, 4139469664), p = i(p, d, v, h, u[e + 10], 23, 3200236656), h = i(h, p, d, v, u[e + 13], 4, 681279174), v = i(v, h, p, d, u[e + 0], 11, 3936430074), d = i(d, v, h, p, u[e + 3], 16, 3572445317), p = i(p, d, v, h, u[e + 6], 23, 76029189), h = i(h, p, d, v, u[e + 9], 4, 3654602809), v = i(v, h, p, d, u[e + 12], 11, 3873151461), d = i(d, v, h, p, u[e + 15], 16, 530742520), p = i(p, d, v, h, u[e + 2], 23, 3299628645), h = s(h, p, d, v, u[e + 0], 6, 4096336452), v = s(v, h, p, d, u[e + 7], 10, 1126891415), d = s(d, v, h, p, u[e + 14], 15, 2878612391), p = s(p, d, v, h, u[e + 5], 21, 4237533241), h = s(h, p, d, v, u[e + 12], 6, 1700485571), v = s(v, h, p, d, u[e + 3], 10, 2399980690), d = s(d, v, h, p, u[e + 10], 15, 4293915773), p = s(p, d, v, h, u[e + 1], 21, 2240044497), h = s(h, p, d, v, u[e + 8], 6, 1873313359), v = s(v, h, p, d, u[e + 15], 10, 4264355552), d = s(d, v, h, p, u[e + 6], 15, 2734768916), p = s(p, d, v, h, u[e + 13], 21, 1309151649), h = s(h, p, d, v, u[e + 4], 6, 4149444226), v = s(v, h, p, d, u[e + 11], 10, 3174756917), d = s(d, v, h, p, u[e + 2], 15, 718787259), p = s(p, d, v, h, u[e + 9], 21, 3951481745), h = t(h, a), p = t(p, f), d = t(d, l), v = t(v, c);
	return (o(h) + o(p) + o(d) + o(v)).toLowerCase();
}
/*eslint-enable */
let colorCache = {};

// hashColor function
OCPU.hashColor = function (name) {
	name = toId(name);
	if (customColors[name]) return customColors[name];
	if (colorCache[name]) return colorCache[name];
	let hash = MD5(name);
	let H = parseInt(hash.substr(4, 4), 16) % 360; // 0 to 360
	let S = parseInt(hash.substr(0, 4), 16) % 50 + 40; // 40 to 89
	let L = Math.floor(parseInt(hash.substr(8, 4), 16) % 20 + 30); // 30 to 49
	let C = (100 - Math.abs(2 * L - 100)) * S / 100 / 100;
	let X = C * (1 - Math.abs((H / 60) % 2 - 1));
	let m = L / 100 - C / 2;

	let R1, G1, B1;
	switch (Math.floor(H / 60)) {
	case 1:
		R1 = X;
		G1 = C;
		B1 = 0;
		break;
	case 2:
		R1 = 0;
		G1 = C;
		B1 = X;
		break;
	case 3:
		R1 = 0;
		G1 = X;
		B1 = C;
		break;
	case 4:
		R1 = X;
		G1 = 0;
		B1 = C;
		break;
	case 5:
		R1 = C;
		G1 = 0;
		B1 = X;
		break;
	case 0:
	default:
		R1 = C;
		G1 = X;
		B1 = 0;
		break;
	}
	let lum = (R1 + m) * 0.2126 + (G1 + m) * 0.7152 + (B1 + m) * 0.0722; // 0.05 (dark blue) to 0.93 (yellow)
	let HLmod = (lum - 0.5) * -100; // -43 (yellow) to 45 (dark blue)
	if (HLmod > 12) {
		HLmod -= 12;
	} else if (HLmod < -10) {
		HLmod = (HLmod + 10) * 2 / 3;
	} else {
		HLmod = 0;
	}

	L += HLmod;
	let Smod = 10 - Math.abs(50 - L);
	if (HLmod > 15) Smod += (HLmod - 15) / 2;
	S -= Smod;

	let rgb = hslToRgb(H, S, L);
	colorCache[name] = "#" + rgbToHex(rgb.r, rgb.g, rgb.b);
	return colorCache[name];
};

function hslToRgb(h, s, l) {
	let r, g, b, m, c, x;
	if (!isFinite(h)) h = 0;
	if (!isFinite(s)) s = 0;
	if (!isFinite(l)) l = 0;
	h /= 60;
	if (h < 0) h = 6 - (-h % 6);
	h %= 6;
	s = Math.max(0, Math.min(1, s / 100));
	l = Math.max(0, Math.min(1, l / 100));
	c = (1 - Math.abs((2 * l) - 1)) * s;
	x = c * (1 - Math.abs((h % 2) - 1));
	if (h < 1) {
		r = c;
		g = x;
		b = 0;
	} else if (h < 2) {
		r = x;
		g = c;
		b = 0;
	} else if (h < 3) {
		r = 0;
		g = c;
		b = x;
	} else if (h < 4) {
		r = 0;
		g = x;
		b = c;
	} else if (h < 5) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}
	m = l - c / 2;
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);
	return {
		r: r,
		g: g,
		b: b,
	};
}

function rgbToHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B);
}

function toHex(N) {
	if (N === null || N === undefined) return "00";
	N = parseInt(N);
	if (N === 0 || isNaN(N)) return "00";
	N = Math.max(0, N);
	N = Math.min(N, 255);
	N = Math.round(N);
	return "0123456789ABCDEF".charAt((N - N % 16) / 16) + "0123456789ABCDEF".charAt(N % 16);
}

exports.commands = {
	todo: function (target, room, user) {
		if (!this.can("ban", null, room)) return this.errorReply("/todo - Access Denied.");
		if (room.id !== 'development') return this.errorReply("This command can only be used in Development.");
		user.popup("This command is currently not completed right now.");
	},

	dm: 'daymute',
	daymute: function (target, room, user, connection, cmd) {
		if (!target) return this.errorReply("Usage: /dm [user], [reason].");
		if (!this.canTalk()) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > 300) {
			return this.sendReply("The reason is too long. It cannot exceed 300 characters.");
		}

		let muteDuration = 24 * 60 * 60 * 1000;
		if (!this.can('mute', targetUser, room)) return false;
		let canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			let problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModAction("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModAction("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for 24 hours. " + target);
		this.addModAction("" + targetUser.name + " was muted by " + user.name + " for 24 hours." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModAction("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");
		this.add('|unlink|' + toId(this.inputUsername));

		room.mute(targetUser, muteDuration, false);
	},

	staffmute: function (target, room, user, connection, cmd) {
		if (!target) return this.errorReply("Usage: /staffmute [user], [reason].");
		if (!this.canTalk()) return this.sendReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.sendReply("User '" + this.targetUsername + "' does not exist.");
		if (target.length > 300) {
			return this.sendReply("The reason is too long. It cannot exceed 300 characters.");
		}

		let muteDuration = 0.45 * 60 * 1000;
		if (!this.can('mute', targetUser, room)) return false;
		let canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if ((room.isMuted(targetUser) && !canBeMutedFurther) || targetUser.locked || !targetUser.connected) {
			let problem = " but was already " + (!targetUser.connected ? "offline" : targetUser.locked ? "locked" : "muted");
			if (!target) {
				return this.privateModAction("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModAction("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for 45 seconds. " + target);
		this.addModAction("" + targetUser.name + " was muted by " + user.name + " for 45 seconds." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModAction("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");
		this.add('|unlink|' + toId(this.inputUsername));

		room.mute(targetUser, muteDuration, false);
	},

	em: 'emergencymeeting',
	emergencymeeting: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/emergencymeeting - access denied.");
		}

		if (user.name === false) {
			return this.errorReply("You have been denied access to this command.");
		}

		if (target) return this.errorReply("This command cannot be used with a 'target'.");

		OCPU.pmStaff("A system operator needs all users who can see this message in the staff room ASAP for an emergency meeting. Issuing user: " + user.name + ".");
		if (user.name === "Jolt(S Jolteon)") {
			OCPU.pmStaff("Jolt(S Jolteon) is the console user and does not need any confirmation if he is a sysop.");
		} else {
			OCPU.pmStaff("Please use '/profile " + user.name + "' to see if that user is a confirmed sysop. Please alert an actual sysop if they are not.");
		}

		Rooms.rooms.get("staff").addRaw("<div class=\"broadcast-red\">The sysop user " + user.name + " (at least what the server reconizes as a sysop user) is calling an emergency meeting. Please listen to what he/she needs to say.</div>");
		Rooms.rooms.get("staff").modchat = '~';
		Rooms.rooms.get("staff").addRaw("<div class=\"broadcast-red\">Moderated chat has been set to '~' for this. Other admins and sysops, please refrain from saying anything. except for the sysop/admin keeping track of the timer.</div>");
		Rooms.rooms.get("staff").addRaw("<div class=\"broadcast-blue\">This user's timer will start after another sysop/admin has said so, and that sysop/admin is responsible for keeping track of the timer. Once the timer is up, that sysop/admin will declare that this is over and will remove the modchat. The user who started this may end it at any time OR by a council vote of most sysop/admins (55% rule). The timer is 10 minutes");

		Rooms.rooms.get("upperstaff").addRaw("<div class=\"broadcast-blue\">Please get inside the Staff room if you are not already there please.");

		user.popup("You must have something significant to say to all staff members or it will immediately end.");
	},
	protectroom: function (target, room, user) {
		if (!this.can('pban')) return false;
		if (room.type !== 'chat' || room.isOfficial) return this.errorReply("This room does not need to be protected.");
		if (this.meansNo(target)) {
			if (!room.protect) return this.errorReply("This room is already unprotected.");
			room.protect = false;
			room.chatRoomData.protect = room.protect;
			Rooms.global.writeChatRoomData();
			this.privateModAction("(" + user.name + " has unprotected this room from being automatically deleted.)");
		} else {
			if (room.protect) return this.errorReply("This room is already protected.");
			room.protect = true;
			room.chatRoomData.protect = room.protect;
			Rooms.global.writeChatRoomData();
			this.privateModAction("(" + user.name + " has protected this room from being automatically deleted.)");
		}
	},

	hide: 'hideauth',
	hideauth: function (target, room, user) {
		if (!this.can('lock')) return false;
		let tar = ' ';
		if (target) {
			target = target.trim();
			if (Config.groupsranking.indexOf(target) > -1 && target !== '#') {
				if (Config.groupsranking.indexOf(target) <= Config.groupsranking.indexOf(user.group)) {
					tar = target;
				} else {
					this.sendReply('The group symbol you have tried to use is of a higher authority than you have access to. Defaulting to \' \' instead.');
				}
			} else {
				this.sendReply('You have tried to use an invalid character as your auth symbol. Defaulting to \' \' instead.');
			}
		}
		user.getIdentity = function (roomid) {
			if (this.locked) {
				return '‽' + this.name;
			}
			if (roomid) {
				let room = Rooms.rooms.get(roomid);
				if (room.isMuted(this)) {
					return '!' + this.name;
				}
				if (room && room.auth) {
					if (room.auth[this.userid]) {
						return room.auth[this.userid] + this.name;
					}
					if (room.isPrivate === true) return ' ' + this.name;
				}
			}
			return tar + this.name;
		};
		user.updateIdentity();
		this.sendReply('You are now hiding your auth symbol as \'' + tar + '\'.');
		this.addModAction(user.name + ' is hiding auth symbol as \'' + tar + '\'');
		user.isHiding = true;
	},

	show: 'showauth',
	showauth: function (target, room, user) {
		if (!user.can('lock')) return this.sendReply("/showauth - access denied.");
		delete user.getIdentity;
		user.updateIdentity();
		user.isHiding = false;
		this.sendReply("You have now revealed your auth symbol.");
		return this.addModAction(user.name + " has revealed their auth symbol.");
	},

	pb: 'permaban',
	pban: 'permaban',
	permban: 'permaban',
	permaban: function (target, room, user, connection) {
		if (!target) return this.sendReply('/permaban [username] - Permanently bans the user from the server. Bans placed by this command do not reset on server restarts. Requires: & ~');
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.sendReply('User ' + this.targetUsername + ' not found.');
		if (!this.can('pban', targetUser)) return false;

		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (targetUser.banned && !target && !targetUser.connected) {
			let problem = " but was already banned";
			return this.privateModAction('(' + name + " would be banned by " + user.name + problem + '.) (' + targetUser.latestIp + ')');
		}
		targetUser.popup(user.name + " has permanently banned you." + (target ? " (" + target + ")" : ""));
		this.addModAction(name + " was permanently banned by " + user.name + "." + (target ? " (" + target + ")" : ""));

		let alts = targetUser.getAlts();
		let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		if (alts.length) {
			let guests = alts.length;
			alts = alts.filter(alt => alt.substr(0, 6) !== 'Guest ');
			guests -= alts.length;
			this.privateModAction("(" + name + "'s " + (acAccount ? " ac account: " + acAccount + ", " : "") + "banned alts: " + alts.join(", ") + (guests ? " [" + guests + " guests]" : "") + ")");
			for (let i = 0; i < alts.length; ++i) {
				this.add('|unlink|hide|' + toId(alts[i]));
			}
		} else if (acAccount) {
			this.privateModAction("(" + name + "'s ac account: " + acAccount + ")");
		}

		this.add('|unlink|hide|' + userid);
		let options = {
			'type': 'pban',
			'by': user.name,
			'on': Date.now(),
		};
		if (target) options.reason = target;
		console.log(Chat.escapeHTML(targetUser) + " has been perma-banned by " + Chat.escapeHTML(user.name) + ".");
		this.globalModlog("PERMABAN", targetUser, " by " + user.name);
		Punishments.ban(targetUser, Date.now() + 6 * 4 * 7 * 24 * 60 * 60 * 1000);
	},

	clearall: 'clearroom',
	clearroom: function (target, room, user) {
		if (!this.can('pban')) return false;
		if (room.battle) return this.sendReply("You cannot clearall in battle rooms.");

		let len = (room.log.log && room.log.log.length) || 0;
		let users = [];
		while (len--) {
			room.log.log[len] = '';
		}
		for (let u in room.users) {
			if (!Users.get(u) || !Users.get(u).connected) continue;
			users.push(u);
			Users(u).leaveRoom(room, Users.get(u).connections[0]);
		}
		len = users.length;
		setTimeout(() => {
			while (len--) {
				Users(users[len]).joinRoom(room, Users(users[len]).connections[0]);
			}
		}, 1000);
	},

	hc: function (room, user, cmd) {
		return this.parse('/hotpatch chat');
	},
	vault: function (target, room, user, connection) {
		let money = fs.readFileSync('config/money.csv', 'utf8');
		return user.send('|popup|' + money);
	},
	s: 'spank',
	spank: function (target, room, user) {
		if (!target) return this.sendReply('/spank needs a target.');
		return this.parse('/me spanks ' + target + '!');
	},
	punt: function (target, room, user) {
		if (!target) return this.sendReply('/punt needs a target.');
		return this.parse('/me punts ' + target + ' to the moon!');
	},
	crai: 'cry',
	cry: function (target, room, user) {
		return this.parse('/me starts tearbending dramatically like Katara~!');
	},
	dk: 'dropkick',
	dropkick: function (target, room, user) {
		if (!target) return this.sendReply('/dropkick needs a target.');
		return this.parse('/me dropkicks ' + target + ' across the Pok\u00E9mon Stadium!');
	},
	fart: function (target, room, user) {
		if (!target) return this.sendReply('/fart needs a target.');
		return this.parse('/me farts on ' + target + '\'s face!');
	},
	poke: function (target, room, user) {
		if (!target) return this.sendReply('/poke needs a target.');
		return this.parse('/me pokes ' + target + '.');
	},
	pet: function (target, room, user) {
		if (!target) return this.sendReply('/pet needs a target.');
		return this.parse('/me pets ' + target + ' lavishly.');
	},
	utube: function (target, room, user) {
		let commaIndex = target.indexOf(',');
		if (commaIndex < 0) return this.errorReply("You forgot the comma.");
		let targetUser = toId(target.slice(0, commaIndex));
		let message = target.slice(commaIndex + 1).trim();
		if (!targetUser || !message) return this.errorReply("Needs a target.");
		if (!Users.get(targetUser).name) return false;
		room.addRaw(OCPU.nameColor(Users.get(targetUser).name, true) + '\'s link: <strong>"' + message + '"</strong>');
	},
	roomlist: function (target, room, user) {
		if (!this.can('hotpatch')) return;

		let header = ['<strong><font color="#DA9D01" size="2">Total users connected: ' + Rooms.global.userCount + '</font></strong><br />'],
			official = ['<strong><font color="#1a5e00" size="2"><u>Official Rooms:</u></font></strong><br />'],
			nonOfficial = ['<hr><strong><u><font color="#000b5e" size="2">Public Rooms:</font></u></strong><br />'],
			privateRoom = ['<hr><strong><font color="#ff5cb6" size="2">Private chat rooms:</font></strong><br />'],
			groupChats = ['<hr><strong><font color="#740B53" size="2">Group Chats:</font></strong><br />'],
			battleRooms = ['<hr><strong><font color="#0191C6" size="2">Battle Rooms:</font></strong><br />'];

		let rooms = [];
		Rooms.rooms.forEach(curRoom => {
			if (curRoom.id !== 'global') rooms.push(curRoom.id);
		});
		rooms.sort();

		for (let u in rooms) {
			let curRoom = Rooms(rooms[u]);
			if (curRoom.type === 'battle') {
				battleRooms.push('<a href="/' + curRoom.id + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
			}
			if (curRoom.type === 'chat') {
				if (curRoom.isPersonal) {
					groupChats.push('<a href="/' + curRoom.id + '" class="ilink">' + curRoom.id + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isOfficial) {
					official.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
				if (curRoom.isPrivate) {
					privateRoom.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + Chat.escapeHTML(curRoom.title) + '</a> (' + curRoom.userCount + ')');
					continue;
				}
			}
			if (curRoom.type !== 'battle') nonOfficial.push('<a href="/' + toId(curRoom.title) + '" class="ilink">' + curRoom.title + '</a> (' + curRoom.userCount + ')');
		}
		this.sendReplyBox(header + official.join(' ') + nonOfficial.join(' ') + privateRoom.join(' ') + (groupChats.length > 1 ? groupChats.join(' ') : '') + (battleRooms.length > 1 ? battleRooms.join(' ') : ''));
	},

	mt: 'mktour',
	mktour: function (target, room, user) {
		if (!target) return this.errorReply("Usage: /mktour [tier] - creates a tournament in single elimination.");
		target = toId(target);
		let t = target;
		if (t === 'rb') t = 'randombattle';
		if (t === 'cc1v1' || t === 'cc1vs1') t = 'challengecup1v1';
		if (t === 'randmono' || t === 'randommonotype') t = 'monotyperandombattle';
		if (t === 'mono') t = 'monotype';
		if (t === 'ag') t = 'anythinggoes';
		if (t === 'ts') t = 'tiershift';
		this.parse('/tour create ' + t + ', elimination');
	},
	pic: 'image',
	image: function (target, room, user) {
		if (!target) return this.sendReply('/image [url] - Shows an image using /a. Requires ~.');
		return this.parse('/a |raw|<center><img src="' + target + '">');
	},
	halloween: function (target, room, user) {
		if (!target) return this.sendReply('/halloween needs a target.');
		return this.parse('/me takes ' + target + '\'s pumpkin and smashes it all over the Pok\u00E9mon Stadium!');
	},
	barn: function (target, room, user) {
		if (!target) return this.sendReply('/barn needs a target.');
		return this.parse('/me has barned ' + target + ' from the entire server!');
	},
	lick: function (target, room, user) {
		if (!target) return this.sendReply('/lick needs a target.');
		return this.parse('/me licks ' + target + ' excessively!');
	},

	def: 'define',
	define: function (target, room, user) {
		if (!target) return this.sendReply('Usage: /define <word>');
		target = toId(target);
		if (target > 50) return this.sendReply('/define <word> - word can not be longer than 50 characters.');
		if (!this.runBroadcast()) return;

		let options = {
			host: 'api.wordnik.com',
			port: 80,
			path: '/v4/word.json/' + target + '/definitions?limit=3&sourceDictionaries=all' +
			'&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
			method: 'GET',
		};

		http.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				data = JSON.parse(data);
				let output = '<font color=#24678d><strong>Definitions for ' + target + ':</strong></font><br />';
				if (!data[0]) {
					this.sendReplyBox('No results for <strong>"' + target + '"</strong>.');
					return room.update();
				} else {
					let count = 1;
					for (let u in data) {
						if (count > 3) break;
						output += '(<strong>' + count + '</strong>) ' + Chat.escapeHTML(data[u]['text']) + '<br />';
						count++;
					}
					this.sendReplyBox(output);
					return room.update;
				}
			});
		});
	},

	u: 'urbandefine',
	ud: 'urbandefine',
	urbandefine: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help urbandefine');
		if (target.toString() > 50) return this.sendReply('Phrase can not be longer than 50 characters.');
		let options = {
			host: 'api.urbandictionary.com',
			port: 80,
			path: '/v0/define?term=' + encodeURIComponent(target),
			term: target,
		};

		http.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				data = JSON.parse(data);
				let definitions = data['list'];
				if (data['result_type'] === 'no_results') {
					this.sendReplyBox('No results for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
					return room.update();
				} else {
					if (!definitions[0]['word'] || !definitions[0]['definition']) {
						this.sendReplyBox('No results for <strong>"' + Chat.escapeHTML(target) + '"</strong>.');
						return room.update();
					}
					let output = '<strong>' + Chat.escapeHTML(definitions[0]['word']) + ':</strong> ' + Chat.escapeHTML(definitions[0]['definition']).replace(/\r\n/g, '<br />').replace(/\n/g, ' ');
					if (output.length > 400) output = output.slice(0, 400) + '...';
					this.sendReplyBox(output);
					return room.update();
				}
			});
		});
	},

	'!hex': true,
	gethex: 'hex',
	hex: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!this.canTalk()) return;
		if (!target) target = toId(user.name);
		return this.sendReplyBox('The hex code for ' + OCPU.nameColor(target, true) + ' is: ' + OCPU.hashColor(target) + '.');
	},

	rsi: 'roomshowimage',
	roomshowimage: function (target, room, user) {
		if (!this.can('ban', null, room)) return false;
		if (!target) return this.parse('/help roomshowimage');
		let parts = target.split(',');
		if (!this.runBroadcast()) return;
		this.sendReplyBox("<img src=" + parts[0] + " width=" + parts[1] + " height=" + parts[1]);
	},
	roomshowimagehelp: ["!rsi [image], [width], [height] - Broadcasts an image to the room"],

	admins: 'usersofrank',
	uor: 'usersofrank',
	usersofrank: function (target, room, user, connection, cmd) {
		if (cmd === 'admins') target = '~';
		if (!target || !Config.groups[target]) return this.parse('/help usersofrank');
		if (!this.runBroadcast()) return;
		let names = [];
		for (let users of Users.users) {
			users = users[1];
			if (Users(users).group === target && Users(users).connected) {
				names.push(Users(users).name);
			}
		}
		if (names.length < 1) return this.sendReplyBox('There are no users of the rank <font color="#24678d"><strong>' + Chat.escapeHTML(Config.groups[target].name) + '</strong></font> currently online.');
		return this.sendReplyBox('There ' + (names.length === 1 ? 'is' : 'are') + ' <font color="#24678d"><strong>' + names.length + '</strong></font> ' + (names.length === 1 ? 'user' : 'users') + ' with the rank <font color="#24678d"><strong>' + Config.groups[target].name + '</strong></font> currently online.<br />' + names.join(', '));
	},
	usersofrankhelp: ["/usersofrank [rank symbol] - Displays all ranked users with that rank currently online."],

	pdeclare: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		if (cmd === 'pdeclare') {
			this.add('|raw|<div class="broadcast-purple"><strong>' + target + '</strong></div>');
		} else if (cmd === 'pdeclare') {
			this.add('|raw|<div class="broadcast-purple"><strong>' + target + '</strong></div>');
		}
		this.addModAction(user.name + ' declared ' + target);
	},

	sd: 'declaremod',
	staffdeclare: 'declaremod',
	modmsg: 'declaremod',
	moddeclare: 'declaremod',
	declaremod: function (target, room, user) {
		if (!target) return this.parse('/help declaremod');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		this.privateModAction('|raw|<div class="broadcast-red"><strong><font size=1><i>Private Auth (Driver +) declare from ' + user.name + '<br /></i></font size>' + target + '</strong></div>');
		this.addModAction(user.name + ' mod declared ' + target);
	},
	declaremodhelp: ['/declaremod [message] - Displays a red [message] to all authority in the respected room.  Requires #, &, ~'],

	'!userid': true,
	userid: function (target, room, user) {
		if (!target) return this.parse('/help userid');
		if (!this.runBroadcast()) return;
		return this.sendReplyBox(Chat.escapeHTML(target) + " ID: <strong>" + Chat.escapeHTML(toId(target)) + "</strong>");
	},
	useridhelp: ["/userid [user] - shows the user's ID (removes unicode from name basically)"],

	pus: 'pmupperstaff',
	pmupperstaff: function (target, room, user) {
		if (!target) return this.sendReply('/pmupperstaff [message] - Sends a PM to every upper staff');
		if (!this.can('pban')) return false;
		OCPU.messageSeniorStaff(target, false, user.name);
	},
	pas: 'pmallstaff',
	pmallstaff: function (target, room, user) {
		if (!target) return this.sendReply('/pmallstaff [message] - Sends a PM to every staff user in a room.');
		if (!this.can('pban')) return false;
		OCPU.pmStaff(target, false, user.name);
	},
	masspm: 'pmall',
	pmall: function (target, room, user) {
		if (!target) return this.sendReply('/pmall [message] - Sends a PM to every user in a room.');
		if (!this.can('pban')) return false;
		OCPU.pmAll(target);
		Monitor.log("(" + Chat.escapeHTML(user.name) + " has PMed all: " + Chat.escapeHTML(target).replace("&apos;", "'") + ")");
	},
	credit: 'credits',
	credits: function (target, room, user) {
		let popup = "|html|" + "<font size=5>OCPU Credits</font><br />" +
		    "<u>Owners:</u><br />" +
		    "- " + OCPU.nameColor('Jolt (S Jolteon)', true) + " (Founder, Sysop, Technical Admin, Development)<br />" +
		    "- " + OCPU.nameColor('SparkyHeliolisk', true) + " (Sysop, Creative Admin, Development)<br />" +
		    "- " + OCPU.nameColor('AlfaStorm', true) + " (Sysop, Technical Admin, Development)<br />" +
		    "<br />" +
			 "<u>Contributors</u><br />" +
			 "- " + OCPU.nameColor('Glameowch', true) + " (Events Admin)<br />" +
			 "<br />" +
		    "<u>Development:</u><br />" +
		    "- " + OCPU.nameColor('Insist', true) + " (Development, Fixed Eslint)<br />" +
		    "<br />" +
		    "<u>Special Thanks:</u><br />" +
		    "- Current staff team<br />" +
		    "- Our regular users<br />" +
		    "- SpacialGaze for the news plugin, the profile plugin, complete economy plugin and the roomrequest plugin.<br />" +
		    "- Origin for the base CSS file<br />" +
			"- WaveLength for the complete PSGO plugin" +
		    "<br />";
		user.popup(popup);
	},

	'!m8b': true,
	helixfossil: 'm8b',
	helix: 'm8b',
	magic8ball: 'm8b',
	m8b: function (target, room, user) {
		if (!this.runBroadcast()) return;
		return this.sendReplyBox(['Signs point to yes.', 'Yes.', 'Reply hazy, try again.', 'Without a doubt.', 'My sources say no.', 'As I see it, yes.', 'You may rely on it.', 'Concentrate and ask again.', 'Outlook not so good.', 'It is decidedly so.', 'Better not tell you now.', 'Very doubtful.', 'Yes - definitely.', 'It is certain.', 'Cannot predict now.', 'Most likely.', 'Ask again later.', 'My reply is no.', 'Outlook good.', 'Don\'t count on it.'].sample());
	},
	coins: 'coingame',
	coin: 'coingame',
	coingame: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let random = Math.floor(2 * Math.random()) + 1;
		let results = '';
		if (random === 1) {
			results = '<img src="http://surviveourcollapse.com/wp-content/uploads/2013/01/zinc.png" width="15%" title="Heads!"><br>It\'s heads!';
		}
		if (random === 2) {
			results = '<img src="http://upload.wikimedia.org/wikipedia/commons/e/e5/2005_Penny_Rev_Unc_D.png" width="15%" title="Tails!"><br>It\'s tails!';
		}
		return this.sendReplyBox('<center><font size="3"><strong>Coin Game!</strong></font><br>' + results + '');
	},
	errorlogs: 'crashlogs',
	crashlogs: function (target, room, user) {
	        if (user.userid === "alfastorm" || user.userid === 'joltsjolteon' || user.userid === 'insist') {
	                let crashes = fs.readFileSync('logs/errors.txt', 'utf8').split('\n').splice(-100).join('\n');
		        user.send('|popup|' + crashes);
		        return;
	        } else {
		        if (!this.can('forcewin')) return false;
		        let crashes = fs.readFileSync('logs/errors.txt', 'utf8').split('\n').splice(-100).join('\n');
		        user.send('|popup|' + crashes);
		}
	},

	friendcodehelp: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('<strong>Friend Code Help:</strong> <br><br />' +
			'/friendcode (/fc) [friendcode] - Sets your Friend Code.<br />' +
			'/getcode (gc) - Sends you a popup of all of the registered user\'s Friend Codes.<br />' +
			'/deletecode [user] - Deletes this user\'s friend code from the server (Requires %, @, &, ~)<br>' +
			'<i>--Any questions, PM papew!</i>');
	},
	friendcode: 'fc',
	fc: function (target, room, user, connection) {
		if (!target) {
			return this.sendReply("Enter in your friend code. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		}
		let fc = target;
		fc = fc.replace(/-/g, '');
		fc = fc.replace(/ /g, '');
		if (isNaN(fc)) return this.sendReply("The friend code you submitted contains non-numerical characters. Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		if (fc.length < 12) return this.sendReply("The friend code you have entered is not long enough! Make sure it's in the format: xxxx-xxxx-xxxx or xxxx xxxx xxxx or xxxxxxxxxxxx.");
		fc = fc.slice(0, 4) + '-' + fc.slice(4, 8) + '-' + fc.slice(8, 12);
		let codes = fs.readFileSync('config/friendcodes.txt', 'utf8');
		if (codes.toLowerCase().indexOf(user.name) > -1) {
			return this.sendReply("Your friend code is already here.");
		}
		fs.writeFileSync('config/friendcodes.txt', codes + '\n' + user.name + ': ' + fc);
		return this.sendReply("Your Friend Code: " + fc + " has been set.");
	},
	viewcode: 'gc',
	getcodes: 'gc',
	viewcodes: 'gc',
	vc: 'gc',
	getcode: 'gc',
	gc: function (target, room, user, connection) {
		let codes = fs.readFileSync('config/friendcodes.txt', 'utf8');
		return user.send('|popup|' + codes);
	},

	deletecode: function (target, room, user) {
		if (!target) {
			return this.sendReply('/deletecode [user] - Deletes the Friend Code of the User.');
		}
		if (!this.can('lock')) return false;
		fs.readFile('config/friendcodes.txt', 'utf8', (err, data) => {
			if (err) console.log(err);
			let row = ('' + data).split('\n');
			let match = false;
			let line = '';
			for (let i = row.length; i > -1; i--) {
				if (!row[i]) continue;
				let line = row[i].split(':');
				if (target === line[0]) {
					match = true;
					line = row[i];
				}
				break;
			}
			if (match === true) {
				let re = new RegExp(line, 'g');
				let result = data.replace(re, '');
				fs.writeFile('config/friendcodes.txt', result, 'utf8', err => {
					if (err) this.sendReply(err);
					this.sendReply('The Friendcode ' + line + ' has been deleted.');
				});
			} else {
				this.sendReply('There is no match.');
			}
		});
	},

	'!facebook': true,
	fb: 'fb',
	facebook: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox('\'s Facebook page can be found <a href="https://www.facebook.com/pages/-Showdown/585196564960185">here</a>.');
	},

	'!dubtrack': true,
	dub: 'dubtrack',
	music: 'dubtrack',
	radio: 'dubtrack',
	dubtrackfm: 'dubtrack',
	dubtrack: function (target, room, user) {
		if (!this.runBroadcast()) return;
		let nowPlaying = "";
		let options = {
			host: 'api.dubtrack.fm',
			port: 443,
			path: '/room/lobby',
			method: 'GET',
		};
		https.get(options, res => {
			let data = '';
			res.on('data', chunk => {
				data += chunk;
			}).on('end', () => {
				if (data.charAt(0) === '{') {
					data = JSON.parse(data);
					if (data['data'] && data['data']['currentSong']) nowPlaying = "<br /><strong>Now Playing:</strong> " + Chat.escapeHTML(data['data']['currentSong'].name);
				}
				this.sendReplyBox('Join our dubtrack.fm room <a href="https://www.dubtrack.fm/join/ocpu_150896577063595">here!</a>' + nowPlaying);
				room.update();
			});
		});
	},

	declareaotd: function (target, room, user) {
		if (room.id !== 'lobby') return this.sendReply("The command must be used in Lobby.");
		if (!user.can('broadcast', null, room)) return this.sendReply('You do not have enough authority to use this command.');
		if (!this.canTalk()) return false;
		this.add(
			'|raw|<div class="broadcast-blue"><strong>AOTD has begun in enrodRadioTower! ' +
			'<button name="joinRoom" value="enrodradiotower" target="_blank">Join now</button> to nominate your favorite artist for AOTD to be featured on the ' +
			'official page next to your name for a chance to win the monthly prize at the end of the month!</strong></div>'
		);
		this.addModAction(user.name + " used declareaotd.");
	},

	hideconsoleuser: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/hideconsoleuser - Access denied.");
		}
		if (user.hidden) return this.errorReply("You are already hiding yourself on the userlist.");
		user.hidden = true;
		for (let u in user.roomCount) {
			if (Rooms(u).id !== 'global') {
				Rooms(u).add('|L|' + user.getIdentity(Rooms(u))).update();
			}
		}
		return this.sendReply("You are now hiding.");
	},

	showconsoleuser: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/showconsoleuser - Access denied.");
		}
		if (!user.hidden) return this.errorReply("You are already showing yourself on the userlist.");
		user.hidden = false;
		for (let u in user.roomCount) {
			if (Rooms(u).id !== 'global') {
				Rooms(u).add('|J|' + user.getIdentity(Rooms(u))).update();
			}
		}
		return this.sendReply("You are no longer hiding.");
	},

	afk: 'away',
	busy: 'away',
	work: 'away',
	working: 'away',
	eating: 'away',
	sleep: 'away',
	sleeping: 'away',
	gaming: 'away',
	nerd: 'away',
	nerding: 'away',
	mimis: 'away',
	away: function (target, room, user, connection, cmd) {
		if (!user.isAway && user.name.length > 19 && !user.can('lock')) return this.sendReply("Your username is too long for any kind of use of this command.");
		if (!this.canTalk()) return false;
		target = toId(target);
		if (/^\s*$/.test(target)) target = 'away';
		if (cmd !== 'away') target = cmd;
		let newName = user.name;
		let status = parseStatus(target, true);
		let statusLen = status.length;
		if (statusLen > 14) return this.sendReply("Your away status should be short and to-the-point, not a dissertation on why you are away.");

		if (user.isAway) {
			let statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/); // eslint-disable-line no-useless-escape
			if (statusIdx > -1) newName = newName.substr(0, statusIdx);
			if (user.name.substr(-statusLen) === status) return this.sendReply("Your away status is already set to \"" + target + "\".");
		}

		newName += ' - ' + status;
		if (newName.length > 18 && !user.can('lock')) return this.sendReply("\"" + target + "\" is too long to use as your away status.");

		// forcerename any possible impersonators
		let targetUser = Users.getExact(user.userid + target);
		if (targetUser && targetUser !== user && targetUser.name === user.name + ' - ' + target) {
			targetUser.resetName();
			targetUser.send("|nametaken||Your name conflicts with " + user.name + (user.name.substr(-1) === "s" ? "'" : "'s") + " new away status.");
		}

		if (user.can('mute', null, room)) this.add("|raw|-- " + OCPU.nameColor(user.name, true) + " is now " + target.toLowerCase() + ".");
		if (user.can('lock')) this.parse('/hide');
		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = true;
	},
	awayhelp: ["/away [message] - Sets a user's away status."],

	back: function (target, room, user) {
		if (!user.isAway) return this.sendReply("You are not set as away.");
		user.isAway = false;

		let newName = user.name;
		let statusIdx = newName.search(/\s\-\s[\u24B6-\u24E9\u2460-\u2468\u24EA]+$/); // eslint-disable-line no-useless-escape
		if (statusIdx < 0) {
			user.isAway = false;
			if (user.can('mute', null, room)) this.add("|raw|-- " + OCPU.nameColor(user.userid, true) + " is no longer away.");
			return false;
		}

		let status = parseStatus(newName.substr(statusIdx + 3), false);
		newName = newName.substr(0, statusIdx);
		user.forceRename(newName, user.registered);
		user.updateIdentity();
		user.isAway = false;
		if (user.can('mute', null, room)) this.add("|raw|-- " + OCPU.nameColor(user.userid, true) + " is no longer " + status.toLowerCase() + ".");
		if (user.can('lock')) this.parse('/show');
	},
	backhelp: ["/back - Sets a users away status back to normal."],

	customcolour: 'customcolor',
	customcolor: {
		set: function (target, room, user) {
			if (!this.can('roomowner')) return false;
			target = target.split(',');
			for (let u = 0; u < target.length; u++) target[u] = target[u].trim();
			if (!target[1]) return this.parse('/help customcolor');
			if (toId(target[0]).length > 19) return this.errorReply("Usernames are not this long...");
			this.sendReply("|raw|You have given <strong><font color=" + target[1] + ">" + Chat.escapeHTML(target[0]) + "</font></strong> a custom color.");
			this.privateModAction("(" + target[0] + " has received custom color: '" + target[1] + "' from " + user.name + ".)");
			Monitor.adminlog(target[0] + " has received custom color: '" + target[1] + "' from " + user.name + ".");
			customColors[toId(target[0])] = target[1];
			updateColor();
		},
		delete: function (target, room, user) {
			if (!this.can('roomowner')) return false;
			if (!target) return this.parse('/help customcolor');
			if (!customColors[toId(target)]) return this.errorReply('/customcolor - ' + target + ' does not have a custom color.');
			delete customColors[toId(target)];
			updateColor();
			this.sendReply("You removed " + target + "'s custom color.");
			this.privateModAction("(" + target + "'s custom color was removed by " + user.name + ".)");
			Monitor.adminlog(target + "'s custom color was removed by " + user.name + ".");
			if (Users(target) && Users(target).connected) Users(target).popup(user.name + " removed your custom color.");
			return;
		},
		preview: function (target, room, user) {
			if (!this.runBroadcast()) return;
			target = target.split(',');
			for (let u = 0; u < target.length; u++) target[u] = target[u].trim();
			if (!target[1]) return this.parse('/help customcolor');
			return this.sendReplyBox('<strong><font size="3" color="' + target[1] + '">' + Chat.escapeHTML(target[0]) + '</font></strong>');
		},
		reload: function (target, room, user) {
			if (!this.can('hotpatch')) return false;
			updateColor();
			this.privateModAction("(" + user.name + " has reloaded custom colours.)");
		},
		'': function (target, room, user) {
			return this.parse("/help customcolor");
		},
	},
	customcolorhelp: [
		"Commands Include:",
		"/customcolor set [user], [hex] - Gives [user] a custom color of [hex]",
		"/customcolor delete [user], delete - Deletes a user's custom color",
		"/customcolor reload - Reloads colours.",
		"/customcolor preview [user], [hex] - Previews what that username looks like with [hex] as the color.",
	],

	poofoff: 'nopoof',
	nopoof: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = true;
		return this.sendReply("Poof is now disabled.");
	},
	poofon: function () {
		if (!this.can('poofoff')) return false;
		Config.poofOff = false;
		return this.sendReply("Poof is now enabled.");
	},

	advertise: 'advertisement',
	advertisement: function (target, room, user, connection) {
		if (room.id !== 'lobby') return this.errorReply("This command can only be used in the Lobby.");
		if (Economy.readMoneySync(user.userid) < ADVERTISEMENT_COST) return this.errorReply("You do not have enough bucks to buy an advertisement, they cost " + ADVERTISEMENT_COST + "  buck" + pluralFormat(ADVERTISEMENT_COST, 's') + ".");
		if (target.length > 600) return this.errorReply("This advertisement is too long.");
		target = target.split('|');
		let targetRoom = (Rooms.search(target[0]) ? target[0] : false);
		if (!room || !target || !target[1]) return this.parse('/help advertise');
		if (!targetRoom) return this.errorReply("Room '" + toId(target[0]) + "' not found.  Check spelling?");
		if (user.lastAdvertisement) {
			let milliseconds = (Date.now() - user.lastAdvertisement);
			let seconds = ((milliseconds / 1000) % 60);
			let remainingTime = Math.round(seconds - (15 * 60));
			if (((Date.now() - user.lastAdvertisement) <= 15 * 60 * 1000)) return this.errorReply("You must wait " + (remainingTime - remainingTime * 2) + " seconds before submitting another advertisement.");
		}
		let advertisement = (Config.chatfilter ? Config.chatfilter(Chat.escapeHTML(target[1]), user, room, connection) : Chat.escapeHTML(target[1]));
		if (user.lastCommand !== 'advertise') {
			this.sendReply("WARNING: this command will cost you " + ADVERTISEMENT_COST + "  buck" + pluralFormat(ADVERTISEMENT_COST, 's') + " to use.");
			this.sendReply("To continue, use this command again.");
			user.lastCommand = 'advertise';
		} else if (user.lastCommand === 'advertise') {
			let buttoncss = 'background: #ff9900; text-shadow: none; padding: 2px 6px; color: black; text-align: center; border: black, solid, 1px;';
			Rooms('lobby').add('|raw|<div class="infobox"><strong style="color: green;">Advertisement:</strong> ' + advertisement + '<br /><hr width="80%"><button name="joinRoom" class="button" style="' + buttoncss + '" value="' + toId(targetRoom) + '">Click to join <strong>' + Rooms.search(toId(targetRoom)).title + '</strong></button> | <i><font color="gray">(Advertised by</font> ' + OCPU.nameColor(user.name) + '<font color="gray">)</font></i></div>').update();
			Economy.writeMoney(user.userid, -ADVERTISEMENT_COST);
			user.lastCommand = '';
			user.lastAdvertisement = Date.now();
		}
	},
	advertisehelp: ['Usage: /advertise [room] | [advertisement] - Be sure to have | seperating the room and the actual advertisement.'],

	// Animal command by Kyvn and DNS
	animal: 'animals',
	animals: function (target, room, user) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help animals');
		let tarId = toId(target);
		let validTargets = ['cat', 'otter', 'dog', 'bunny', 'pokemon', 'kitten', 'puppy'];
		if (room.id === 'lobby') return this.errorReply("This command cannot be broadcasted in the Lobby.");
		if (!validTargets.includes(tarId)) return this.parse('/help animals');
		let reqOpts = {
			hostname: 'api.giphy.com', // Do not change this
			path: '/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + tarId,
			method: 'GET',
		};
		let request = http.request(reqOpts, response => {
			response.on('data', chunk => {
				try {
					let data = JSON.parse(chunk);
					let output = '<center><img src="' + data.data["image_url"] + '" width="50%"></center>';
					if (!this.runBroadcast()) return;
					if (data.data["image_url"] === undefined) {
						this.errorReply("ERROR CODE 404: No images found!");
						return room.update();
					} else {
						this.sendReplyBox(output);
						return room.update();
					}
				} catch (e) {
					this.errorReply("ERROR CODE 503: Giphy is unavaliable right now. Try again later.");
					return room.update();
				}
			});
		});
		request.end();
	},
	animalshelp: ['Animals Plugin by DarkNightSkies & Kyv.n(♥)',
		'/animals cat - Displays a cat.',
		'/animals kitten - Displays a kitten.',
		'/animals dog - Displays a dog.',
		'/animals puppy - Displays a puppy.',
		'/animals bunny - Displays a bunny.',
		'/animals otter - Displays an otter.',
		'/animals pokemon - Displays a pokemon.',
		'/animals help - Displays this help box.',
	],

	'!seen': true,
	seen: function (target) {
		if (!this.runBroadcast()) return;
		if (!target) return this.parse('/help seen');
		let targetUser = Users.get(target);
		if (targetUser && targetUser.connected) return this.sendReplyBox(OCPU.nameColor(targetUser.name, true) + " is <strong><font color='limegreen'>Currently Online</strong></font>.");
		target = Chat.escapeHTML(target);
		let seen = Db.seen.get(toId(target));
		if (!seen) return this.sendReplyBox(OCPU.nameColor(target, true) + " has <strong><font color='red'>never been online</font></strong> on this server.");
		this.sendReplyBox(OCPU.nameColor(target, true) + " was last seen <strong>" + Chat.toDurationString(Date.now() - seen, {precision: true}) + "</strong> ago.");
	},
	seenhelp: ["/seen - Shows when the user last connected on the server."],

	rf: 'roomfounder',
	roomfounder: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomfounder - This room isn't designed for per-room moderation to be added");
		}
		if (!target) return this.parse('/help roomfounder');
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`User '${this.targetUsername}' is offline and unrecognized, and so can't be promoted.`);
		}

		if (!this.can('makeroom')) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		room.auth[userid] = '#';
		room.chatRoomData.founder = userid;
		room.founder = userid;
		this.addModAction(`${name} was appointed Room Founder by ${user.name}.`);
		if (targetUser) {
			targetUser.popup(`|html|You were appointed Room Founder by ${OCPU.nameColor(user.name, true)} in ${room.title}.`);
			room.onUpdateIdentity(targetUser);
		}
		Rooms.global.writeChatRoomData();
	},
	roomfounderhelp: ["/roomfounder [username] - Appoints [username] as a room founder. Requires: & ~"],

	deroomfounder: 'roomdefounder',
	roomdefounder: function (target, room) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomdefounder - This room isn't designed for per-room moderation.");
		}
		if (!target) return this.parse('/help roomdefounder');
		if (!this.can('makeroom')) return false;
		let targetUser = toId(target);
		if (room.founder !== targetUser) return this.errorReply(targetUser + ' is not the room founder of ' + room.title + '.');
		room.founder = false;
		room.chatRoomData.founder = false;
		return this.parse('/roomdeauth ' + target);
	},
	roomdefounderhelp: ["/roomdefounder [username] - Revoke [username]'s room founder position. Requires: &, ~"],

	roomowner: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		if (!target) return this.parse('/help roomowner');
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`User '${this.targetUsername}' is offline and unrecognized, and so can't be promoted.`);
		}

		if (!user.can('makeroom')) {
			if (user.userid !== room.founder) return false;
		}

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		room.auth[userid] = '#';
		this.addModAction(`${name} was appointed Room Owner by ${user.name}.`);
		if (targetUser) {
			targetUser.popup(`|html|You were appointed Room Owner by ${OCPU.nameColor(user.name, true)} in ${room.title}.`);
			room.onUpdateIdentity(targetUser);
		}
		Rooms.global.writeChatRoomData();
	},
	roomownerhelp: ["/roomowner [username] - Appoints [username] as a room owner. Requires: & ~"],

	roomdeowner: 'deroomowner',
	deroomowner: function (target, room, user) {
		if (!room.auth) {
			return this.sendReply("/roomdeowner - This room isn't designed for per-room moderation");
		}
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);
		if (!userid || userid === '') return this.sendReply("User '" + name + "' does not exist.");

		if (room.auth[userid] !== '#') return this.sendReply("User '" + name + "' is not a room owner.");
		if (!room.founder || user.userid !== room.founder && !this.can('makeroom', null, room)) return false;

		delete room.auth[userid];
		this.sendReply("(" + name + " is no longer Room Owner.)");
		if (targetUser) targetUser.updateIdentity();
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
	},

	'!authority': true,
	auth: 'authority',
	stafflist: 'authority',
	globalauth: 'authority',
	authlist: 'authority',
	authority: function (target, room, user, connection) {
		if (target) {
			let targetRoom = Rooms.search(target);
			let unavailableRoom = targetRoom && targetRoom.checkModjoin(user);
			if (targetRoom && !unavailableRoom) return this.parse('/roomauth1 ' + target);
			return this.parse('/userauth ' + target);
		}
		let rankLists = {};
		let ranks = Object.keys(Config.groups);
		for (let u in Users.usergroups) {
			let rank = Users.usergroups[u].charAt(0);
			if (rank === ' ') continue;
			// In case the usergroups.csv file is not proper, we check for the server ranks.
			if (ranks.includes(rank)) {
				let name = Users.usergroups[u].substr(1);
				if (!rankLists[rank]) rankLists[rank] = [];
				if (name) rankLists[rank].push(OCPU.nameColor(name, (Users(name) && Users(name).connected)));
			}
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r =>
			(Config.groups[r] ? "<b>" + Config.groups[r].name + "s</b> (" + r + ")" : r) + ":\n" + rankLists[r].sort((a, b) => toId(a).localeCompare(toId(b))).join(", ")
		);

		if (!buffer.length) return connection.popup("This server has no global authority.");
		connection.send("|popup||html|" + buffer.join("\n\n"));
	},

	'!roomauth': true,
	roomstaff: 'roomauth',
	roomauth1: 'roomauth',
	roomauth: function (target, room, user, connection, cmd) {
		let userLookup = '';
		if (cmd === 'roomauth1') userLookup = '\n\nTo look up auth for a user, use /userauth ' + target;
		let targetRoom = room;
		if (target) targetRoom = Rooms.search(target);
		if (!targetRoom || targetRoom.id === 'global' || !targetRoom.checkModjoin(user)) return this.errorReply(`The room "${target}" does not exist.`);
		if (!targetRoom.auth) return this.sendReply("/roomauth - The room '" + (targetRoom.title || target) + "' isn't designed for per-room moderation and therefore has no auth list." + userLookup);

		let rankLists = {};
		for (let u in targetRoom.auth) {
			if (!rankLists[targetRoom.auth[u]]) rankLists[targetRoom.auth[u]] = [];
			rankLists[targetRoom.auth[u]].push(u);
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r => {
			let roomRankList = rankLists[r].sort();
			roomRankList = roomRankList.map(s => ((Users(s) && Users(s).connected) ? OCPU.nameColor(s, true) : OCPU.nameColor(s)));
			return (Config.groups[r] ? Chat.escapeHTML(Config.groups[r].name) + "s (" + Chat.escapeHTML(r) + ")" : r) + ":\n" + roomRankList.join(", ");
		});

		if (!buffer.length) {
			connection.popup("The room '" + targetRoom.title + "' has no auth." + userLookup);
			return;
		}
		if (targetRoom.founder) {
			buffer.unshift((targetRoom.founder ? "Room Founder:\n" + ((Users(targetRoom.founder) && Users(targetRoom.founder).connected) ? OCPU.nameColor(targetRoom.founder, true) : OCPU.nameColor(targetRoom.founder)) : ''));
		}
		if (targetRoom !== room) buffer.unshift("" + targetRoom.title + " room auth:");
		connection.send("|popup||html|" + buffer.join("\n\n") + userLookup);
	},
};
