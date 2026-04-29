"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controller/review.controller");
const middleware_1 = require("../config/middleware");
const router = (0, express_1.Router)();
router.post("/add-update-review", middleware_1.authMiddleware, middleware_1.blockCheckMiddleware, middleware_1.deletedCheckMiddleware, (req, res) => {
    /*
    #swagger.tags = ['10.review']
    #swagger.summary = 'Add Update Review'
    #swagger.description = 'Add Review and Update Review'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        tutor_id : "TUTOR_4w4lwlu0",
        student_id : "STUDENT_UOFswA1y",
        rating: "5",
        review_text: "abcd efgh ijklmn opqrst"
      }
    }


    #swagger.responses[200] = {
      description: "Add or Update Review successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    review_controller_1.ReviewController.addUpdateReview(req, res);
});
router.post("/get-reviews", middleware_1.authMiddleware, middleware_1.blockCheckMiddleware, middleware_1.deletedCheckMiddleware, (req, res) => {
    /*
    #swagger.tags = ['10.review']
    #swagger.summary = 'Add Update Review'
    #swagger.description = 'Add Review and Update Review'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        id: 1,
        tutor_id : "TUTOR_4w4lwlu0",
        student_id : "STUDENT_UOFswA1y",
        rating: "5",
        page : 1,
        from_date : "2026-03-04",
        to_date : "2026-03-05"
      }
    }


    #swagger.responses[200] = {
      description: "Review Fetched successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    review_controller_1.ReviewController.getUpdateReview(req, res);
});
router.post("/reply-review", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Add Update Review Reply'
      #swagger.description = 'Add Review and Update Review Reply'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          tutor_id : "TUTOR_4w4lwlu0",
          student_id : "STUDENT_UOFswA1y",
          reply_text: "abcd efgh ijklmn opqrst",
          review_id : "3"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Add or Update Review Reply successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    review_controller_1.ReviewController.replyReview(req, res);
});
router.post("/add-review-like", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Add Update Review Like'
      #swagger.description = 'Add Review  Like and Update Review Like'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          review_id: "1",
          tutor_id : "TUTOR_4w4lwlu0",
          student_id : "STUDENT_UOFswA1y"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Review Liked successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    review_controller_1.ReviewController.reviewLike(req, res);
});
router.post("/remove-review", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Delete Review'
      #swagger.description = 'Remove Review based on student'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          student_id : "STUDENT_UOFswA1y"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Review Deleted successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    review_controller_1.ReviewController.deleteReview(req, res);
});
router.post("/remove-review-reply", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Delete Review reply'
      #swagger.description = 'Remove Reviewreply based on tutor'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          id: 1,
          tutor_id : "TUTOR_4w4lwlu0"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Review reply Deleted successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    review_controller_1.ReviewController.deleteReviewReply(req, res);
});
router.post("/get-report-reasons", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Get Report Reasons'
      #swagger.description = 'Fetch Report Reasons'
  
  
       #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          report_for : "profile or review"
        }
      }
  
      #swagger.responses[200] = {
        description: "Report Reasons fetched successfully",
       
      }
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    review_controller_1.ReviewController.fetchReportReasons(req, res);
});
router.post("/report-review", (req, res) => {
    /*
      #swagger.tags = ['10.review']
      #swagger.summary = 'Report a  Review'
      #swagger.description = 'Report a  Review '
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          review_id: "1",
          student_id : "STUDENT_UOFswA1y",
          tutor_id : "TUTOR_4w4lwlu0",
          reason_id :"-1",
          other_reason : "abcdefgh ijkl"
  
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Review Reported successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return review_controller_1.ReviewController.reportReview(req, res);
});
exports.default = router;
//# sourceMappingURL=review.routes.js.map