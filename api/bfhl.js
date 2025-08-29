

const express = require("express");
const app = express();
app.use(express.json());

// --- Config ---
const FULL_NAME = "samriti raj"; 
const DOB = "04062004";          
const EMAIL = "samritiraj4@gmail.com";
const ROLL_NUMBER = "22bcb7095"

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

// --- GET Route (Required for BFHL challenge) ---
app.get("/bfhl", (req, res) => {
  res.status(200).json({
    operation_code: 1
  });
});

// --- POST Route ---
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

// --- Root route for testing ---
app.get("/", (req, res) => {
  res.json({
    message: "BFHL API is running",
    endpoints: {
      "GET /bfhl": "Returns operation_code: 1",
      "POST /bfhl": "Processes data array and returns categorized results"
    }
  });
});

// --- Export for Vercel ---
module.exports = app;

// --- Local development ---
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}