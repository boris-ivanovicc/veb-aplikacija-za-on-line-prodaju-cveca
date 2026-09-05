import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from "typeorm";
import { Users } from "./users";
import { AdImages } from "./adImages";
import { FlowerDetails } from "./flowerDetails";

@Entity("ads")
@Index("idx_ads_user_id", ["userId"])
@Index("idx_ads_status", ["adStatus"])
@Index("idx_ads_created_at", ["createdAt"])
  @Index("idx_ads_location", ["location"])
export class Ads {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id!: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId!: number;

  @Column("varchar", { name: "title", length: 100 })
  title!: string;

  @Column("text", { name: "ad_description", nullable: true })
  adDescription!: string | null;

  @Column("decimal", { 
    name: "price", 
    precision: 10, 
    scale: 2,
    nullable: false 
  })
  price!: number;

  @Column("enum", {
    name: "ad_status",
    enum: ["active", "sold", "expired", "draft"],
    default: "active",
  })
  adStatus!: string;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column("timestamp", {
    name: "ends_at",
    nullable: true,
  })
  endsAt!: Date | null;

  @Column("varchar", {
    name: "location", 
    length: 100, 
    nullable: true 
  })
  location!: string | null;

  @ManyToOne(() => Users, (user) => user.ads, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: Users;

  @OneToMany(() => AdImages, (adImage) => adImage.ad)
  adImages!: AdImages[];

  @OneToOne(() => FlowerDetails, (flowerDetail) => flowerDetail.ad)
  flowerDetail!: FlowerDetails | null;
}