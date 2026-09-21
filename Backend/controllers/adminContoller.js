import jwt from "jsonwebtoken";

export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        res.json({success:false ,message:"Missing Details"})
    }
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const atoken = jwt.sign(email + password, process.env.JWT_SECRET_KEY);
      res.json({ success: true, atoken });
    } else {
      res.json({ success: false, message: "Invalid Credantials" });
    }
  } catch (error) {
    // console.log(error)
    res.json({ success: false, message: error.message });
  }
};