import "reflect-metadata";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from "typeorm";
import { Ads } from "./ads";

@Entity("users")
@Index("idx_users_username", ["username"], { unique: true })
@Index("idx_users_email", ["email"], { unique: true })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id!: number;

  @Column("varchar", { name: "username", length: 50 })
  username!: string;

  @Column("varchar", { name: "display_name", length: 100, nullable: true })
  displayName!: string | null;

  @Column("varchar", { name: "email", length: 100 })
  email!: string;

  @Column("varchar", { name: "password_hash", length: 255 })
  passwordHash!: string;

  @Column("varchar", {
    name: "avatar_url",
    length: 255,
    nullable: true,
  })
  avatarUrl!: string | null;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @OneToMany(() => Ads, (ads) => ads.user)
  ads!: Ads[];
}