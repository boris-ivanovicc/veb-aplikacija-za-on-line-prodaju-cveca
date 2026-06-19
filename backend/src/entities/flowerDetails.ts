import "reflect-metadata";
import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Ads } from "./ads";

@Entity("flower_details")
@Index("idx_flower_details_flower_name", ["flowerName"])
@Index("idx_flower_details_occasion", ["occasion"])
export class FlowerDetails {
  @PrimaryColumn({ type: "int", name: "ad_id", unsigned: true })
  adId!: number;

  @Column("varchar", { name: "flower_name", length: 100 })
  flowerName!: string;

  @Column("decimal", {
    name: "size_cm",
    precision: 8,
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

  @Column("tinyint", { 
    name: "is_potted", 
    nullable: true, 
    default: 0 
  })
  isPotted!: number | null;

  @OneToOne(() => Ads, (ads) => ads.flowerDetail, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ad_id" })
  ad!: Ads;
}