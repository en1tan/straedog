const TelegramBot = require("node-telegram-bot-api");
const dotenv = require("dotenv");
dotenv.config();
// Add token
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { webHook: true });

bot.setWebHook(`https://straedog.herokuapp.com/${token}`);
bot.openWebHook().then((response) => {
  console.log("Running");
});

bot.onText(/\/help/, (msg, match) => {
  console.log(match);
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Available Commands \n /series <Series Title> - Get series\n /movie <Movie Title> - Get Title",
    {
      reply_to_message_id: msg.message_id,
    }
  );
});

bot.onText(/\/series (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const adminStatus = bot.getChatMember(chatId, msg.from.id);
  console.log(adminStatus.user);
  const title = getSeries(match[1]);
  bot.sendMessage(chatId, `/${title} coming up...`, {
    reply_to_message_id: msg.message_id,
  });
});

bot.onText(/\/movie (.+)/, (msg, match) => {
  const title = getMovies(match[1]);
  bot
    .sendMessage(chatId, `${title} coming up...`, {
      reply_to_message_id: msg.message_id,
    })
    .then((response) => {
      bot.sendMessage(chatId, "New Request", {});
    });
});

const getSeries = (title) => {
  console.log(`You requested for series: ${title}`);
  return title;
};

const getMovies = (title) => {
  console.log(`You requested for movie: ${title}`);
  return title;
};

module.exports = bot;
