import express from "express";
import { sqlQuery } from "../databases/sql-db";
import { type Request, type Response, type NextFunction } from "express";
import { type TechnologyCompaniesBody } from "../models/sql/TechnologyCompanies";
// Router propio de usuarios

export const companiesRouter = express.Router();

// CRUD: READ
companiesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Así leemos query params
    const rows = await sqlQuery(`
    SELECT *
    FROM technology_companies
    `);
    const response = { data: rows };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

companiesRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const rows = await sqlQuery(`
    SELECT *
    FROM technology_companies
    WHERE id=${id}
    `);
    if (rows?.[0]) {
      const response = { data: rows };
      res.json(response);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
// Endpoint de creación

companiesRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, foundedYear, employesNumber, headquarters, ceo } = req.body as TechnologyCompaniesBody;

    const query: string = `
    INSERT INTO technology_companies (name, founded_year, employes_number, headquarters, ceo)
    VALUES (${name},${foundedYear},${employesNumber},${headquarters},${ceo})
    `;
    const params = [name, foundedYear, employesNumber, headquarters, ceo];

    const result = await sqlQuery(query, params);

    if (result) {
      return res.status(201).json({});
    } else {
      return res.status(500).json({ error: "CCompany not created" });
    }
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
// Endpoint para eliminar

companiesRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await sqlQuery(`
    DELETE FROM technology_companies
    WHERE id= ${id} 
    `);
    res.json({ message: "Company deleted!" });
  } catch (error) {
    next(error);
  }
});

// Endpoint update

companiesRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const { name, foundedYear, employesNumber, headquarters, ceo } = req.body as TechnologyCompaniesBody;
    const query = `
    UPDATE technology_companies
    SET name = ?, founded_year = ?, employes_number = ?, headquarters = ?, ceo = ?
    WHERE id = ?
    `;
    const params = [name, foundedYear, employesNumber, headquarters, ceo, id];
    await sqlQuery(query, params);

    const rows = await sqlQuery(`
    SELECT *
    FROM technology_companies
    WHERE id=${id}
    `);
    if (rows?.[0]) {
      const response = { data: rows?.[0] };
      res.json(response);
    } else {
      res.status(404).json({ error: "Company not found" });
    }
  } catch (error) {
    next(error);
  }
});
