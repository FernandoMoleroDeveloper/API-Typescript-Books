import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";
import { Course } from "../models/typeorm/Course";

const courseRepository: Repository<Course> = AppDataSource.getRepository(Course);
// Router
export const courseRouter = Router();

courseRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const courses: Course[] = await courseRepository.find({ relations: ["students"] });
    res.json({ data: courses });
  } catch (error) {
    next(error);
  }
});

courseRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const courses = await courseRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["students"],
    });
    if (!courses) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.json(courses);
    }
  } catch (error) {
    next(error);
  }
});

courseRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newStudent = new Course();

    Object.assign(newStudent, ...req.body);
    const courseSaved = await courseRepository.save(newStudent);
    res.status(201).json(courseSaved);
  } catch (error) {
    next(error);
  }
});

courseRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const coursesToRemove = await courseRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["students"],
    });
    if (!coursesToRemove) {
      res.status(404).json({ error: "Student not found" });
    } else {
      await courseRepository.remove(coursesToRemove);
      res.json(coursesToRemove);
    }
  } catch (error) {
    next(error);
  }
});

courseRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);
    const coursesToUpdate = await courseRepository.findOneBy({
      id: idReceivedInParams,
    });
    if (!coursesToUpdate) {
      res.status(404).json({ error: "Student not found" });
    } else {
      Object.assign(coursesToUpdate, ...req.body);
      await courseRepository.save(coursesToUpdate);
      res.json(coursesToUpdate);
    }
  } catch (error) {
    next(error);
  }
});
