export interface Help {
  id?: number;
  question: string;
  answer: string;
  status?: "active" | "inactive";
  support_for: string;
}

export interface RequestOtps {
  country_code: string;
  mobile: string;
  otp?: string;
  email?: string;
  add_mobile?: string;
}

export interface RequestOTPBody {
  country_code: string;
  mobile: string;
}

export interface createOtp {
  mobile?: string;
  email?: string;
  otp: string;
  expires_at: Date;
  country_code?: string;
  add_mobile?: string;
}

// singup

export interface users {
  id?: number;
  user_name: string;
  user_id: string;
  country_code: string;
  mobile: string;
  password_hash: string;
  countryy: string;
  email: string;
}

export interface userDevice {
  id?: number;
  user_id: string;
  device_id: string;
  device_token: string;
  device_type: "web" | "android" | "ios";
}
export interface UserProfileBody {
  user_id: string;
  user_role: "tutor" | "student";
  gender: string;
  is_show_num: boolean;
  about_myself: string;
}

export interface UserAddressBody {
  user_id: string;
  pincode: string;
  area: string;
  address: string;
  district: string;
  state: string;
  country: string;
  lat: string;
  lng: string;
}

export interface UserEducationBody {
  user_id: string;
  user_name: string;
  learn_course?: string;
  stream_id?: string;
  student_id?: string;
  req_course?: string;
}

// src
export interface PincodeResult {
  pincode: string;
  postcode_localities: string[];
  city: string;
  district: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  formatted_address: string;
}

export interface PincodeDB {
  pincode: string;
  postcode_localities: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  formatted_address: string | null;
  created_at: string;
}

//tutor

export interface tutorData {
  represent: string;
  tutor_id: string;
  user_id: string;
  user_name: string;
}
export interface studentEduData {
  education_level: string;
  learn_course: string;
  user_id: string;
  user_name: string;
}

export interface EducationLevel {
  id?: number;
  name: string;
  board: string;
  status: string;
}

export interface StreamLevel {
  id?: number;
  name: string;
  status: string;
}

// subject
export interface subjectBody {
  id?: number;
  subject_name: string;
  status?: string;
}

export interface addSubjectBody {
  id?: number;
  subject_name: string;
  covered_topics: string;
  syllabus_id: string;
  prior_exp: number;
}

export interface addTeachingLang {
  id?: number;
  teaching_lang?: String;
}
export interface addClassTypes {
  id?: number;
  class_mode: string;
  stream?: number;
  class_type: string;
  min_fee: string;
  max_fee: string;
  fee_tenure: string;
}

// files
type UploadCategory = "image" | "video" | "pdf";

export interface StartUploadBody {
  fileType: string;
  category: UploadCategory;
}

// student

export interface studentPersonalBody {
  user_id: string;
  gender: string;
  dob: string;
  country: string;
  pincode: string;
  state: string;
  district: string;
  area: string;
  is_show_num: string;
  address?: string;
  user_role: string;
  lat: string;
  lng: string;
}

//user

export interface UpdateUserProfilePayload {
  // 1
  user_name?: string;
  is_mob_verify?: string;
  is_mail_verify?: string;
  is_addmob_verify?: string;
  //
  gender?: "male" | "female" | "others";
  is_show_num?: boolean;
  about_myself?: string;
  email?: string;
  mobile?: string;
  add_mobile?: string;
  primary_num?: string;
  country_code?: string;
  profile_img?: string;
  country?: string;
  pincode?: string;
  state?: string;
  district?: string;
  address?: string;
  area?: string;
  // 2

  represent?: "1" | "2" | "3";
  tutor_exp?: string;
  exp_year?: string;
  exp_month?: string;
  stream_id: string;

  //
}

export interface userDetailsRequest {
  user_id?: string;
  mobile?: string;
}

//student

//
export interface Location {
  lat: string;
  lng: string;
  radius?: number;
  student_id: string;
  search_address?: string;
  search_subject?: string;
  rating?: string;
  page?: string;
}

export interface TutorLocation {
  id: string;
  user_name: string;
  lat: string;
  lng: string;
}

//

export interface Review {
  id?: number;
  tutor_id: string;
  student_id: string;
  rating: string;
  review_text?: string;
}

export interface fetchReview {
  id?: number;
  tutor_id?: string;
  student_id?: string;
  rating?: string;
  from_date?: string;
  to_date?: string;
  page: number;
  limit: number;
}

export interface replyReview {
  id?: number;
  review_id: string;
  tutor_id: string;
  student_id: string;
  reply_text: string;
}

export interface replyike {
  id?: number;
  review_id: string;
  tutor_id: string;
  student_id: string;
}

// source

export interface languageUpdate {
  id?: number;
  lang_name?: string;
  status?: "active" | "inactive";
}

export interface languageFilter {
  id?: number;
  lang_name?: string;
  status?: string;
}

export interface getSubjectBody {
  id?: number;
  subject_name?: string;
  status: string;
}

export interface addSubjectsToTutor {
  tutor_id: string;
  subject_id?: string;
  subject_name?: string;
}

// demos
export interface getDemosBody {
  tutor_id: string;
  media_type?: string;
  id?: number;
}

// class book
export interface studentBookClass {
  booking_id: string;
  student_id: string;
  tutor_id: string;
  linked_sub: string;
}

//

export interface LocationInput {
  area?: string;
  city?: string;
  state?: string;
}

export interface LocationResult {
  pincode: string | null;
  postcode_localities: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  formatted_address: string | null;
}
