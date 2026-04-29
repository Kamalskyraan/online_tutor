"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHelpRequest = exports.fetchIssueCategories = exports.createOrUpdateIssueCategory = exports.getAllHelp = exports.saveHelp = void 0;
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
const createOrUpdateIssueCategory = async (id, name, status, cat_for) => {
    if (id) {
        const query = `
      UPDATE issue_category
      SET name = ?, status = ?
      WHERE id = ? AND cat_for = ?
    `;
        await (0, helper_1.executeQuery)(query, [name, status || "active", id, cat_for]);
        return { id, name, status: status || "active" };
    }
    const query = `
    INSERT INTO issue_category (name, status , cat_for)
    VALUES (?, ? , ?)
  `;
    const result = await (0, helper_1.executeQuery)(query, [
        name,
        status || "active",
        cat_for,
    ]);
    return {
        id: result.insertId,
        name,
        status: status || "active",
    };
};
exports.createOrUpdateIssueCategory = createOrUpdateIssueCategory;
const fetchIssueCategories = async (status, cat_for) => {
    let query = `
    SELECT id, name
    FROM issue_category
    WHERE 1=1
  `;
    const params = [];
    if (status) {
        query += ` AND status = ?`;
        params.push(status);
    }
    if (cat_for) {
        query += ` AND cat_for = ?`;
        params.push(cat_for);
    }
    query += ` ORDER BY id DESC`;
    const result = await (0, helper_1.executeQuery)(query, params);
    result.push({
        id: -1,
        name: "Other Issues",
    });
    return result;
};
exports.fetchIssueCategories = fetchIssueCategories;
const createHelpRequest = async (data) => {
    const { user_name, mobile, email, issue_reason, subject, descp } = data;
    const query = `
    INSERT INTO help_requests 
    (user_name, mobile, email, issue_reason, subject, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
    const result = await (0, helper_1.executeQuery)(query, [
        user_name,
        mobile,
        email || null,
        issue_reason,
        subject,
        descp || null,
    ]);
    return {
        id: result.insertId,
        user_name,
        mobile,
        email,
        issue_reason,
        subject,
        descp,
    };
};
exports.createHelpRequest = createHelpRequest;
//# sourceMappingURL=help.model.js.map