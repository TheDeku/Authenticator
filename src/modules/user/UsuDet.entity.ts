import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuario } from "./Usuario.entity";

@Index("USU_DET__IDX", ["usuarioId"], { unique: true })
@Entity("usu_det", { schema: "portafolio" })
export class UsuDet {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("varchar", { name: "NOMBRE", nullable: true, length: 30 })
  nombre: string | null;

  @Column("varchar", { name: "APELLIDO", nullable: true, length: 30 })
  apellido: string | null;

  @Column("varchar", { name: "IMAGEN", nullable: true, length: 100 })
  imagen: string | null;

  @Column("varchar", { name: "TELEFONO", nullable: true, length: 30 })
  telefono: string | null;

  @Column("varchar", { name: "DIRECCIÓN", nullable: true, length: 30 })
  direcciN: string | null;

  @Column("varchar", { name: "CIUDAD", nullable: true, length: 30 })
  ciudad: string | null;

  @Column("varchar", { name: "COMUNA", nullable: true, length: 30 })
  comuna: string | null;

  @Column("int", { name: "USUARIO_ID", nullable: true, unique: true })
  usuarioId: number | null;

  @OneToOne(() => Usuario, (usuario) => usuario.usuDet, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "USUARIO_ID", referencedColumnName: "id" }])
  usuario2: Usuario;

  @OneToOne(() => Usuario, (usuario) => usuario.usuDet2)
  usuario: Usuario;
}
