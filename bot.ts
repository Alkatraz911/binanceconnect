import { Telegraf } from "telegraf";

export const createBot = (token: string) => {
  if (token) {
    return new Telegraf(token);
  } 
};


