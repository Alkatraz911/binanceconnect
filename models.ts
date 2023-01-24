import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class AggTrade {
  @PrimaryColumn({ type: "bigint" })
  id: number;
  @Column()
  name: string;
  @Column()
  price: string;
  @Column()
  quantity: string;
  @Column({ type: "bigint" })
  timeMachine: number;
  @Column()
  time: string;
  @Column()
  isBuyer: boolean;
  @Column()
  isBest: boolean;
}
