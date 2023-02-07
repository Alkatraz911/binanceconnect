import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Delta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coin: string;
  @Column()
  date: string;
  @Column()
  hour: string;
  @Column({type: "float8"})
  delta: number;
  @Column({type: "timestamp"})
  ts: number;
}