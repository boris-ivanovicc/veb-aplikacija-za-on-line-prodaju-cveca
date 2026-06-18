import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";

import { Ads } from "./ads";

@Entity("flower_details")
export class FlowerDetails {
  @PrimaryColumn({ type: "int", name: "ad_id" })
  adId!: number;

  @Column("varchar", { name: "flower_name", length: 100 })
  flowerName!: string;

  @Column("decimal", {
    name: "size_cm",
    precision: 5,
    scale: 2,
    nullable: true,
  })
  sizeCm!: number | null;

  @Column("varchar", { name: "origin", length: 100, nullable: true })
  origin!: string | null;

  @Column("int", { name: "lifespan_days", nullable: true })
  lifespanDays!: number | null;

  @Column("varchar", { name: "occasion", length: 100, nullable: true })
  occasion!: string | null;

  @Column("boolean", { name: "is_potted", default: false, nullable: true })
  isPotted!: boolean | null;

  @OneToOne(() => Ads, (ads: Ads) => ads.flowerDetails, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "ad_id" })
  ad!: Ads;
}