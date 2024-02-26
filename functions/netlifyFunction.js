const { io } = require("./server");

const handler = async (event, context) => {
  // Handle your Netlify function logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Function executed successfully" }),
  };
};

module.exports = { handler };