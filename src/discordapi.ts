import { REST, Routes } from 'discord.js';
import * as config from './config.js';

const rest = new REST({ version: '10' }).setToken(config.BOT_TOKEN);

export { rest, Routes };
