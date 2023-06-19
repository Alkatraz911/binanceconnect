
import fetch from "node-fetch";
import "reflect-metadata";
import * as dotenv from "dotenv";
dotenv.config();
import fs from 'fs'

import { DataSource } from "typeorm";
import { AggTrade } from "./models/AggTrades.js";
import { Delta } from "./models/Delta.js";
import { TrackingCoins } from "./models/TrackingCoins.js"
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
  .values({coin: coin})
  .execute()
}

const readTrackingCoins = async (datasourse: DataSource) => {
  return await datasourse.manager
  .createQueryBuilder()
  .select("tracking_coins.coin")
  .from(TrackingCoins, "tracking_coins")
  .getMany()
}

const checkTrackingCoins = async (datasourse : DataSource, coin :string) => {
  let result = await datasourse.manager
  .createQueryBuilder()
  .select("tracking_coins.coin")
  .from(TrackingCoins, "tracking_coins")
  .where("tracking_coins.coin = :coin", {coin: coin})
  .getOne()
  if(result) {
    return true
  } else {
    return false
  }
}




AppDataSource.initialize()
  .then(async () => {

    let marketBuy = 0;
    let limitBuy = 0;
    let timecounter = 100;
    let date = '';

    const countDelta = (isMarket:boolean, quantity:number, price) => {
      isMarket ? (marketBuy += quantity * price) : (limitBuy += quantity * price);
    };

    const getDelta = async (el:addTradesresp, coin: string) => {

      let ts = Number(el.T)
      let hours = new Date(ts).getHours();
      
      
        if (timecounter === 100) {
          timecounter = hours;
          date = new Date(ts).toLocaleDateString()
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
              delta: marketBuy - limitBuy,
              ts: el.T
            })
            .execute();

            marketBuy = 0;
            limitBuy = 0;
            timecounter = hours;
            date = new Date(ts).toLocaleDateString()
            countDelta(el.m, Number(el.q), Number(el.p));
          }
        }
    }

    const loader = (coin: string) => {
      setInterval(() => {
        load(coin).then(
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
            await getDelta(el, coin);
            }
          },
          (err) => {
            fs.writeFileSync("log.txt", new Date().toLocaleDateString() + ' ' + err.message);
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
        if (await checkApi(coin) && ! await checkTrackingCoins(AppDataSource, coin)) {
          loader(coin);
          trackCoin(AppDataSource, coin);
          await ctx.reply(`Now ${coin} is tracking`);
        } else if(! await checkApi(coin)) {
          await ctx.reply(`Enter right coin please`);
        } else {
          await ctx.reply(`Coin is tracked already`);
        }
      });
      
      bot.launch();
    }

    const coins = await readTrackingCoins(AppDataSource)
    coins.forEach(el=>{
      loader(el.coin)
    })
 
    // here you can start to work with your database
  })
  .catch((error) => console.log(error));
