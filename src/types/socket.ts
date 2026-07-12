import type { Socket } from "socket.io";

export interface BasePrincipal {
    kind: "user";
}

export interface UserPrincipal extends BasePrincipal {
    userId: number;
    events: string[];
}

export type Principal = UserPrincipal;

export interface AuthenticatedSocket extends Socket {
    principal?: Principal;
}
