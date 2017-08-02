const { token, owner, prefix, invite } = require('./config');
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
	commandPrefix: prefix,
	owner,
	invite,
	disableEveryone: true,
	unknownCommandResponse: false,
	disabledEvents: [
		'TYPING_START',
		'VOICE_STATE_UPDATE',
		'FRIEND_ADD',
		'FRIEND_REMOVE'
	],
	messageCacheLifetime: 60,
	messageSweepInterval: 60
});
const { carbon, dBots, dBotsOrg, parseTopic, parseTopicMsg } = require('./structures/Util');

client.registry
	.registerDefaultTypes()
	.registerGroups([
		['util', 'Utility'],
		['user-info', 'User Info'],
		['guild-info', 'Server Info'],
		['moderation', 'Moderation'],
		['random-res', 'Random Response'],
		['random-img', 'Random Image'],
		['image-edit', 'Image Manipulation'],
		['avatar-edit', 'Avatar Manipulation'],
		['text-edit', 'Text Manipulation'],
		['num-edit', 'Number Manipulation'],
		['search', 'Search'],
		['games', 'Games'],
		['random', 'Random/Other'],
		['roleplay', 'Roleplay']
	])
	.registerDefaultCommands({
		help: false,
		ping: false,
		prefix: false,
		commandState: false
	})
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
	console.log(`[READY] Shard ${client.shard.id} Logged in as ${client.user.tag} (${client.user.id})!`);
	client.user.setGame(`${prefix}help | Shard ${client.shard.id}`);
});

client.on('disconnect', event => {
	console.log(`[DISCONNECT] Shard ${client.shard.id} disconnected with Code ${event.code}.`);
	process.exit(0);
});

client.on('error', console.error);

client.on('warn', console.warn);

client.on('commandError', (command, err) => console.error(command.name, err));

client.on('commandRun', command => ++command.uses);

client.on('message', async msg => {
	if (!msg.guild || msg.author.bot) return;
	const topic = msg.guild.defaultChannel.topic || '';
	if (!topic.toLowerCase().includes('<inviteguard>')) return;
	const member = await msg.guild.fetchMember(msg.author);
	if (member.hasPermission('ADMINISTRATOR')) return;
	if (/discord(\.gg\/|app\.com\/invite\/|\.me\/)/gi.test(msg.content)) {
		if (msg.channel.permissionsFor(client.user).has('MANAGE_MESSAGES')) msg.delete();
		msg.reply('Invites are prohibited from being posted here.');
	}
});

client.on('guildMemberAdd', member => {
	const channel = parseTopic(member.guild.channels, 'memberlog', client.user).first();
	if (!channel) return;
	const msg = parseTopicMsg(channel.topic, 'joinmessage')
		.replace(/{{member}}/gi, member.user.username)
		.replace(/{{server}}/gi, member.guild.name)
		.replace(/{{mention}}/gi, member);
	channel.send(msg || `Welcome ${member.user.username}!`);
});

client.on('guildMemberRemove', member => {
	const channel = parseTopic(member.guild.channels, 'memberlog', client.user).first();
	if (!channel) return;
	const msg = parseTopicMsg(channel.topic, 'leavemessage')
		.replace(/{{member}}/gi, member.user.username)
		.replace(/{{server}}/gi, member.guild.name)
		.replace(/{{mention}}/gi, member);
	channel.send(msg || `Bye ${member.user.username}...`);
});

client.on('guildCreate', async guild => {
	console.log(`[GUILD] I have joined ${guild.name}! (${guild.id})`);
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	carbon(count);
	dBots(count, client.user.id);
	dBotsOrg(count, client.user.id);
});

client.on('guildDelete', async guild => {
	console.log(`[GUILD] I have left ${guild.name}... (${guild.id})`);
	const guilds = await client.shard.fetchClientValues('guilds.size');
	const count = guilds.reduce((prev, val) => prev + val, 0);
	carbon(count);
	dBots(count, client.user.id);
	dBotsOrg(count, client.user.id);
});

client.login(token);

process.on('unhandledRejection', console.error);
