import original from "./original.js";

export default async function originalTests() {
  const answer = await original({
    message: "What is your name?",
    required: true,
    default: "John Smith",
    validate: (input) => (input?.length > 3 ? true : "Answer too short (4)"),
  });

  console.log(`answer: ${answer}`);
}
