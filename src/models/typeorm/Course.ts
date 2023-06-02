/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Students } from "./Students";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  department: string;

  @OneToMany((type) => Students, (student) => student.course, { cascade: true })
  students: Students[];
}
