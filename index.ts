import fetch from "node-fetch";
import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();

import { DataSource } from "typeorm";
import { AggTrade } from "./models/AggTrades.js";
import { Delta } from "./models/Delta.js";
import { createBot } from "./bot.js";


const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: "postgres",
  password: "admin",
  database: "binancescaner",
  entities: [AggTrade, Delta],
  synchronize: true,
  logging: false,
});

interface addTradesresp {
  a: number;
  name?: string;
  p: string;
  q: string;
  f: number;
  l: number;
  T: number;
  m: boolean;
  M: boolean;
}

async function load(coin: string) {
  let url =  `https://data.binance.com/api/v3/aggTrades?symbol=${coin}USDT&limit=400`;
  let result = await fetch(url);
  if (result.ok) {
    let response = await result.json();
    return response;
  } else {
    throw new Error(result.statusText);
  }
}

const checkCoin = async (coin: string) => {
  let url = `https://data.binance.com/api/v3/aggTrades?symbol=${coin}USDT&limit=400`;
  let response = await fetch(url);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
};


let marketBuy = 0;
let limitBuy = 0;
let timecounter = 100;


const countDelta = (isMarket:boolean, quantity:number) => {
  isMarket ? (marketBuy += quantity) : (limitBuy += quantity);
};

AppDataSource.initialize()
  .then(() => {

    const getDelta = async (el:addTradesresp, coin: string) => {

      let ts = Number(el.T)
      let hours = new Date(ts).getHours();
      
        if (timecounter === 100) {
          timecounter = hours;
          countDelta(el.m, Number(el.q));
        } else {
          if (timecounter === hours) {
            countDelta(el.m, Number(el.q));
          } else {
            await AppDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(Delta)
            .values({
              coin: coin,
              date: new Date(el.T).toLocaleDateString(),
              hour: `${timecounter}H`,
              delta: marketBuy - limitBuy,
            })
            .execute();

            marketBuy = 0;
            limitBuy = 0;
            timecounter = hours;
            countDelta(el.m, Number(el.q));
          }
        }
    }

    const loader = (coin: string) => {
      setInterval(() => {
        load(coin).then(
          async (data: any) => {
            for (const el of data) {
              const trade = await AppDataSource.manager
              .createQueryBuilder(AggTrade, "agg_trade")
              .where("agg_trade.id = :id", { id: el.a })
              .getOne();
            if (trade) {
              return;

            } else {
              await getDelta(el, coin)
              await AppDataSource.manager
                .createQueryBuilder()
                .insert()
                .into(AggTrade)
                .values({
                  id: el.a,
                  name: `${coin}-USDT`,
                  price: el.p,
                  quantity: el.q,
                  timeMachine: el.T,
                  time: new Date(el.T).toLocaleString(),
                  isBuyer: el.m,
                  isBest: el.M,
                })
                .execute();
            }
            }
          },
          (err) => {
            console.log(err);
          }
        );
      }, 60000);
    };


    
    const token = process.env.BOT_TOKEN ? process.env.BOT_TOKEN : "";

    const bot = createBot(token);

    if (bot) {
      bot.command("start", async (ctx) => {
        await ctx.reply(
          `Please enter coin ticker you want to track. Example: If you want to track Bitcoin enter BTC`
        );
      });

      bot.on("text", async (ctx) => {
        let coin = ctx.message.text.toLocaleUpperCase()
        if (await checkCoin(coin)) {
          loader(coin);
          await ctx.reply(`Now ${coin} is tracking`);
        } else {
          await ctx.reply(`Enter right coin please`);
        }
      });

      bot.launch();
    }

    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
