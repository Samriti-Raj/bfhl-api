const express = require("express");
const app = express();
app.use(express.json());

// --- Config ---
const FULL_NAME = "samriti raj"; 
const DOB = "04062004";          
const EMAIL = "samritiraj4@gmail.com";
const ROLL_NUMBER = "22bcb7095";

// --- Helper functions ---
function makeUserId(fullName, dob) {
  return `${fullName.replace(/\s+/g, "_")}_${dob}`;
}

function isNumericString(s) {
  return /^\d+$/.test(s);
}

function isAlphabetString(s) {
  return /^[a-zA-Z]+$/.test(s);
}

// --- POST Route (Only route required per question paper) ---
app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) {
      return res.status(200).json({ is_success: false });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let allAlphabets = [];

    data.forEach(item => {
      const str = String(item);

      if (isNumericString(str)) {
        const num = parseInt(str, 10);
        sum += num;
        if (num % 2 === 0) {
          even_numbers.push(str); // Keep as string
        } else {
          odd_numbers.push(str);  // Keep as string
        }
      } else if (isAlphabetString(str)) {
        alphabets.push(str.toUpperCase());
        // Collect all individual letters for concatenation
        allAlphabets.push(...str.split(''));
      } else {
        special_characters.push(str);
        // Also collect letters from special character strings
        const letters = str.split('').filter(ch => /[a-zA-Z]/.test(ch));
        allAlphabets.push(...letters);
      }
    });

    // Concatenation logic: reverse order, alternating caps
    const concat_string = allAlphabets
      .reverse()
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
      sum: String(sum), // Return as string per requirements
      concat_string
    });
  } catch (err) {
    res.status(200).json({ is_success: false });
  }
});

// --- Optional root route for testing (remove if not needed) ---
app.get("/", (req, res) => {
  res.json({
    message: "BFHL API - Use POST /bfhl with data array",
    example: {
      method: "POST",
      url: "/bfhl",
      body: { "data": ["a","1","334","4","R", "$"] }
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