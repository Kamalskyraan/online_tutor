"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportSchema = exports.reviewLikeSchema = exports.getDemosSchema = exports.addUpdateDemosSchema = exports.addUpdateLangSchema = exports.replyReviewSchema = exports.fetchReviewSchema = exports.reviewSchema = exports.updateStudentSchema = exports.updateTutorSubjectsSchema = exports.subjectSchema = exports.getUserDetailsSchema = exports.updateUserProfileSchema = exports.updateTutorSchema = exports.educationStreamSchema = exports.educationSchema = exports.resetPasswordSchema = exports.loginSchema = exports.signupSchema = exports.verifyOtpSchema = exports.requestOtSchema = exports.helpSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.helpSchema = joi_1.default.object({
    id: joi_1.default.number().optional().messages({
        "number.base": "id must be a number",
    }),
    question: joi_1.default.string().min(3).max(255).required().messages({
        "string.base": "Question must be a string",
        "string.empty": "Question cannot be empty",
        "string.min": "Question must be at least 3 characters",
        "string.max": "Question cannot exceed 255 characters",
        "any.required": "Question is required",
    }),
    answer: joi_1.default.string().min(3).required().messages({
        "string.base": "Answer must be a string",
        "string.empty": "Answer cannot be empty",
        "string.min": "Answer must be at least 3 characters",
        "any.required": "Answer is required",
    }),
    status: joi_1.default.string().valid("active", "inactive").optional().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be either 'active' or 'inactive'",
    }),
    support_for: joi_1.default.string().required().messages({
        "any.required": "Support For Whom is required",
        "string.empty": "Support For Whom is required",
    }),
});
exports.requestOtSchema = joi_1.default.object({
    country_code: joi_1.default.string().messages({
        "any.required": "Country Code is required",
        "string.empty": "Country code is required",
    }),
    mobile: joi_1.default.string().pattern(/^[0-9]{7,15}$/),
    email: joi_1.default.string(),
    type: joi_1.default.string().valid("0", "1", "2").required().messages({
        "any.only": "Type must be either 0 or 1 or 2",
        "number.base": "Type must be a number",
        "any.required": "Type is required",
    }),
});
exports.verifyOtpSchema = joi_1.default.object({
    country_code: joi_1.default.string().required().messages({
        "any.required": "Country code is required",
        "string.empty": "Country code cannot be empty",
    }),
    mobile: joi_1.default.string().min(8).max(15).required().messages({
        "any.required": "Mobile number is required",
        "string.empty": "Mobile number cannot be empty",
        "string.min": "Invalid mobile number",
    }),
    otp: joi_1.default.string()
        .length(4)
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
        "any.required": "OTP is required",
        "string.length": "OTP must be 4 digits",
        "string.pattern.base": "OTP must contain only numbers",
    }),
});
exports.signupSchema = joi_1.default.object({
    user_name: joi_1.default.string().trim().min(3).max(50).required().messages({
        "string.base": "User name must be a text",
        "string.empty": "User name is required",
        "string.min": "User name must be at least 3 characters",
        "string.max": "User name must be less than 50 characters",
        "any.required": "User name is required",
    }),
    country_code: joi_1.default.string().required().messages({
        "any.required": "Country Code is required",
        "string.empty": "Country code is required",
    }),
    mobile: joi_1.default.string()
        .pattern(/^[0-9]{7,15}$/)
        .required()
        .messages({
        "any.required": "Mobile number is required",
        "string.empty": "Mobile Number is required",
    }),
    password: joi_1.default.string().min(8).max(32).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password must be less than 32 characters",
        "any.required": "Password is required",
    }),
    device_id: joi_1.default.string().required().messages({
        "string.empty": "Device ID is required",
        "any.required": "Device ID is required",
    }),
    device_type: joi_1.default.string().valid("web", "android", "ios").required().messages({
        "any.only": "Device type must be web, andriod, or ios",
        "any.required": "Device type is required",
    }),
    device_token: joi_1.default.string().optional().allow("").messages({
        "string.base": "Device token must be a text",
    }),
    email: joi_1.default.string().optional(),
});
exports.loginSchema = joi_1.default.object({
    country_code: joi_1.default.string().required().messages({
        "string.empty": "Country code is required",
        "any.required": "Country code is required",
    }),
    mobile: joi_1.default.string()
        .pattern(/^[0-9]{7,15}$/)
        .required()
        .messages({
        "string.empty": "Mobile number is required",
        "string.pattern.base": "Mobile number must be 7 to 15 digits",
        "any.required": "Mobile number is required",
    }),
    password: joi_1.default.string().min(8).max(32).required().messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters",
        "string.max": "Password must be less than 32 characters",
        "any.required": "Password is required",
    }),
    device_id: joi_1.default.string().required().messages({
        "string.empty": "Device ID is required",
        "any.required": "Device ID is required",
    }),
    device_type: joi_1.default.string().valid("web", "android", "ios").required().messages({
        "any.only": "Device type must be WEB, ANDROID, or IOS",
        "any.required": "Device type is required",
    }),
    device_token: joi_1.default.string().optional().allow("").messages({
        "string.base": "Device token must be a text",
    }),
});
exports.resetPasswordSchema = joi_1.default.object({
    country_code: joi_1.default.string().messages({
        "string.empty": "Country Code is required",
    }),
    mobile: joi_1.default.string().messages({
        "any.required": "Mobile is required",
    }),
    new_password: joi_1.default.string().min(8).max(32).required().messages({
        "string.empty": "New password is required",
        "string.min": "New password must be at least 8 characters",
        "string.max": "New password must be less than 32 characters",
        "any.required": "New password is required",
    }),
    confirm_password: joi_1.default.string().required().messages({
        "string.empty": "Confirm password is required",
        "any.required": "Confirm password is required",
    }),
    user_id: joi_1.default.string().optional().allow(null, ""),
});
// source
exports.educationSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(70).required().messages({
        "string.empty": "Education Name cannot be empty",
        "string.min": "Education Name must be at least 3 characters",
        "string.max": "Education Name must not exceed 70 characters",
        "any.required": "Education Name is required",
    }),
    id: joi_1.default.number().integer().optional().messages({
        "number.base": "Education ID must be a number",
    }),
});
exports.educationStreamSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(70).required().messages({
        "string.empty": "Education Stream Name cannot be empty",
        "string.min": "Education Stream Name must be at least 3 characters",
        "string.max": "Education Stream Name must not exceed 70 characters",
        "any.required": "Education Stream Name is required",
    }),
    id: joi_1.default.number().integer().optional().messages({
        "number.base": "Education ID must be a number",
    }),
    edu_id: joi_1.default.number().integer().required().messages({
        "any.required": "Education ID is required",
    }),
});
// user
exports.updateTutorSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    // 1
    represent: joi_1.default.string().valid("1", "2", "3"),
    gender: joi_1.default.string().valid("male", "female", "others"),
    is_show_num: joi_1.default.boolean().truthy(1).falsy(0),
    about_myself: joi_1.default.string().allow(null, ""),
    // 2
    country: joi_1.default.string(),
    pincode: joi_1.default.string(),
    state: joi_1.default.string(),
    district: joi_1.default.string(),
    address: joi_1.default.string(),
    area: joi_1.default.string(),
    // 3
    education: joi_1.default.string(),
    stream_id: joi_1.default.number(),
});
exports.updateUserProfileSchema = joi_1.default.object({
    user_id: joi_1.default.string().required(),
    // 1
    user_name: joi_1.default.string(),
    represent: joi_1.default.string().valid("1", "2", "3"),
    gender: joi_1.default.string().valid("male", "female", "others"),
    is_show_num: joi_1.default.boolean().truthy(1).falsy(0),
    about_myself: joi_1.default.string().allow(null, ""),
    email: joi_1.default.string(),
    mobile: joi_1.default.string(),
    add_mobile: joi_1.default.string(),
    primary_num: joi_1.default.string(),
    tutor_exp: joi_1.default.string(),
    country_code: joi_1.default.string(),
    profile_img: joi_1.default.string(),
    // 2
    country: joi_1.default.string(),
    pincode: joi_1.default.string(),
    state: joi_1.default.string(),
    district: joi_1.default.string(),
    address: joi_1.default.string(),
    area: joi_1.default.string(),
    // 3
    stream_id: joi_1.default.number(),
});
exports.getUserDetailsSchema = joi_1.default.object({
    user_id: joi_1.default.string().optional().allow("").messages({
        "string.base": "User ID must be a string",
    }),
    mobile: joi_1.default.string()
        .pattern(/^[0-9]{7,15}$/)
        .optional()
        .allow("")
        .messages({
        "string.pattern.base": "Mobile number must be between 7 and 15 digits",
    }),
});
// subject
exports.subjectSchema = joi_1.default.object({
    subject_name: joi_1.default.string().required().messages({
        "string.empty": "Subject Name is required",
        "any.required": "Subject Name is required",
    }),
    id: joi_1.default.number().optional(),
});
exports.updateTutorSubjectsSchema = joi_1.default.object({
    tutor_id: joi_1.default.string().required(),
    // 1
    subject_id: joi_1.default.string().allow(null, ""),
    subject_name: joi_1.default.string().allow(null, ""),
    covered_topics: joi_1.default.array()
        .items(joi_1.default.string().trim().min(1))
        .min(1)
        .optional(),
    sylabus: joi_1.default.string(),
    prior_exp: joi_1.default.string(),
    exp_year: joi_1.default.string(),
    exp_month: joi_1.default.string(),
    // 2
    teach_language: joi_1.default.string(),
    // 3
    class_mode: joi_1.default.string(),
    stream_id: joi_1.default.string(),
    class_type: joi_1.default.string(),
    min_fee: joi_1.default.string(),
    max_fee: joi_1.default.string(),
    tenure_type: joi_1.default.string(),
});
// student
exports.updateStudentSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    user_id: joi_1.default.string().required().messages({
        "any.required": "User Id is required",
    }),
    // user_name: Joi.string().required().messages({
    //   "any.required": "User Name is required",
    // }),
    // 1
    gender: joi_1.default.string().valid("male", "female", "other"),
    dob: joi_1.default.string(),
    country: joi_1.default.string(),
    pincode: joi_1.default.string(),
    state: joi_1.default.string(),
    district: joi_1.default.string(),
    area: joi_1.default.string(),
    // address: Joi.string(),
    lat: joi_1.default.string(),
    lng: joi_1.default.string(),
    is_show_num: joi_1.default.boolean().truthy(1).falsy(0),
    // 2
    stream_id: joi_1.default.string(),
    learn_course_id: joi_1.default.string(),
    learn_course: joi_1.default.array().items(joi_1.default.string().trim().min(1)).min(1).optional(),
});
//review
exports.reviewSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    tutor_id: joi_1.default.string().required().messages({
        "any.required": "Tutor ID is required",
    }),
    student_id: joi_1.default.string().required().messages({
        "any.required": "Student ID is required",
    }),
    rating: joi_1.default.string().valid("1", "2", "3", "4", "5").required().messages({
        "any.only": "Rating must be between 1 and 5",
        "any.required": "Rating is required",
        "string.base": "Rating must be a string",
    }),
    review_text: joi_1.default.string().optional(),
});
exports.fetchReviewSchema = joi_1.default.object({
    id: joi_1.default.number().optional(),
    tutor_id: joi_1.default.string(),
    student_id: joi_1.default.string(),
    rating: joi_1.default.string().valid("1", "2", "3", "4", "5"),
    review_text: joi_1.default.string().optional(),
});
exports.replyReviewSchema = joi_1.default.object({
    review_id: joi_1.default.string().required().messages({
        "any.required": "Review Id is required",
    }),
    tutor_id: joi_1.default.string().required().messages({
        "any.required": "Tutor Id is required",
    }),
    student_id: joi_1.default.string().required().messages({
        "any.required": "Student Id is required",
    }),
    reply_text: joi_1.default.string().required().messages({
        "any.required": "Reply comment is required",
    }),
});
//source
exports.addUpdateLangSchema = joi_1.default.object({
    id: joi_1.default.number().optional().messages({
        "number.base": "Id must be a number",
    }),
    lang_name: joi_1.default.string().trim().optional().messages({
        "string.base": "Language name must be a string",
        "string.empty": "Language name cannot be empty",
    }),
    status: joi_1.default.string().valid("active", "inactive").optional().messages({
        "any.only": "Status must be either active or inactive",
        "string.base": "Status must be a string",
    }),
});
// demos
exports.addUpdateDemosSchema = joi_1.default.object({
    id: joi_1.default.number(),
    tutor_id: joi_1.default.string().required().messages({
        "any.required": "Tutor ID is required",
        "string.empty": "Tutor ID cannot be empty",
    }),
    media_type: joi_1.default.string().valid("video", "image").required().messages({
        "any.required": "Media type is required",
        "any.only": "Media type must be either 'video' or 'image'",
    }),
    media_id: joi_1.default.string().required().messages({
        "any.required": "Media ID is required",
        "string.empty": "Media ID cannot be empty",
    }),
    title: joi_1.default.string().allow(null, "").optional().messages({
        "string.base": "Title must be a string",
    }),
    thumbnail: joi_1.default.string().allow(null, "").optional().messages({
        "string.base": "Thumbnail must be a string",
    }),
});
exports.getDemosSchema = joi_1.default.object({
    id: joi_1.default.number(),
    tutor_id: joi_1.default.string().required().messages({
        "any.required": "Tutor ID is required",
    }),
    media_type: joi_1.default.string().valid("image", "video", "").optional().messages({
        "string.base": "Media Type must be string",
    }),
});
// review
exports.reviewLikeSchema = joi_1.default.object({
    id: joi_1.default.number(),
    review_id: joi_1.default.string().required(),
    student_id: joi_1.default.string().optional().allow(null, ""),
    tutor_id: joi_1.default.string().optional().allow(null, ""),
}).or("student_id", "tutor_id");
exports.reportSchema = joi_1.default.object({
    review_id: joi_1.default.string().required(),
    student_id: joi_1.default.string().optional().allow(null, ""),
    tutor_id: joi_1.default.string().optional().allow(null, ""),
    reason_id: joi_1.default.number().required(),
    other_reason: joi_1.default.string().allow(null, ""),
}).or("student_id", "tutor_id");
//# sourceMappingURL=validate.js.map