import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router = Router();

router.post("/request-otp", (req, res) => {
  /*
    #swagger.tags = ['1.Auth']
    #swagger.summary = 'Request OTP'
    #swagger.description = 'Send OTP to mobile'

    
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        mobile: '9876543210',
        country_code : '+91'
      }
    }


    #swagger.responses[200] = {
      description: "OTP sent successfully"
    }

    #swagger.responses[400] = {
      description: "Invalid mobile number"
    }
  */
  return AuthController.RequestOtp(req, res);
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
        otp : '1234'
      }
    }


    #swagger.responses[200] = {
      description: "OTP verify successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */
  return AuthController.VerifyOtp(req, res);
});

router.post(
  "/signup",

  (req, res) => {
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
    return AuthController.signup(req, res);
  },
);

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
  return AuthController.login(req, res);
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
        confirm_password : '123456789'
      }
    }


    #swagger.responses[200] = {
      description: "Password updated successfully"
    }

    #swagger.responses[500] = {
      description: "Internal Server Error"
    }
  */

  AuthController.resetPassword(req, res);
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
  AuthController.logout(req, res);
});

export default router;
