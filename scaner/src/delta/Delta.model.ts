import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Delta {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  coin: string;
  @Column({type: "float8"})
  delta: number;
  @Column({type: "float8"})
  ts: number;
}