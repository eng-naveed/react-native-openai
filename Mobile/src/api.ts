import axios from "axios";
import { IMessage } from "react-native-gifted-chat";

const logo = require("../assets/logo.jpeg");

const getResponse = async (value: string, isImage: boolean) => {
  try {
    const res = await axios.post("openai", {
      prompt: value,
      isImage,
    });
    const data = res.data;
    if (data) {
      const value: IMessage = {
        image: isImage ? data : undefined,
        _id: new Date().toString(),
        text: isImage ? "" : data.trim(),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "OPENAI GPT",
          avatar: logo,
        },
      };
      return value;
    }
  } catch (err) {
    throw err;
  }
};

export default getResponse;
