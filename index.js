import PATH from "path";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";

export const PR = PATH.resolve;
export const ROOT = PR(import.meta.dirname);
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const EXPRESS_HOST = "127.0.0.1";
export const EXPRESS_PORT = 9494;

{
    const ctx = await esbuild.context({
        entryPoints: [PR(ROOT, "client", "App.js")],
        outfile: PR(ROOT, "public", "bundle.js"),
        bundle: true,
        minify: IS_PRODUCTION,
        plugins: [esbuildSvelte()],
        external: ["./assets/*"],
        logLevel: "info"
    });

    !IS_PRODUCTION && (await ctx.watch());
}

import("./server/index.js");

/* VM */
/* import FSP from "fs/promises";
import CHILD_PROCESS from "child_process";

const TIMEOUT = 1000;

const clients = ["client1.js", "client2.js", "client3.js"];

const results = await Promise.all(
    clients.map(async (client) => {
        const result = await new Promise((resolve, reject) => {
            const signal = new AbortController();
            const timer = setTimeout(() => signal.abort("TIMEOUT"), TIMEOUT);

            const p = CHILD_PROCESS.spawn("node", [client], { signal: signal.signal });

            const chunks = [];
            p.stdout.on("data", (chunk) => chunks.push(chunk));

            p.on("error", (e) => {
                clearTimeout(timer);
                reject({ error: [e.cause] });
            });

            p.on("exit", (code, signal) => {
                let json;

                try {
                    json = JSON.parse(chunks.join("").trim());
                } catch (e) {
                    reject({ error: ["RESPONSE_MUST_BE_JSON"] });
                }

                resolve(json);
            });
        }).catch((e) => ({ error: [e] }));

        return { client, result };
    })
);

console.log("Results", JSON.stringify(results, null, 2)); */
