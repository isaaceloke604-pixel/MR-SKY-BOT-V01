import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";
import pino from "pino";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

        const from = msg.key.remoteJid;

        if (!text) return;

        if (text === ".menu") {
            await sock.sendMessage(from, {
                text: "🤖 MR SKY BOT MENU\n.ping\n.menu\n.alive"
            });
        }

        if (text === ".ping") {
            await sock.sendMessage(from, {
                text: "🏓 MR SKY BOT ONLINE"
            });
        }

        if (text === ".alive") {
            await sock.sendMessage(from, {
                text: "✅ BOT IS RUNNING"
            });
        }
    });

    console.log("MR SKY BOT STARTED 🚀");
}

startBot();
