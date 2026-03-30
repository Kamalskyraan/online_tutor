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


export default router;
