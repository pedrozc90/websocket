import type { Principal } from "../types/socket.ts";

export const resolveRooms = (principal?: Principal): string | undefined => {
    if (principal?.kind === "user") {
        return `user:${principal.userId}`;
    }
    return undefined;
};
