const http = require("axios").default;
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");

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
    this.start();
  }

  start() {
    this.bot.onText(/\/start/, (msg, match) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(
        chatId,
        "Welcome to StraeDog Bot. \n Available Command /request <movie name>",
        {
          reply_to_message_id: msg.message_id,
        }
      );
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
      const movieData = await this.processData(
        await this.getMovie(name)
      );
      this.bot
        .sendPhoto(chatId, movieData.poster, {
          reply_to_message_id: msg.message_id,
        })
        .then((response) => {
          this.bot.sendMessage(chatId, movieData.result, {
            reply_to_message_id: response.message_id,
            parse_mode: "html",
          });
        });
    });
  }

  async getMovie(name) {
    try {
      const response = await http.get(`${this.movieApiUrl}/get`, {
        params: {
          name: name,
        },
      });
      return response.data.data;
    } catch (err) {
      return {
        statusCode: err.response.status,
        message: err.response.statusText,
      };
    }
  }

  async processData(response) {
    let result = "";
    if (response.statusCode !== 404) {
      const moviePoster = response.poster;
      result = `<b>Title: ${response.title}</b> \n <i>Genre: ${response.genre}</i> \n ${response.link}`;
      return { poster: moviePoster, result };
    } else {
      const moviePoster =
        "https://firebasestorage.googleapis.com/v0/b/straedogbot.appspot.com/o/404.png?alt=media&token=396a1c04-11d3-44e1-abee-c106c6c23928";
      result = `<b> I am sorry 😓</b> \n 
      Movie not added yet. But I have sent a request on your behalf \n 
      Be sure to check back`;
      return { poster: moviePoster, result };
    }
  }
}

module.exports = StraeDog;
