import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../model/UserModel.js'



export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    console.log("New user created:", newUser);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating user" });
  }
};


export const login = async (req, res) => {
  console.log("login");
  
  const { username, password } = req.body;

  try {
    console.log("Attempting to login with username:", username);

    const user = await User.findOne({ username } );
    console.log(user);
    
    if (!user) {
      console.log("User not found:", username);
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordInvalid = await bcryptjs.compare(password, user.password);
    console.log(isPasswordInvalid);
    
    if (!isPasswordInvalid) {
      return res.status(400).json({ message: 'Password is invalid' });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, user: { id: user.id, username: user.username, email: user.email,avatar:user.avatar } });

  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};


