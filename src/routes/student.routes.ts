import { Router } from "express";
import { StudentController } from "../controller/student.controller";

const router = Router();

router.post("/nearby-tutors", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Near By Tutor's Data'
    #swagger.description = 'Get Tutor's data using lat,lng'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        lat : "12.45",
        lng : "10.46",
        search_address : "cbe",
        search_subject : "Java",
        student_id : "STUDENT_4Gy3VZ_N",
        gender : "male or female or others",
        represent : "1 or 2 or 3",
        min_fee : "120",
        max_fee : "1200",
        tenure_type : "hour or week or day",
        languages : ["1","2","3"],
        class_mode : "1",
        class_type :"1",
        rating : "4",
        page : 1
        }
    }


    #swagger.responses[200] = {
      description: "Tutor Data fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.getNearbyTutors(req, res);
});
router.post("/get-student-data", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Student Data'
    #swagger.description = 'Get Student data using student_id'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        student_id: "STUDENT_2Ie159-E"
        }
    }


    #swagger.responses[200] = {
      description: "Student Data fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  StudentController.getStudentData(req, res);
});

router.post("/book-session", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Book a tutor's Subject session'
    #swagger.description = 'Book a tutor's Subject session'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        student_id: "STUDENT_4Gy3VZ_N",
        tutor_id : "TUTOR_A2u50js3",
        linked_sub: "1"
        }
    }


    #swagger.responses[200] = {
      description: "Session Booked Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return StudentController.bookASession(req, res);
});

router.post("/cencel-booking", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'cancel a tutor's Subject session'
    #swagger.description = 'cancel a tutor's Subject session'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
         booking_id : 1
        }
    }


    #swagger.responses[200] = {
      description: "Session cancelled Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return StudentController.cancelABookSession(req, res);
});

router.post("/get-book-session", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Status for Session'
    #swagger.description = 'Get book session status'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        session_id : 1
        }
    }


    #swagger.responses[200] = {
      description: "Session status Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  return StudentController.bookSessionStatus(req, res);
});

router.post("/get-fees", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Fees'
    #swagger.description = 'Get Fees MIn and Max'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        subject_id : 1,
        subject_name : "tamil",
        fee_type : "hour or week or day",
        student_id : "STUDENT_4Gy3VZ"
        }
    }


    #swagger.responses[200] = {
      description: "Fees fetched  Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.getFees(req, res);
});

router.post("/student-view-tutorprofile", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Update Mobile View Profile'
    #swagger.description = 'Update View Setup'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        student_id : "STUDENT_4Gy3VZ_N",
        tutor_id : "TUTOR_A2u50js3"
        }
    }


    #swagger.responses[200] = {
      description: "Liked Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.updateMovileViewFromTutorById(req, res);
});

router.post("/get-booked-classes", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Booked classes'
    #swagger.description = 'Booked class filter also update'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        student_id : "STUDENT_4Gy3VZ_N",
        status : "pending or accepted or rejected",
        subject_name: "Tamil",
        page : 1
    }

}
    #swagger.responses[200] = {
      description: "Fetched Classes Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.getBookedClassesForStudent(req, res);
});

router.post("/student-suggestion", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Subject suggestion'
    #swagger.description = 'Get Subject suggestion'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        student_id : "STUDENT_4Gy3VZ_N"
    }

}
    #swagger.responses[200] = {
      description: "Fetched Subject Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.studentConsumedSubjects(req, res);
});
router.post("/student-favs", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Get Favourites of student'
    #swagger.description = 'Get Favourites of student'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        student_id : "STUDENT_4Gy3VZ_N",
        page : 1
    }

}
    #swagger.responses[200] = {
      description: "Fetched Favourites Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.getMyFavourites(req, res);
});

router.post("/report-tutor-profile", (req, res) => {
  /*
    #swagger.tags = ['9.Student']
    #swagger.summary = 'Report Tutor'
    #swagger.description = 'Report Tutor Profile'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: false,
      schema: {
        student_id : "STUDENT_4Gy3VZ_N",
       tutor_id : "TUTOR_4w4lwlu0",
       reason_id : "1",
       other_reason: "abc deefghij"
    }

}
    #swagger.responses[200] = {
      description: "Report Tutor Profile Successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  StudentController.reportTutorProfile(req, res);
});

export default router;
