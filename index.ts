import fetch from "node-fetch";
import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import fs from "fs";

import { DataSource } from "typeorm";
import { AggTrade } from "./models/AggTrades.js";
import { Delta } from "./models/Delta.js";
import { TrackingCoins } from "./models/TrackingCoins.js";
import { createBot } from "./bot.js";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: "postgres",
  password: "admin",
  database: "binancescaner",
  entities: [AggTrade, Delta, TrackingCoins],
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

async function load(coin: string, fromId?: number) {
  let url: string;
  if(fromId) {
      url = `https://data.binance.com/api/v3/aggTrades?symbol=${coin}USDT&fromId=${fromId}&limit=500`;
  } else {
    url = `https://data.binance.com/api/v3/aggTrades?symbol=${coin}USDT&limit=500`;
  }
  
  let result = await fetch(url);
  if (result.ok) {
    let response = await result.json();
    return response;
  } else {
    throw new Error(result.statusText);
  }
}

const checkApi = async (coin: string) => {
  let url = `https://data.binance.com/api/v3/aggTrades?symbol=${coin}USDT&limit=400`;
  let response = await fetch(url);
  if (response.ok) {
    return true;
  } else {
    return false;
  }
};

const trackCoin = async (datasourse: DataSource, coin: string) => {
  await datasourse.manager
    .createQueryBuilder()
    .insert()
    .into(TrackingCoins)
    .values({ coin: coin })
    .execute();
};

const readTrackingCoins = async (datasourse: DataSource) => {
  return await datasourse.manager
    .createQueryBuilder()
    .select("tracking_coins.coin")
    .from(TrackingCoins, "tracking_coins")
    .getMany();
};

const checkTrackingCoins = async (datasourse: DataSource, coin: string) => {
  let result = await datasourse.manager
    .createQueryBuilder()
    .select("tracking_coins.coin")
    .from(TrackingCoins, "tracking_coins")
    .where("tracking_coins.coin = :coin", { coin: coin })
    .getOne();
  if (result) {
    return true;
  } else {
    return false;
  }
};

AppDataSource.initialize()
  .then(async () => {
    let purchases = 0;
    let sells = 0;
    let timecounter = 100;
    

    const countDelta = (
      isMaker: boolean,
      quantity: number,
      price: number
    ) => {
      if (isMaker) {
        sells += quantity * price;
      } else {
        purchases += quantity * price;
      }
    };

    const getDelta = async (el: addTradesresp, coin: string) => {
      let ts = Number(el.T);
      let hours = new Date(ts).getHours();

      if (timecounter === 100) {
        timecounter = hours;
        
        countDelta(el.m, Number(el.q), Number(el.p));
      } else {
        if (timecounter === hours) {
          countDelta(el.m, Number(el.q), Number(el.p));
        } else {
          await AppDataSource.manager
            .createQueryBuilder()
            .insert()
            .into(Delta)
            .values({
              coin: coin,
              delta: sells - purchases,
              ts: el.T,
            })
            .execute();

          purchases = 0;
          sells = 0;
          timecounter = hours;

          countDelta(el.m, Number(el.q), Number(el.p));
        }
      }
    };

    const loader = (coin: string) => {
      let fromId :undefined | number;
      setInterval(() => {
        load(coin, fromId).then(
          async (data: any) => {
            for (const el of data) {
              //   const trade = await AppDataSource.manager
              //   .createQueryBuilder(AggTrade, "agg_trade")
              //   .where("agg_trade.id = :id", { id: el.a })
              //   .getOne();
              // if (trade) {
              //   return;

              // } else {

              //   await AppDataSource.manager
              //     .createQueryBuilder()
              //     .insert()
              //     .into(AggTrade)
              //     .values({
              //       id: el.a,
              //       name: `${coin}-USDT`,
              //       price: el.p,
              //       quantity: el.q,
              //       timeMachine: el.T,
              //       time: new Date(el.T).toLocaleString(),
              //       isBuyer: el.m,
              //       isBest: el.M,
              //     })
              //     .execute();
              // }
              fromId = el.a
              await getDelta(el, coin);
            }
          },
          (err) => {
            fs.writeFileSync(
              "log.txt",
              new Date().toLocaleDateString() + " " + err.message
            );
            console.log(err);
          }
        );
      }, 15000);
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
        let coin = ctx.message.text.toLocaleUpperCase();
        if (
          (await checkApi(coin)) &&
          !(await checkTrackingCoins(AppDataSource, coin))
        ) {
          loader(coin);
          trackCoin(AppDataSource, coin);
          await ctx.reply(`Now ${coin} is tracking`);
        } else if (!(await checkApi(coin))) {
          await ctx.reply(`Enter right coin please`);
        } else {
          await ctx.reply(`Coin is tracked already`);
        }
      });

      bot.launch();
    }

    const coins = await readTrackingCoins(AppDataSource);
    coins.forEach((el) => {
      loader(el.coin);
    });

    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
