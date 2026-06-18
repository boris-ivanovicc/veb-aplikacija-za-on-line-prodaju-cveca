import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";

import { Ads } from "./ads";

@Entity("ad_images")
@Index("fk_images_ads", ["adId"])
export class AdImages {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id!: number;

  @Column("int", { name: "ad_id" })
  adId!: number;

  @Column("mediumtext", { name: "original_url" })
  originalUrl!: string;

  @Column("mediumtext", { name: "thumbnail_url" })
  thumbnailUrl!: string;

  @Column("boolean", { name: "is_cover", default: false, nullable: true })
  isCover!: boolean | null;

  @Column("enum", {
    name: "file_type",
    enum: ["image/jpeg", "image/png"],
  })
  fileType!: "image/jpeg" | "image/png";

  @ManyToOne(() => Ads, (ads: Ads) => ads.images, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ad_id" })
  ad!: Ads;
}