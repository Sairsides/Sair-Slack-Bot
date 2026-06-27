require('dotenv').config({ path: 'tokens.env' });

const axios = require("axios");
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/sairbot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();

app.command("/sairbot-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {

    await respond({ text: "⚠️ The cat fact service is temporarily offline. Please try again later." });
  }
});

app.command("/sairbot-rps", async ({ command, ack, respond }) => {
  await ack();

  try {
    const userChoice = command.text.trim().toLowerCase();
    const validChoices = ["rock", "paper", "scissors"];

    if (!userChoice || !validChoices.includes(userChoice)) {
      await respond({ text: "❌ Invalid choice! Please type rock, paper, or scissors after the command." });
      return;
    }

    const botChoice = validChoices[Math.floor(Math.random() * validChoices.length)];

    let result = "";
    if (userChoice === botChoice) {
      result = "👔 It's a tie game!";
    } else if (
      (userChoice === "rock" && botChoice === "scissors") ||
      (userChoice === "paper" && botChoice === "rock") ||
      (userChoice === "scissors" && botChoice === "paper")
    ) {
      result = "🏆 You win!";
    } else {
      result = "🤖 SairBot wins!";
    }

    await respond({
      text: `${result} | 🎮 Match Result -> Your Choice: ${userChoice.toUpperCase()} | SairBot: ${botChoice.toUpperCase()}`
    });

  } catch (err) {
    await respond({ text: "⚠️ An error occurred while calculating the game results. Please try again." });
  }
});
