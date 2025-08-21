import jwt from "jsonwebtoken";

const generateToken = (email, name) => {
  const accessToken = jwt.sign(
    { email: email, name: name },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: "7d",
    }
  );

  return accessToken;
};

export default generateToken;
