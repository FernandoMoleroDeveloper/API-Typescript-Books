/* eslint-disable @typescript-eslint/indent */
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Course } from "./Course";

@Entity()
export class Students {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @ManyToOne((type) => Course, (course) => course.students)
  course: Course;
}
