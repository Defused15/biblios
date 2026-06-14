import { ProxyAgent, fetch as undiciFetch } from 'undici';

const proxyUrl = "http://b553817b9f1a6c4d7661:ab73cb5cce52c877@gw.dataimpulse.com:823";
const targetUrl = "http://libgen.is/search.php?req=harry";

async function run() {
  try {
    // Try global fetch with dispatcher
    const dispatcher = new ProxyAgent(proxyUrl);
    const res = await fetch(targetUrl, { dispatcher });
    const text = await res.text();
    console.log("Global fetch:", text);
  } catch (e) {
    console.error("Global fetch error:", e.message);
  }

  try {
    // Try undici fetch with dispatcher
    const dispatcher = new ProxyAgent(proxyUrl);
    const res = await undiciFetch(targetUrl, { dispatcher });
    const text = await res.text();
    console.log("Undici fetch:", text);
  } catch (e) {
    console.error("Undici fetch error:", e.message, e.cause);
  }
}

run();
