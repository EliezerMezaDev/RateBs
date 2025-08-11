import { load } from "cheerio";
import puppeteer from "puppeteer";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const BINANCE_P2P_URL = config.binanceP2pUrl;
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(BINANCE_P2P_URL, { waitUntil: "networkidle2" });

    await page.waitForSelector(".headline5.text-primaryText", {
      timeout: 10000,
    });

    const html = await page.content();

    const $ = load(html);
    const prices: number[] = [];
    const priceElements = $(".headline5.text-primaryText");

    if (priceElements.length === 0) {
      throw new Error(
        "El selector de Binance P2P no encontró precios después de cargar la página."
      );
    }

    priceElements.slice(0, 5).each((i, element) => {
      const priceNumber = parseFloat($(element).text());
      if (!isNaN(priceNumber)) prices.push(priceNumber);
    });

    if (prices.length === 0) {
      throw new Error("No se pudo parsear ningún precio válido.");
    }

    const averagePrice = prices.reduce((a, b) => a + b, 0) / prices.length;

    return {
      source: "binance",
      name: "Binance P2P",
      rate: averagePrice,
      lastUpdate: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Error al scrapear Binance con Puppeteer:", error.message);

    throw createError({
      statusCode: 500,
      statusMessage: "Fallo al obtener tasa de Binance P2P",
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});
