import Joi from "joi";
import { profile } from "node:console";

export const helpSchema = Joi.object({
  id: Joi.number().optional().messages({
    "number.base": "id must be a number",
  }),

  question: Joi.string().min(3).max(255).required().messages({
    "string.base": "Question must be a string",
    "string.empty": "Question cannot be empty",
    "string.min": "Question must be at least 3 characters",
    "string.max": "Question cannot exceed 255 characters",
    "any.required": "Question is required",
  }),

  answer: Joi.string().min(3).required().messages({
    "string.base": "Answer must be a string",
    "string.empty": "Answer cannot be empty",
    "string.min": "Answer must be at least 3 characters",
    "any.required": "Answer is required",
  }),

  status: Joi.string().valid("active", "inactive").optional().messages({
    "string.base": "Status must be a string",
    "any.only": "Status must be either 'active' or 'inactive'",
  }),
  support_for: Joi.string().required().messages({
    "any.required": "Support For Whom is required",
    "string.empty": "Support For Whom is required",
  }),
});

export const requestOtSchema = Joi.object({
  country_code: Joi.string().messages({
    "any.required": "Country Code is required",
    "string.empty": "Country code is required",
  }),
  mobile: Joi.string().pattern(/^[0-9]{7,15}$/),
  email: Joi.string(),
  type: Joi.string().valid("0", "1" , "2").required().messages({
    "any.only": "Type must be either 0 or 1 or 2",
    "number.base": "Type must be a number",
    "any.required": "Type is required",
  }),
});

export const verifyOtpSchema = Joi.object({
  country_code: Joi.string().required().messages({
    "any.required": "Country code is required",
    "string.empty": "Country code cannot be empty",
  }),

  mobile: Joi.string().min(8).max(15).required().messages({
    "any.required": "Mobile number is required",
    "string.empty": "Mobile number cannot be empty",
    "string.min": "Invalid mobile number",
  }),

  otp: Joi.string()
    .length(4)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "any.required": "OTP is required",
      "string.length": "OTP must be 4 digits",
      "string.pattern.base": "OTP must contain only numbers",
    }),
});

export const signupSchema = Joi.object({
  user_name: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "User name must be a text",
    "string.empty": "User name is required",
    "string.min": "User name must be at least 3 characters",
    "string.max": "User name must be less than 50 characters",
    "any.required": "User name is required",
  }),

  country_code: Joi.string().required().messages({
    "any.required": "Country Code is required",
    "string.empty": "Country code is required",
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({
      "any.required": "Mobile number is required",
      "string.empty": "Mobile Number is required",
    }),

  password: Joi.string().min(8).max(32).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be less than 32 characters",
    "any.required": "Password is required",
  }),

  device_id: Joi.string().required().messages({
    "string.empty": "Device ID is required",
    "any.required": "Device ID is required",
  }),

  device_type: Joi.string().valid("web", "android", "ios").required().messages({
    "any.only": "Device type must be web, andriod, or ios",
    "any.required": "Device type is required",
  }),

  device_token: Joi.string().optional().allow("").messages({
    "string.base": "Device token must be a text",
  }),
  email: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  country_code: Joi.string().required().messages({
    "string.empty": "Country code is required",
    "any.required": "Country code is required",
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required",
      "string.pattern.base": "Mobile number must be 7 to 15 digits",
      "any.required": "Mobile number is required",
    }),

  password: Joi.string().min(8).max(32).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be less than 32 characters",
    "any.required": "Password is required",
  }),

  device_id: Joi.string().required().messages({
    "string.empty": "Device ID is required",
    "any.required": "Device ID is required",
  }),

  device_type: Joi.string().valid("web", "android", "ios").required().messages({
    "any.only": "Device type must be WEB, ANDROID, or IOS",
    "any.required": "Device type is required",
  }),
  device_token: Joi.string().optional().allow("").messages({
    "string.base": "Device token must be a text",
  }),
});

export const resetPasswordSchema = Joi.object({
  country_code: Joi.string().required().messages({
    "any.required": "Country Code is required",
    "string.empty": "Country Code is required",
  }),
  mobile: Joi.string().required().messages({
    "string.empty": "Mobile is required",
    "any.required": "Mobile is required",
  }),

  new_password: Joi.string().min(8).max(32).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 8 characters",
    "string.max": "New password must be less than 32 characters",
    "any.required": "New password is required",
  }),

  confirm_password: Joi.string().required().messages({
    "string.empty": "Confirm password is required",
    "any.required": "Confirm password is required",
  }),
});

// source
export const educationSchema = Joi.object({
  name: Joi.string().min(3).max(70).required().messages({
    "string.empty": "Education Name cannot be empty",
    "string.min": "Education Name must be at least 3 characters",
    "string.max": "Education Name must not exceed 70 characters",
    "any.required": "Education Name is required",
  }),

  id: Joi.number().integer().optional().messages({
    "number.base": "Education ID must be a number",
  }),
});
export const educationStreamSchema = Joi.object({
  name: Joi.string().min(3).max(70).required().messages({
    "string.empty": "Education Stream Name cannot be empty",
    "string.min": "Education Stream Name must be at least 3 characters",
    "string.max": "Education Stream Name must not exceed 70 characters",
    "any.required": "Education Stream Name is required",
  }),

  id: Joi.number().integer().optional().messages({
    "number.base": "Education ID must be a number",
  }),
  edu_id: Joi.number().integer().required().messages({
    "any.required": "Education ID is required",
  }),
});

// user

export const updateTutorSchema = Joi.object({
  user_id: Joi.string().required(),
  // 1
  represent: Joi.string().valid("1", "2", "3"),
  gender: Joi.string().valid("male", "female", "others"),
  is_show_num: Joi.boolean(),
  about_myself: Joi.string().allow(null, ""),

  // 2
  country: Joi.string(),
  pincode: Joi.string(),
  state: Joi.string(),
  district: Joi.string(),
  address: Joi.string(),
  area: Joi.string(),

  // 3
  education: Joi.string(),
  stream: Joi.number(),
});

export const updateUserProfileSchema = Joi.object({
  user_id: Joi.string().required(),
  // 1
  user_name: Joi.string(),
  represent: Joi.string().valid("1", "2", "3"),
  gender: Joi.string().valid("male", "female", "others"),
  is_show_num: Joi.boolean(),
  about_myself: Joi.string().allow(null, ""),
  email: Joi.string(),
  mobile: Joi.string(),
  add_mobile: Joi.string(),
  primary_num: Joi.string(),
  tutor_exp: Joi.string(),
  country_code: Joi.string(),
  profile_img: Joi.string(),

  // 2
  country: Joi.string(),
  pincode: Joi.string(),
  state: Joi.string(),
  district: Joi.string(),
  address: Joi.string(),
  area: Joi.string(),

  // 3
  education: Joi.string(),
  stream: Joi.number(),
});

export const getUserDetailsSchema = Joi.object({
  user_id: Joi.string().optional().allow("").messages({
    "string.base": "User ID must be a string",
  }),

  mobile: Joi.string()
    .pattern(/^[0-9]{7,15}$/)
    .optional()
    .allow("")
    .messages({
      "string.pattern.base": "Mobile number must be between 7 and 15 digits",
    }),
});
// subject

export const subjectSchema = Joi.object({
  subject_name: Joi.string().required().messages({
    "string.empty": "Subject Name is required",
    "any.required": "Subject Name is required",
  }),
  id: Joi.number().optional(),
});

export const updateTutorSubjectsSchema = Joi.object({
  tutor_id: Joi.string().required(),
  // 1
  subject_id: Joi.string(),
  subject_name: Joi.string(),
  covered_topics: Joi.string(),
  sylabus: Joi.string(),
  prior_exp: Joi.string(),
  exp_year: Joi.string(),
  exp_month: Joi.string(),
  // 2
  teach_language: Joi.string(),
  // 3
  class_mode: Joi.string(),
  stream_ids: Joi.string(),
  class_type: Joi.string(),
  min_fee: Joi.string(),
  max_fee: Joi.string(),
  tenure_type: Joi.string(),
});

// student
export const updateStudentSchema = Joi.object({
  id: Joi.number().optional(),
  user_id: Joi.string().required().messages({
    "any.required": "User Id is required",
  }),
  // 1
  gender: Joi.string().valid("male", "female", "others"),
  dob: Joi.string(),
  country: Joi.string(),
  pincode: Joi.string(),
  state: Joi.string(),
  district: Joi.string(),
  area: Joi.string(),
  address: Joi.string(),
  is_show_num: Joi.boolean().messages({}),

  // 2
  education: Joi.string(),
  stream: Joi.string(),
  learn_course: Joi.string(),
});

//review

export const reviewSchema = Joi.object({
  id: Joi.number().optional(),
  tutor_id: Joi.string().required().messages({
    "any.required": "Tutor ID is required",
  }),
  student_id: Joi.string().required().messages({
    "any.required": "Student ID is required",
  }),
  rating: Joi.string().valid("1", "2", "3", "4", "5").required().messages({
    "any.only": "Rating must be between 1 and 5",
    "any.required": "Rating is required",
    "string.base": "Rating must be a string",
  }),
  review_text: Joi.string().optional(),
});
export const fetchReviewSchema = Joi.object({
  id: Joi.number().optional(),
  tutor_id: Joi.string(),
  student_id: Joi.string(),
  rating: Joi.string().valid("1", "2", "3", "4", "5"),
  review_text: Joi.string().optional(),
});

export const replyReviewSchema = Joi.object({
  review_id: Joi.string().required().messages({
    "any.required": "Review Id is required",
  }),
  tutor_id: Joi.string().required().messages({
    "any.required": "Tutor Id is required",
  }),
  student_id: Joi.string().required().messages({
    "any.required": "Student Id is required",
  }),
  reply_text: Joi.string().required().messages({
    "any.required": "Reply comment is required",
  }),
});

//source

export const addUpdateLangSchema = Joi.object({
  id: Joi.number().optional().messages({
    "number.base": "Id must be a number",
  }),

  lang_name: Joi.string().trim().optional().messages({
    "string.base": "Language name must be a string",
    "string.empty": "Language name cannot be empty",
  }),

  status: Joi.string().valid("active", "inactive").optional().messages({
    "any.only": "Status must be either active or inactive",
    "string.base": "Status must be a string",
  }),
});

// demos
export const addUpdateDemosSchema = Joi.object({
  id: Joi.number(),
  tutor_id: Joi.string().required().messages({
    "any.required": "Tutor ID is required",
    "string.empty": "Tutor ID cannot be empty",
  }),

  media_type: Joi.string().valid("video", "image").required().messages({
    "any.required": "Media type is required",
    "any.only": "Media type must be either 'video' or 'image'",
  }),

  media_id: Joi.string().required().messages({
    "any.required": "Media ID is required",
    "string.empty": "Media ID cannot be empty",
  }),

  title: Joi.string().allow(null).optional().messages({
    "string.base": "Title must be a string",
  }),

  thumbnail: Joi.string().allow(null, "").optional().messages({
    "string.base": "Thumbnail must be a string",
  }),
});

export const getDemosSchema = Joi.object({
  id: Joi.number(),
  tutor_id: Joi.string().required().messages({
    "any.required": "Tutor ID is required",
  }),
  media_type: Joi.string().valid("image", "video", "").optional().messages({
    "string.base": "Media Type must be string",
  }),
});

// review
export const reviewLikeSchema = Joi.object({
  id: Joi.number(),

  review_id: Joi.string().required(),

  student_id: Joi.string().optional().allow(null, ""),
  tutor_id: Joi.string().optional().allow(null, ""),
}).or("student_id", "tutor_id");

export const reportSchema = Joi.object({
  review_id: Joi.string().required(),

  student_id: Joi.string().optional().allow(null, ""),
  tutor_id: Joi.string().optional().allow(null, ""),

  reason_id: Joi.number().required(),
  other_reason: Joi.string().allow(null, ""),
}).or("student_id", "tutor_id");
