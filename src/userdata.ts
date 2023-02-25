import { rest, Routes } from './discordapi.js';

class UserData {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;

    protected constructor(
        id: string,
        username: string,
        discriminator: string,
        avatar: string
    ) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
        this.avatar = avatar;
    }

    static async getUserData(id: string): Promise<UserData> {
        return (await rest.get(Routes.user(id))) as UserData;
    }
}

export { UserData };
