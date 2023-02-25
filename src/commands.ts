import { CacheType, ChatInputCommandInteraction } from 'discord.js';

import { SQLiteDB } from './db-sqlite.js';
import { UserData } from './userdata.js';

const db = new SQLiteDB();

interface CommandInfo {
    name: string;
    description: string;
}
interface Command extends CommandInfo {
    callback(
        interaction: ChatInputCommandInteraction<CacheType>
    ): Promise<unknown>;
}

class Commands {
    private commands;

    constructor(commands: Array<Command>) {
        this.commands = commands;
    }

    getCommandInfo(): Array<CommandInfo> {
        return this.commands.map((cmd) => {
            return {
                name: cmd.name.toLowerCase(),
                description: cmd.description,
            };
        });
    }

    getCommand(name: string): Command {
        return (
            this.commands.find((cmd) => cmd.name == name) ?? {
                name: 'cmdnotfound',
                description: 'This is ran when a command is not found',
                async callback(interaction) {
                    return interaction.reply(`Command ${name} not found!`);
                },
            }
        );
    }
}

const commands = new Commands([
    {
        name: 'ping',
        description: 'Replies with Pong!',
        async callback(interaction) {
            return interaction.reply('Pong!');
        },
    },
    {
        name: 'interactions',
        description: 'Replies with the number of interactions by the user.',
        async callback(interaction) {
            const username = interaction.user.username;
            return interaction.reply(
                `${username}: ${await db.get<number>(username)}`
            );
        },
    },
    {
        name: 'userdata',
        description: "Replies with users' user data",
        async callback(interaction) {
            const userId = interaction.user.id;
            await UserData.getUserData(userId).then(
                (userData) => interaction.reply(JSON.stringify(userData)),
                (reject) =>
                    interaction.reply(`Couldn't get userdata for: ${userId}`)
            );
        },
    },
]);

export { commands };
