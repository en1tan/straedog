const http = require("axios").default;
const TelegramBot = require("node-telegram-bot-api");

class StraeDog {
  token = process.env.TOKEN ? process.env.TOKEN : "";
  bot = new TelegramBot(this.token);
  movieApiUrl = "https://straedog-movie-server.herokuapp.com";
  devUrl = "http://localhost:8000";

  startBot() {
    this.bot.startPolling();
    this.configureCommands();
  }

  configureCommands() {
    this.getHelp();
    this.requestLink();
  }

  start() {
    this.bot.on("message", (msg) => {
      const chatId = msg.chat.id;
      if (message === "/start") {
        this.bot.sendMessage(
          chatId,
          "Welcome to StraeDog Bot. \n Available Command /request <movie name>",
          {
            reply_to_message_id: msg.message_id,
          }
        );
      }
    });
  }

  getHelp() {
    this.bot.onText(/\/help/, (msg, match) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        "Available Command \n /request <Title> - Get movie download link",
        {
          reply_to_message_id: msg.message_id,
        }
      );
    });
  }

  async requestLink() {
    this.bot.onText(/\/request (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const name = match ? match[1] : "";
      const movieData = await this.getMovie(name);
      this.bot
        .sendPhoto(chatId, `${movieData.poster}`, {
          reply_to_message_id: msg.message_id,
        })
        .then((response) => {
          console.log(movieData);
          this.bot.sendMessage(
            chatId,
            `<b>${movieData.title}</b> \n <i>${movieData.genre}</i>
		 \n ${movieData.link}`,
            {
              reply_to_message_id: response.message_id,
              parse_mode: "html",
            }
          );
        });
    });
  }

  async getMovie(name) {
    try {
      const response = await http.post(`${this.movieApiUrl}/get`, {
        name: name,
      });
      return response.data.data;
    } catch (err) {
      return err;
      console.error(err);
    }
  }
}

module.exports = StraeDog;
