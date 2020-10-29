import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Rol } from "../role/Rol.entity";

import { UsuDet } from "./UsuDet.entity";

@Index("USUARIO__IDX", ["usuDetId"], { unique: true })
@Entity("usuario", { schema: "portafolio" })
export class Usuario extends BaseEntity{
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "USERNAME", nullable: true, length: 30 })
  username: string | null;

  @Column("varchar", { name: "EMAIL", nullable: true, length: 30 })
  email: string | null;

  @Column("varchar", { name: "PASSWORD", nullable: true, length: 250 })
  password: string | null;

  @Column("int", { name: "USU_DET_ID", nullable: true, unique: true })
  usuDetId: number | null;

  @OneToOne(() => UsuDet, (usuDet) => usuDet.usuario2)
  usuDet: UsuDet;

  @ManyToMany(type => Rol, rol => rol.usuarios, { eager: true })
  @JoinTable({ name: 'usu_rol' ,joinColumn: {
          name: "USUARIO_ID",
          referencedColumnName: "id"
      },
      inverseJoinColumn: {
          name: "ROL_ID",
          referencedColumnName: "id"
      }})
  roles: Rol[];

  @OneToOne(() => UsuDet, (usuDet) => usuDet.usuario, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "USU_DET_ID", referencedColumnName: "id" }])
  usuDet2: UsuDet;

  @Column({ type: 'varchar', default: 'ACTIVE', length: 30 })
  status: string;

  @Column({ type: 'int', nullable: true })
  restore: number;
}
