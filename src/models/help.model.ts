import db from "../config/db";
import { Help } from "../interface/interface";
import { executeQuery } from "../utils/helper";

export const saveHelp = async (help: Help) => {
  if (help.id) {
    const sql =
      "UPDATE help_and_support SET question = ?, answer = ?, status = ? , support_for = ? WHERE id = ?";
    const params = [
      help.question,
      help.answer,
      help.status || "active",
      help.support_for,
      help.id,
    ];
    return await executeQuery(sql, params);
  } else {
    const sql =
      "INSERT INTO help_and_support (question, answer, status , support_for) VALUES (?, ?, ? , ?)";
    const params = [
      help.question,
      help.answer,
      help.status,
      help.support_for || "active",
    ];
    return await executeQuery(sql, params);
  }
};

export const getAllHelp = async (
  search?: string,
  status?: string,
  user_role?: string,
  page: number = 1,
  limit: number = 10,
) => {
  const pageNumber = page > 0 ? page : 1;
  const limitNumber = limit > 0 ? limit : 10;
  const offset = (pageNumber - 1) * limitNumber;

  let whereSql = " WHERE 1=1 ";
  const params: any[] = [];

  if (search && search.length >= 3) {
    whereSql += " AND question LIKE ?";
    params.push(`%${search}%`);
  }

  if (status) {
    whereSql += " AND status = ?";
    params.push(status);
  }
  if (user_role) {
    whereSql += ` AND support_for = ?`;
    params.push(user_role);
  }
  const dataSql = `
    SELECT *
    FROM help_and_support
    ${whereSql}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(*) as total
    FROM help_and_support
    ${whereSql}
  `;

  const data = await executeQuery(dataSql, [...params, limitNumber, offset]);
  const countResult = await executeQuery(countSql, params);

  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limitNumber);

  return {
    data,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
    },
  };
};

export const createOrUpdateIssueCategory = async (
  id?: number,
  name?: string,
  status?: string,
) => {
  if (id) {
    const query = `
      UPDATE issue_category
      SET name = ?, status = ?
      WHERE id = ?
    `;

    await executeQuery(query, [name, status || "active", id]);

    return { id, name, status: status || "active" };
  }

  const query = `
    INSERT INTO issue_category (name, status)
    VALUES (?, ?)
  `;

  const result: any = await executeQuery(query, [name, status || "active"]);

  return {
    id: result.insertId,
    name,
    status: status || "active",
  };
};

export const fetchIssueCategories = async (status?: string) => {
  let query = `
    SELECT id, name
    FROM issue_category
    WHERE 1=1
  `;

  const params: any[] = [];

  if (status) {
    query += ` AND status = ?`;
    params.push(status);
  }

  query += ` ORDER BY id DESC`;

  return await executeQuery(query, params);
};
