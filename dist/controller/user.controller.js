"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const helper_1 = require("../utils/helper");
const user_model_1 = require("../models/user.model");
const validate_1 = require("../validators/validate");
const userModel = new user_model_1.UserModel();
class userController {
}
exports.userController = userController;
_a = userController;
userController.updateTutor = async (req, res) => {
    try {
        const { user_id, ...payload } = req.body;
        await (0, helper_1.validateRequest)(req.body, validate_1.updateTutorSchema);
        // 1
        if (payload.user_role ||
            payload.represent ||
            payload.gender ||
            payload.is_show_num !== undefined ||
            payload.about_myself) {
            await userModel.updateUserBasic({ user_id, ...payload });
            const user_name = await userModel.fetchUserName(user_id);
            const filled = await userModel.fetchUserFormFilled(user_id);
            await userModel.updateTutorInfo({ user_id, ...payload });
            if (filled < 1)
                await userModel.formFilledUpdate(user_id, 1);
        }
        // 2
        if (payload.country ||
            payload.pincode ||
            payload.area ||
            payload.district ||
            payload.state ||
            payload.address ||
            payload.lat ||
            payload.lng) {
            await userModel.updateUserAddress({ user_id, ...payload });
            const filled = await userModel.fetchUserFormFilled(user_id);
            if (filled < 2)
                await userModel.formFilledUpdate(user_id, 2);
        }
        // 3
        if (payload.education || payload.stream) {
            const user_name = await userModel.fetchUserName(user_id);
            await userModel.updateUserEducation({ user_id, user_name, ...payload });
            const filled = await userModel.fetchUserFormFilled(user_id);
            if (filled < 3)
                await userModel.formFilledUpdate(user_id, 3);
        }
        return (0, helper_1.sendResponse)(res, 200, 1, [], "Details updated successfully");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
// static updateStudent = async (req: Request, res: Response) => {
//   try {
//     const { user_id, ...payload } = req.body;
//     await validateRequest(req.body, updateStudentSchema);
//     if (!user_id) {
//       return sendResponse(res, 200, 0, [], "User Id is required", []);
//     }
//     if (
//       payload.user_role ||
//       payload.dob ||
//       payload.gender ||
//       payload.is_show_num !== undefined ||
//       payload.pincode ||
//       payload.area ||
//       payload.district ||
//       payload.state ||
//       payload.country ||
//       payload.address
//     ) {
//       await userModel.updateUserBasicForStudent({ user_id, ...payload });
//       const filled = await userModel.fetchUserFormFilled(user_id);
//       if (filled < 1) await userModel.formFilledUpdate(user_id, 1);
//     }
//     if (payload.stream_id || payload.learn_course) {
//       let finalCourse = payload.learn_course ?? null;
//       if (payload.learn_course) {
//         const exists = await userModel.checkCourseExists(
//           payload.learn_course,
//         );
//         if (!exists) {
//           await userModel.createCourseRequestIfNotExists({
//             course_name: payload.learn_course,
//             user_id,
//           });
//           finalCourse = null;
//         }
//       }
//       const user_name = await userModel.fetchUserName(user_id);
//       const student_id = await generateStudentId();
//       await userModel.updateStudentEducation({
//         user_id,
//         user_name,
//         student_id,
//         ...payload,
//         learn_course: finalCourse,
//       });
//       const filled = await userModel.fetchUserFormFilled(user_id);
//       if (filled < 2) await userModel.formFilledUpdate(user_id, 2);
//     }
//     return sendResponse(res, 200, 1, [], "Details updated successfully");
//   } catch (err: any) {
//     console.log(err);
//     return sendResponse(
//       res,
//       500,
//       0,
//       [],
//       "Internal Server Error",
//       err.errors || err.message || err,
//     );
//   }
// };
userController.updateStudent = async (req, res) => {
    try {
        const { id, user_id, user_role, gender, dob, country, pincode, state, district, area, is_show_num, stream_id, learn_course, } = await (0, helper_1.validateRequest)(req.body, validate_1.updateStudentSchema);
        const result = await userModel.updateStudentDatas({
            user_id,
            user_role,
            gender,
            dob,
            country,
            pincode,
            state,
            district,
            area,
            is_show_num,
            stream_id,
            learn_course,
        });
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "Internal Server Error", err.errors || err.message || err);
    }
};
userController.userDetails = async (req, res) => {
    try {
        const { user_id, mobile } = req.body;
        await (0, helper_1.validateRequest)(req.body, validate_1.getUserDetailsSchema);
        const userData = await userModel.fetchUserData({ user_id, mobile });
        return (0, helper_1.sendResponse)(res, 200, 1, userData, "User Data Fetched successfully", []);
    }
    catch (err) {
        (0, helper_1.sendResponse)(res, 500, 0, [], "User Details Fetched successfully", err.errors || err.message || err);
    }
};
userController.updateTutorSubject = async (req, res) => {
    try {
        const { tutor_subject_id, ...payload } = req.body;
        if (payload.subject_id ||
            payload.subject_name ||
            payload.covered_topics ||
            payload.syllabus_id ||
            payload.prior_exp) {
            if (payload.prior_exp === "1" || payload.prior_exp === 1) {
                payload.prior_exp = 1;
            }
            else {
                payload.prior_exp = 0;
                payload.exp_years = null;
                payload.exp_months = null;
            }
            let subjectId = tutor_subject_id;
            if (!tutor_subject_id) {
                subjectId = await userModel.createSubject(payload);
            }
            else {
                // await mdl.updateSubject({ tutor_subject_id, ...payload });
            }
            if (payload.covered_topics?.length) {
                // await mdl.insertTopics(subjectId, payload.covered_topics);
            }
            // const filled = await mdl.fetchFormFilled(subjectId);
            // if (filled < 1) await mdl.updateFormFilled(subjectId, 1);
            return (0, helper_1.sendResponse)(res, 200, 1, { tutor_subject_id: subjectId, form_filled: 1 }, "Subject basic details saved");
        }
        // ---------- FORM 2 ----------
        if (payload.language_ids) {
            // await mdl.insertLanguages(tutor_subject_id, payload.language_ids);
            // const filled = await mdl.fetchFormFilled(tutor_subject_id);
            // if (filled < 2) await mdl.updateFormFilled(tutor_subject_id, 2);
            return (0, helper_1.sendResponse)(res, 200, 1, { tutor_subject_id, form_filled: 2 }, "Languages saved successfully");
        }
        // ---------- FORM 3 ----------
        if (payload.class_method ||
            payload.class_type ||
            payload.min_fee ||
            payload.max_fee ||
            payload.stream_ids) {
            // await mdl.insertClassDetails({
            //   tutor_subject_id,
            //   ...payload,
            // });
            if (payload.stream_ids?.length) {
                // await mdl.insertStreams(tutor_subject_id, payload.stream_ids);
            }
            // const filled = await mdl.fetchFormFilled(tutor_subject_id);
            // if (filled < 3) await mdl.updateFormFilled(tutor_subject_id, 3);
            return (0, helper_1.sendResponse)(res, 200, 1, {
                tutor_subject_id,
                form_filled: 3,
            }, "Subject added successfully");
        }
        return (0, helper_1.sendResponse)(res, 400, 0, [], "Invalid request data");
    }
    catch (err) {
        return (0, helper_1.sendResponse)(res, 500, 0, [], "something went wrong", err.errors || err.message || err);
    }
};
//# sourceMappingURL=user.controller.js.map