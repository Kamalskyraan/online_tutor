"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const common_controller_1 = require("../controller/common.controller");
const multerloc_1 = require("../config/multerloc");
const router = (0, express_1.Router)();
router.get("/get-country-data", (req, res) => {
    /*
    #swagger.tags = ['11.Common']
    #swagger.summary = 'Get Country Data'
    #swagger.description = 'Fetch Country Data From country.json'


    #swagger.responses[200] = {
      description: "Country data list fetched successfully",
     
    }
    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    return common_controller_1.CommonController.countryData(req, res);
});
router.post("/upload", multerloc_1.uploadLoc.single("file"), (req, res) => {
    /*
  #swagger.tags = ['11.Common']
  #swagger.summary = 'Upload Image | Video | PDF'
  #swagger.description = 'Upload files to Server and return file details'
  
  ```
  #swagger.consumes = ['multipart/form-data']
  
  #swagger.parameters['file'] = {
    in: 'formData',
    type: 'file',
    required: true,
    description: 'File to upload (image, video, pdf)'
  }
  
  #swagger.parameters['category'] = {
    in: 'formData',
    type: 'string',
    required: true,
    description: 'File category',
    enum: ['image','video','pdf' , 'docx']
  }
  
  #swagger.responses[200] = {
    description: "File uploaded successfully"
  }
  
  #swagger.responses[500] = {
    description: "Internal Server Error"
  }
  ```
  
  */
    common_controller_1.CommonController.uploadFileLoc(req, res);
});
router.post("/get-uploads", (req, res) => {
    /*
      #swagger.tags = ['11.Common']
      #swagger.summary = 'Get uploaded files fetched sucessfully'
      #swagger.description = 'Get files fetched succesfully'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          ids: "1,2"
          }
      }
  
  
      #swagger.responses[200] = {
        description: "Files fetched successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return common_controller_1.CommonController.getUploadFiles(req, res);
});
router.get("/get-chat-reports", (req, res) => {
    /*
      #swagger.tags = ['11.Common']
      #swagger.summary = 'Get Chat Report Reasons '
      #swagger.description = 'Fetch Rrport Data From '
  
  
      #swagger.responses[200] = {
        description: "Report data list fetched successfully",
       
      }
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return common_controller_1.CommonController.getReportReasonsForChat(req, res);
});
exports.default = router;
//# sourceMappingURL=common.routes.js.map