import { AppDataSource } from "../databases/typeorm-datasource";
import { Course } from "../models/typeorm/Course";
import { Students } from "../models/typeorm/Students";

export const studentAndCourseSeed = async (): Promise<void> => {
  const dataSource = await AppDataSource.initialize();
  console.log(`Tenemos conexion!! Conectado a ${dataSource?.options?.database as string}`);

  // Eliminamos los dato existentes
  await AppDataSource.manager.delete(Students, {});
  await AppDataSource.manager.delete(Course, {});
  console.log("Eliminados estudiantes existentes");
  // Creamos dos students
  const student1 = {
    name: "Juan",
    lastname: "Perez",
  };

  const student2 = {
    name: "Ana",
    lastname: "Lopez",
  };

  // Cereamos las entidades
  const student1Entity = AppDataSource.manager.create(Students, student1);
  const student2Entity = AppDataSource.manager.create(Students, student2);

  // Creamos cursos
  const course = {
    name: "Matematicas",
    department: "Numbers",
    students: [student1Entity, student2Entity],
  };
  // Creamos entidad curso
  const courseEntity = AppDataSource.manager.create(Course, course);

  // Guardamos el curso en base de datos
  await AppDataSource.manager.save(courseEntity);

  // Las guardamos en base de datos

  await AppDataSource.manager.save(student1Entity);
  await AppDataSource.manager.save(student2Entity);

  console.log("Guardados los estudiantes");

  // Cerramos la conexion
  await AppDataSource.destroy();
  console.log("Cerrada la conexion SQL");
};

void studentAndCourseSeed();
