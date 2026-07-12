import type { VerifiedUser } from "../types/index.ts";

const _map = new Map<string, number>([
    ["Ar3kzjew5YWqCbmiQbQLYPwqKl83zunM", 32],
    ["FrchnAp0emAh776MZ565ykNbTbTF88F7", 128],
]);

export const findUser = async (token: string): Promise<VerifiedUser> => {
    const userId = _map.get(token);
    if (!userId) {
        throw new Error(`User '${token}' not found`);
    }
    return { userId };
};
