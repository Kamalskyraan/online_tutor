"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controller/auth.controller");
const router = (0, express_1.Router)();
router.post("/request-otp", (req, res) => {
    /*
      #swagger.tags = ['1.Auth']
      #swagger.summary = 'Request OTP'
      #swagger.description = 'Send OTP to mobile(0->no check in DB || 1-> check DB)'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          mobile: '9876543210',
          country_code : '+91',
          type : "0 or 1 or 2",
          email : "abc@gmail.com",
          add_mobile : "9876543211"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "OTP sent successfully"
      }
  
      #swagger.responses[400] = {
        description: "Invalid mobile number"
      }
    */
    return auth_controller_1.AuthController.RequestOtp(req, res);
});
router.post("/verify-otp", (req, res) => {
    /*
      #swagger.tags = ['1.Auth']
      #swagger.summary = 'Verify OTP'
      #swagger.description = 'Verify OTP to mobile'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          mobile: '9876543210',
          country_code : '+91',
          otp : '1234',
          email : "abc@gmail.com",
          add_mobile : "9876543211"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "OTP verify successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return auth_controller_1.AuthController.VerifyOtp(req, res);
});
router.post("/signup", (req, res) => {
    /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Signup'
    #swagger.description = 'Signup'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        mobile: '9876543210',
        country_code : '+91',
        otp : '12345678',
        user_name : "kamalesh",
        password : '12345678',
        device_id : 'abc_123',
        device_type : 'ios',
        device_token : 'xyz123',
        email : 'abc@gmail.com'
      }
    }


    #swagger.responses[200] = {
      description: "OTP verify successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
    return auth_controller_1.AuthController.signup(req, res);
});
router.post("/login", (req, res) => {
    /*
      #swagger.tags = ['1.Auth']
      #swagger.summary = 'Login'
      #swagger.description = 'Login with mobile number and password'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          mobile: '9876543210',
          country_code : '+91',
          password : '12345678',
          device_id : 'abc_123',
          device_type : 'ios',
          device_token : 'xyz123'
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Login successfull"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    return auth_controller_1.AuthController.login(req, res);
});
router.post("/reset-password", (req, res) => {
    /*
      #swagger.tags = ['1.Auth']
      #swagger.summary = 'reset password'
      #swagger.description = 'Reset Pawword with user ID'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
        country_code : "+91",
          mobile : '9876543210',
          new_password : '123456789',
          confirm_password : '123456789',
          user_id : "USER_59xhKU0B"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Password updated successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    auth_controller_1.AuthController.resetPassword(req, res);
});
router.post("/logout", (req, res) => {
    /*
      #swagger.tags = ['1.Auth']
      #swagger.summary = 'Logout'
      #swagger.description = 'Logout with user ID'
  
      
      #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
          user_id : 'USER_7wbjv2wt',
          device_id : "abc123",
          device_token : "abc123",
          device_type : "ios"
        }
      }
  
  
      #swagger.responses[200] = {
        description: "Password updated successfully"
      }
  
      #swagger.responses[500] = {
        description: "Internal Server Error"
      }
    */
    auth_controller_1.AuthController.logout(req, res);
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map