/**
* Todo System for OCPU
* This will allow devs to see what needs to be done from other devs and possibly help them.
* Credits: Jolt(S Jolteon)
*/

'use strict';

const notifiedUsers = {};

function isDev(user) {
	if (!user) return;
	if (typeof user === 'object') user = user.userid;
	let dev = Db.devs.get(toId(user));
	if (dev === 1) return true;
	return false;
}

function generateTodo() {
	let todoData, todoDisplay = [];
	ley keys = Db.todo.keys();
	for (let i = 0; i < keys.length; i++) {
		todoData = Db.todo.get(keys[i]);
		todoDisplay.push(`<h4>${keys[i]}</h4>${todoData[1]}<br /><br />—${OCPU.nameColor(todoData[0], true)} <small>on ${todoData[2]}</small>`);
	}
	return todoDisplay;
}

function showSubButton(userid) {
	let hasSubscribed = Db.todoSubscribers.get(userid, false);
	return `<hr><center><button class="button" name="send" value="/todo ${(hasSubscribed ? `unsubscribe` : `subscribe`)}">${(hasSubscribed ? `Unscribe from the todo updates` : `Subscribe to the todo updates`)}</button></center>`;
}

OCPU.showTodo = function (userid, user) {
	if (!user || !userid) return false;
	if (!Db.todoSubscribers.has(userid) || (userid in notifiedUsers)) return false;
	let todoDisplay = generateTodo();
	if (todoDisplay.length > 0) {
		todoDisplay = `${todoDisplay.join('<hr>')}${showSubButton(userid)}`;
		notifiedUsers[userid] = setTimeout(() => {
			delete notifiedUsers[userid];
		}, 60 * 60 * 1000);
		return user.send(`|pm|~OCPU Dev Server|${user.getIdentity()}|/raw ${todoDisplay}`;
	}
};

exports.commands = {
	/*todo: function (target, room, user) {
		if (!this.can("ban", null, room)) return this.errorReply("/todo - Access Denied.");
		if (room.id !== 'development') return this.errorReply("This command can only be used in Development.");
		user.popup("This command is currently not completed right now.");
	},*/
	todo: 'devchecklist',
	devchecklist: {
		'': 'view',
		display: 'view',
		view: function(target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied");
			if (room.id !== 'development') return this.errorReply("This command can only be used in Development.");
			let output = `<center><strong>OCPU Todo List:</strong></center>${generateTodo().join(`<hr>`)}${showSubButton(user.userid)}`;
			return user.send(`|popup||wide|html|${output}`);
		},
		remove: 'delete',
		delete: function (target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied");
			if (!target) return this.parse("/devchecklist help");
			if (!Db.todo.has(target)) return this.errorReply("This is not something a dev requested (Did you mis-type the title?)");
			Db.todo.remove(target);
		},
		add: function (target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied");
			if (!target) return this.parse("/devchecklist help");
			let parts = target.split(",");
			if (parts.length < 2) return this.errorReply("Usage: /todo add [title], [desc]");
			let descArray = [];
			if (parts.legnth - 2 > 0) {
				for (let j = 0; j < parts.length; j++) {
					if (j < 1) continue;
					descArray.push(parts[j]);
				}
				parts[1] = descArray.join();
			}
			let title = parts[0], desc = parts[1], postedBy = user.name;
			let d = new Date();
			const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
			"July", "Aug", "Sep", "Oct", "Nov", "Dec",
			];
			let postTime = `${MonthNames[d.getUTCMonth()} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
			Db.todo.set(title, [postedBy, desc, postTime]);
		},
		subscribe: function (target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied.");
			if (Db.todoSubscribers.has(user.userid)) return this.errorReply("You are already subscribed to the dev news server.");
			Db.todoSubscribers.set(user.userid, true);
			this.sendReply("You have successfully subscribed to the dev news server.");
		},
		unsubscribe: function (target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied");
			if (!Db.todoSubscribers.has(user.userid)) return this.errorReply("You have not subscribed to the dev news server.");
			Db.todoSubscribers.set(user.userid, false);
			this.sendReply("You have successfully unsubscribed from the dev news server.");
		},
		help: function (target, room, user) {
			if (!isDev(user)) return this.errorReply("/todo - Access Denied");
			return this.sendReplyBox(
			`/todo view - View current dev issues on this server<br />` +
			`/todo add [title], [desc] - Adds the current issue to the dev list on the server<br />` +
			`/todo delete [title] - Delete issue from the list (once completed)<br />` +
			`/todo <subscribe/unsubscribe> - Subscribes or unscribes to the dev news`
		},
	},
};
