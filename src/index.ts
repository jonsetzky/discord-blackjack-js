import * as config from './config.js';
import { REST, Routes, Client, GatewayIntentBits, OAuth2Scopes } from 'discord.js';
import {
	joinVoiceChannel,
	createAudioPlayer,
	createAudioResource,
	entersState,
	StreamType,
	AudioPlayerStatus,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { SQLiteDB } from './db-sqlite.js';

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!',
    },
    {
        name: 'interactions',
        description: 'Replies with the number of interactions by the user.',
    },
];

const db = new SQLiteDB();

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.APPLICATION_ID), {
            body: commands,
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
if (client === null) throw new Error("Couldn't initiate discord.js Client");

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const username = interaction.user.username;
    const command = interaction.commandName;

    // increment interaction counter
    const lastCount = await db.has(username) ? await db.get<number>(username) : 0;
    db.set(username, lastCount + 1);

    switch (command) {
        case 'ping':
            await interaction.reply('Pong!');
            break;

        case 'interactions':
            await interaction.reply(`${username}: ${lastCount+1}`);
            break;

        default:
            break;
    }
});


(async () => {
    await client.login(config.BOT_TOKEN);

    
    
    // console.log("Invite link: ", client.generateInvite({
    //     scopes: [
    //         OAuth2Scopes.Bot
    //     ]
    // }));
})();
