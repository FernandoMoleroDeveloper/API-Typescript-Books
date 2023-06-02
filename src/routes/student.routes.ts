import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";
import { Students } from "../models/typeorm/Students";
import { Course } from "../models/typeorm/Course";

const studentRepository: Repository<Students> = AppDataSource.getRepository(Students);
const courseRepository: Repository<Course> = AppDataSource.getRepository(Course);
// Router
export const studentRouter = Router();

studentRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const students: Students[] = await studentRepository.find({ relations: ["course"] });
    res.json({ data: students });
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const students = await studentRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["course"],
    });
    if (!students) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.json(students);
    }
  } catch (error) {
    next(error);
  }
});

studentRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newStudent = new Students();
    const courseOfStudent = await courseRepository.findOne(req.body.course);
    Object.assign(newStudent, {
      ...req.body,
      course: courseOfStudent,
    });
    const studentSaved = await studentRepository.save(newStudent);
    res.status(201).json(studentSaved);
  } catch (error) {
    next(error);
  }
});

studentRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const studentsToRemove = await studentRepository.findOneBy({
      id: idReceivedInParams,
    });
    if (!studentsToRemove) {
      res.status(404).json({ error: "Student not found" });
    } else {
      await studentRepository.remove(studentsToRemove);
      res.json(studentsToRemove);
    }
  } catch (error) {
    next(error);
  }
});

studentRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const studentsToUpdate = await studentRepository.findOneBy({
      id: idReceivedInParams,
    });
    if (!studentsToUpdate) {
      res.status(404).json({ error: "Student not found" });
    } else {
      Object.assign(studentsToUpdate, {
        name: req.body.name,
        lastname: req.body.lastname,
      });
      await studentRepository.save(studentsToUpdate);
      res.json(studentsToUpdate);
    }
  } catch (error) {
    next(error);
  }
});
