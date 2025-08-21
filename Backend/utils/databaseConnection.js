import mongoose from "mongoose";

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
  } catch (error) {
    process.exit(1);
  }
};

export default DBconnection;
