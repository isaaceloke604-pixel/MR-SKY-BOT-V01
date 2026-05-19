import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";

console.log("STARTING BOT...");

async function startBot() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState("./session");

        const sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: pino({ level: "debug" })
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", (update) => {
            console.log("CONNECTION UPDATE:", update);
        });

        sock.ev.on("close", () => {
            console.log("BOT CLOSED ❌");
        });

        sock.ev.on("messages.upsert", async ({ messages }) => {
            const msg = messages[0];
            if (!msg.message) return;

            const text =
                msg.message.conversation ||
                msg.message.extendedTextMessage?.text;

            const from = msg.key.remoteJid;

            console.log("MESSAGE:", text);

            if (text === ".ping") {
                await sock.sendMessage(from, { text: "🏓 SKY BOT OK" });
            }
        });

        console.log("BOT STARTED 🚀");
    } catch (err) {
        console.log("ERROR CAUGHT:", err);
    }
}

startBot();
