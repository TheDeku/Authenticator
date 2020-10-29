import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Usuario } from "../user/Usuario.entity";


@Entity("rol", { schema: "portafolio" })
export class Rol extends BaseEntity{
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "NOMBRE", nullable: true, length: 30 })
  nombre: string | null;

  @Column("varchar", { name: "DESCRIPCION", nullable: true, length: 100 })
  descripcion: string | null;

  @ManyToMany(type => Usuario, usuario => usuario.roles)
  @JoinColumn()
  usuarios: Usuario[];

  @Column({ type: 'varchar', default: 'ACTIVE', length: 30 })
  status: string;
}

