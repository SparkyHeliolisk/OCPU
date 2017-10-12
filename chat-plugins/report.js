'use strict';

exports.commands = {
	'bas': 'battlealertstaff',
	battlealertstaff: function (target, room, user) {
		if (!room.battle) return this.errorReply("This command MUST be used in a battle.");
		if (!this.can('nooverride', null, room)) return this.errorReply("You cannot use this command!");
		if (!target) return this.errorReply("This command requires a target.");
		if (!target === 'Ruling' || !target === 'Hacker' || !target === 'Time-staller') {
			return this.errorReply("That is not a correct reason. Vaild reasons are: Ruling, Hacker, or Time-stalling.");
		}

		if (user.group === '~' || user.group === '&') {
			return this.errorReply("You can already manipulate the current battle.");
		}

		OCPU.messageSeniorStaff(user.name + " needs help in the room " + room.id + " for " + target + ".");
	},
	'ur': 'userreport',
	'ureport': 'userreport',
	userreport: function (target, room, user) {
		if (!target) return this.parse('/help userreport');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (room.id === 'help') return this.errorReply("You do not need to use this in the Help room!");
		if (!this.canTalk()) return this.errorReply("You do not need to use this.");

		if (this.targetUsername === user.name) return this.errorReply("You cannot report yourself!");
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");

		this.popupReply("If this report is false, you will be locked by a staff member.");

		OCPU.pmStaff(user.name + " needs help with the user " + this.targetUsername + " for " + target + ". All actions taken against either of these users must first be authorized with a global & or ~.");
		OCPU.messageSeniorStaff(user.name + " has sent in a report. Please check the other automated message to check who it is.");
	},
	userreporthelp: ["/userreport [user], [reason] - Reports a specific user to global auth through a special PM system."],

	'sc': 'staffcommand',
	staffcommand: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("You should never use this command.");
		}

		if (!target) {
			return this.errorReply("You cannot just spam empty messages to your staff members. That would get you nowhere.");
		}

		if (!Config.emergency) {
			return this.errorReply("An emergency is currently not going on. Please use '/alertstaff' instead.");
		}

		OCPU.pmStaff("Emergency Command from " + user.name + ": **" + target + "**.");
	},
};
