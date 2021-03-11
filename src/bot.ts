import * as axios from 'axios';
import * as TelegramBot from "node-telegram-bot-api";

interface IMovieData {
  title: string;
  poster: string;
  type: string;
  genre: string;
  link: String;
};

class StraeDog {
  token = process.env.TOKEN ? process.env.TOKEN : "";
  bot: TelegramBot = new TelegramBot(this.token);
  movieApiUrl = 'https://straedog-movie-server.herokuapp.com';
  devUrl = 'http://localhost:8000'
  movieData!: IMovieData;
  http = axios.default;

  startBot() {
    this.bot.startPolling();
    this.configureCommands();
  }

  configureCommands() {
    this.getHelp();
    this.requestLink();
  }

  getHelp() {
    this.bot.onText(/\/help/, (msg, match) => {
      const chatId = msg.chat.id;
      this.bot.sendMessage(chatId, "Available Command \n /request <Title> - Get movie download link", {
        reply_to_message_id: msg.message_id,
      });
    });
  }
  // TODO: Create Series Request
  async requestLink() {
    this.bot.onText(/\/request (.+)/, async (msg, match) => {
      const chatId = msg.chat.id;
      const name = match ? match[1] : "";
      this.movieData = await this.getMovie(name);
      this.bot.sendPhoto(chatId, `${this.movieData.poster}`, {
        reply_to_message_id: msg.message_id
      }).then((response) => {
        this.bot.sendMessage(chatId, `*${this.movieData.title}* \n _${this.movieData.genre}_ \n ${this.movieData.link}`, {
          reply_to_message_id: response.message_id,
          parse_mode: 'Markdown'
        })
      })
    });
  }

  async getMovie(name: string) {
    try {
      const response = await this.http.post(`${this.movieApiUrl}/get`, { name: name });
      return response.data.data
    } catch (err) {
      return err;
      console.error(err);
    }
  }
}

export default StraeDog;
