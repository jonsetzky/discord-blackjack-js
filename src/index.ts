import * as config from './config.js';
import { commands } from './commands.js';
import {
    Routes,
    Client,
    GatewayIntentBits,
    OAuth2Scopes,
    Partials,
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    ReactionManager,
    Message,
    MessageReplyOptions,
    MessagePayload,
} from 'discord.js';
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
import { rest } from './discordapi.js';

declare module 'discord.js' {
    interface Message {
        replyWithTimeout(
            options: string | MessagePayload | MessageReplyOptions,
            timeoutMs: number
        ): Promise<Message<any>>;
    }
}
Message.prototype.replyWithTimeout = async function (
    options: string | MessagePayload | MessageReplyOptions,
    timeoutMs: number
): Promise<Message<any>> {
    return this.reply(options).then((msg) => {
        setTimeout(async () => msg.delete(), timeoutMs);
        return msg;
    });
};

const db = new SQLiteDB();

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(config.APPLICATION_ID), {
            body: commands.getCommandInfo(),
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
if (client === null) throw new Error("Couldn't initiate discord.js Client");

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageReactionAdd', async (reaction, user) => {
    const message = reaction.message;
    if (user === client.user) return;

    if (reaction?.emoji.name === '👍') {
        message.replyWithTimeout('You reacted with a thumbs up.', 3000);
    } else if (reaction?.emoji.name === '👎') {
        message.replyWithTimeout('You reacted with a thumbs down.', 3000);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // increment interaction counter
    const username = interaction.user.username;
    const lastCount = (await db.has(username))
        ? await db.get<number>(username)
        : 0;
    await db.set(username, lastCount + 1);

    await commands.getCommand(interaction.commandName).callback(interaction);
});

(async () => {
    await client.login(config.BOT_TOKEN);

    // console.log("Invite link: ", client.generateInvite({
    //     scopes: [
    //         OAuth2Scopes.Bot
    //     ]
    // }));
})();
