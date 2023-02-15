import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TrackingCoins {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coin: string;
}