import http from "http";

export const createServer = (): http.Server => {
    return http.createServer((_req, res) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                message: "Sanity Check",
            }),
        );
    });
};
