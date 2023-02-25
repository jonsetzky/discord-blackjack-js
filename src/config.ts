export const APPLICATION_ID = process.env.APPLICATION_ID ?? '';
export const PUBLIC_KEY = process.env.PUBLIC_KEY ?? '';
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '';
export const BOT_TOKEN = process.env.BOT_TOKEN ?? '';

console.assert(APPLICATION_ID, 'Application ID not set!');
console.assert(PUBLIC_KEY, 'Public key not set!');
console.assert(PRIVATE_KEY, 'Application ID not set!');
console.assert(BOT_TOKEN, 'Application ID not set!');
if (!(APPLICATION_ID && PUBLIC_KEY && PRIVATE_KEY && BOT_TOKEN))
    process.exit(1);
