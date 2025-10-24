// cards-generator by fy2ne
// GitHub: https://github.com/fy2ne/cards-generator
// If you like this project, please ⭐ it on GitHub! ❤️

import fetch from "node-fetch";
import readline from "readline";
import chalk from "chalk";
import gradient from "gradient-string";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const baseUrl = "https://backend.lambdatest.com/api/dev-tools/credit-card-generator?";
const cardTypes = {
  ax: "American%20Express",
  mc: "MasterCard",
  vi: "Visa",
  jc: "JCB"
};

function ask(question) {
  return new Promise(resolve => rl.question(chalk.cyanBright(question), ans => resolve(ans)));
}

(async function main() {
  console.clear();
  console.log(
    gradient.pastel.multiline(`
╔════════════════════════════════════╗
║       💳  CARDS GENERATOR 💳       ║
║           Made by fy2ne            ║
║                                    ║
║   ⭐ Star it if you like it! ⭐    ║
╚════════════════════════════════════╝
`)
  );

  console.log(chalk.yellowBright("Available card types:"));
  console.log(chalk.white(" ax ") + chalk.gray("= American Express"));
  console.log(chalk.white(" mc ") + chalk.gray("= MasterCard"));
  console.log(chalk.white(" vi ") + chalk.gray("= Visa"));
  console.log(chalk.white(" jc ") + chalk.gray("= JCB"));

  const typeInput = (await ask("\n👉 Enter card type (ax/mc/vi/jc): ")).trim().toLowerCase();
  const cardType = cardTypes[typeInput];
  if (!cardType) {
    console.log(chalk.redBright("❌ Invalid type. Exiting."));
    rl.close();
    return;
  }

  const rawCount = (await ask("👉 How many cards do you want? (1-100): ")).trim();
  const count = Number(rawCount);

  if (!Number.isInteger(count) || count <= 0) {
    console.log(chalk.redBright("❌ Please enter a valid integer greater than 0. Exiting."));
    rl.close();
    return;
  }

  const maxAllowed = 100;
  const finalCount = Math.min(count, maxAllowed);
  if (count > maxAllowed) {
    console.log(chalk.yellow(`⚠️ Requested ${count} but capped to ${maxAllowed}.`));
  }

  const url = `${baseUrl}type=${cardType}&no-of-cards=${finalCount}`;

  console.log(chalk.cyanBright("\n⏳ Fetching card info..."));

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    const cards = Array.isArray(data) ? data : [data];

    if (cards.length === 0) {
      console.log(chalk.yellow("⚠️ API returned no cards."));
    } else {
      console.log(chalk.greenBright(`\n✅ Got ${cards.length} card(s):`));
      cards.forEach((card, i) => {
        console.log(chalk.magentaBright(`\n--- Card #${i + 1} ---`));
        console.log(chalk.white(`Type:   `) + chalk.cyan(card.type ?? "N/A"));
        console.log(chalk.white(`Name:   `) + chalk.cyan(card.name ?? "N/A"));
        console.log(chalk.white(`Number: `) + chalk.greenBright(card.number ?? "N/A"));
        console.log(chalk.white(`CVV:    `) + chalk.yellow(card.cvv ?? "N/A"));
        console.log(chalk.white(`Expiry: `) + chalk.blueBright(card.expiry ?? "N/A"));
      });
    }

    console.log(chalk.gray("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.white("⭐ If you liked this tool, give it a star on:"));
    console.log(chalk.blueBright("👉 https://github.com/fy2ne/cards-generator-CLI"));
    console.log(chalk.gray("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
  } catch (err) {
    console.error(chalk.redBright("⚠️ Request failed:"), chalk.white(err.message));
  } finally {
    rl.close();
  }
})();
