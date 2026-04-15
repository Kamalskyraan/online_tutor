"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateIssueCategory = exports.getAllHelp = exports.saveHelp = void 0;
const helper_1 = require("../utils/helper");
const saveHelp = async (help) => {
    if (help.id) {
        const sql = "UPDATE help_and_support SET question = ?, answer = ?, status = ? , support_for = ? WHERE id = ?";
        const params = [
            help.question,
            help.answer,
            help.status || "active",
            help.support_for,
            help.id,
        ];
        return await (0, helper_1.executeQuery)(sql, params);
    }
    else {
        const sql = "INSERT INTO help_and_support (question, answer, status , support_for) VALUES (?, ?, ? , ?)";
        const params = [
            help.question,
            help.answer,
            help.status,
            help.support_for || "active",
        ];
        return await (0, helper_1.executeQuery)(sql, params);
    }
};
exports.saveHelp = saveHelp;
const getAllHelp = async (search, status, user_role, page = 1, limit = 10) => {
    const pageNumber = page > 0 ? page : 1;
    const limitNumber = limit > 0 ? limit : 10;
    const offset = (pageNumber - 1) * limitNumber;
    let whereSql = " WHERE 1=1 ";
    const params = [];
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
    const data = await (0, helper_1.executeQuery)(dataSql, [...params, limitNumber, offset]);
    const countResult = await (0, helper_1.executeQuery)(countSql, params);
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
exports.getAllHelp = getAllHelp;
const createOrUpdateIssueCategory = async (id, name, status) => {
    if (id) {
        const query = `
      UPDATE issue_category
      SET name = ?, status = ?
      WHERE id = ?
    `;
        await (0, helper_1.executeQuery)(query, [name, status || "active", id]);
        return { id, name, status: status || "active", action: "updated" };
    }
    const query = `
    INSERT INTO issue_category (name, status)
    VALUES (?, ?)
  `;
    const result = await (0, helper_1.executeQuery)(query, [name, status || "active"]);
    return {
        id: result.insertId,
        name,
        status: status || "active",
        action: "created",
    };
};
exports.createOrUpdateIssueCategory = createOrUpdateIssueCategory;
//# sourceMappingURL=help.model.js.map