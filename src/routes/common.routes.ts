import { Router } from "express";
import { CommonController } from "../controller/common.controller";
import { upload } from "../config/multer";
import { uploadLoc } from "../config/multerloc";

  const router = Router();

router.get(
  "/get-country-data",

  (req, res) => {
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
    return CommonController.countryData(req, res);
  },
);

router.post("/upload", uploadLoc.single("file"), (req, res) => {
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
  CommonController.uploadFileLoc(req, res);
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
  return CommonController.getUploadFiles(req, res);
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
  return CommonController.getReportReasonsForChat(req, res);
});
export default router;
