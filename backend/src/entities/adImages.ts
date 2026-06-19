import "reflect-metadata";
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
@Index("idx_ad_images_ad_id", ["adId"])
@Index("idx_ad_images_is_cover", ["isCover"])
export class AdImages {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id!: number;

  @Column("int", { name: "ad_id", unsigned: true })
  adId!: number;

  @Column("mediumtext", { name: "original_url" })
  originalUrl!: string;

  @Column("mediumtext", { name: "thumbnail_url" })
  thumbnailUrl!: string;

  @Column("tinyint", { 
    name: "is_cover", 
    nullable: true, 
    default: 0 
  })
  isCover!: number | null;

  @Column("enum", {
    name: "file_type",
    enum: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  })
  fileType!: string;

  @ManyToOne(() => Ads, (ads) => ads.adImages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "ad_id" })
  ad!: Ads;
}