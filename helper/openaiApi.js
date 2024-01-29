const { OpenAI } = require("openai");
const fs = require('fs');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// Đường dẫn đến tệp tin
const filePath = 'helper/content.txt';


// Đọc nội dung từ tệp tin
const fileContent = fs.readFileSync(filePath, 'utf-8');
// Lưu trữ lịch sử chat
let messages = [
  {
    "role": "system",
    "content": fileContent
  }
  
  
  ];

const chatCompletion = async (prompt) => {
  try {
    // Thêm tin nhắn mới vào lịch sử chat
    messages.push({ role: "user", content: prompt });

    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo",
    });

    console.log(messages);

    if (response && response.choices && response.choices.length > 0) {
      let content = response.choices[0].message.content;

      // Lưu trữ lịch sử chat cho những yêu cầu tiếp theo
      messages.push({ role: 'assistant', content: content });

      return {
        status: 1,
        response: content
      };
    } else {
      console.error('Unexpected API response format:', response);
      return {
        status: 0,
        response: 'Unexpected API response format'
      };
    }
  } catch (error) {
    return {
      status: 0,
      response: 'Please check OpenAI API key.'
    };
  }
};

module.exports = {
  chatCompletion
};
