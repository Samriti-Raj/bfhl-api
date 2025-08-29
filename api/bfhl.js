
const express = require("express");
const app = express();
app.use(express.json());

// --- Config ---
const FULL_NAME = "samriti raj"; 
const DOB = "17091999";          
const EMAIL = "samriti@example.com";
const ROLL_NUMBER = "ABCD123";

// --- Helper functions ---
function makeUserId(fullName, dob) {
  return `${fullName.replace(/\s+/g, "_")}_${dob}`;
}
function isIntegerString(s) {
  return /^-?\d+$/.test(s);
}
function extractLetters(str) {
  return str.split("").filter(ch => /[a-zA-Z]/.test(ch));
}

// --- Route ---
app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) {
      return res.status(200).json({ is_success: false, message: "Invalid input" });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let allLetters = [];

    data.forEach(item => {
      const str = String(item);

      allLetters.push(...extractLetters(str));

      if (isIntegerString(str)) {
        const num = parseInt(str, 10);
        sum += num;
        if (Math.abs(num) % 2 === 0) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }
      } else if (/^[a-zA-Z]+$/.test(str)) {
        alphabets.push(str.toUpperCase());
      } else {
        special_characters.push(str);
      }
    });

    const concat_string = allLetters.reverse()
      .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
      .join("");

    res.status(200).json({
      is_success: true,
      user_id: makeUserId(FULL_NAME, DOB),
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sum),
      concat_string
    });
  } catch (err) {
    res.status(200).json({ is_success: false, message: err.message });
  }
});

// --- Export for Vercel ---
module.exports = app;

// --- Local development ---
if (require.main === module) {
  app.listen(3000, () => {
    console.log("✅ Server running on http://localhost:3000");
  });
}
