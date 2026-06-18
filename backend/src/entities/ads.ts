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
@Index("fk_ads_users", ["userId"])
export class Ads {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id!: number;

  @Column("int", { name: "user_id" })
  userId!: number;

  @Column("varchar", { name: "title", length: 100 })
  title!: string;

  @Column("text", { name: "ad_description", nullable: true })
  adDescription!: string | null;

  @Column("decimal", { name: "price", precision: 10, scale: 2 })
  price!: number;

  @Column("enum", {
    name: "ad_status",
    enum: ["active", "sold", "expired", "deleted"],
    default: "active",
  })
  adStatus!: "active" | "sold" | "expired" | "deleted";

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column("timestamp", { name: "ends_at", nullable: true })
  endsAt!: Date | null;

  @ManyToOne(() => Users, (users: Users) => users.ads, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: Users;

  @OneToMany(() => AdImages, (adImages: AdImages) => adImages.ad)
  images!: AdImages[];

  @OneToOne(() => FlowerDetails, (details: FlowerDetails) => details.ad)
  flowerDetails!: FlowerDetails;
}