
const express = require("express");
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// --- Config ---
const FULL_NAME = "samriti raj"; 
const DOB = "17091999";          
const EMAIL = "samriti@example.com";
const ROLL_NUMBER = "ABCD123";

// --- Helper functions ---
function makeUserId(fullName, dob) {
  return `${fullName.toLowerCase().replace(/\s+/g, "_")}_${dob}`;
}

function isNumericString(s) {
  return /^\d+$/.test(s);
}

function isAlphabetString(s) {
  return /^[a-zA-Z]+$/.test(s);
}

// --- POST Route ---
app.post("/bfhl", (req, res) => {
  try {
    const data = req.body.data;
    if (!Array.isArray(data)) {
      return res.status(400).json({ is_success: false });
    }

    const odd_numbers = [];
    const even_numbers = [];
    const alphabets = [];
    const special_characters = [];
    let sum = 0;
    let allAlphabetChars = [];

    data.forEach(item => {
      const str = String(item);

      if (isNumericString(str)) {
        // Handle pure numbers
        const num = parseInt(str, 10);
        sum += num;
        if (num % 2 === 0) {
          even_numbers.push(str);
        } else {
          odd_numbers.push(str);
        }
      } else if (isAlphabetString(str)) {
        // Handle pure alphabetic strings
        alphabets.push(str.toUpperCase());
        // Collect individual characters for concatenation
        allAlphabetChars.push(...str.split(''));
      } else {
        // Handle special characters and mixed strings
        special_characters.push(str);
        // Extract alphabet characters from mixed strings
        const letters = str.split('').filter(ch => /[a-zA-Z]/.test(ch));
        allAlphabetChars.push(...letters);
      }
    });

    // Concatenation: reverse all alphabet chars, then alternating case
    const concat_string = allAlphabetChars
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
      sum: String(sum),
      concat_string
    });

  } catch (err) {
    res.status(500).json({ is_success: false });
  }
});

// --- GET Route (optional for testing) ---
app.get("/", (req, res) => {
  res.json({
    message: "BFHL API - Use POST /bfhl with data array",
    author: FULL_NAME,
    endpoint: "/bfhl",
    method: "POST",
    example: {
      request: { "data": ["a","1","334","4","R", "$"] },
      response_fields: [
        "is_success", "user_id", "email", "roll_number", 
        "odd_numbers", "even_numbers", "alphabets", 
        "special_characters", "sum", "concat_string"
      ]
    }
  });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    message: "Route not found. Use POST /bfhl"
  });
});

// --- Export for Vercel ---
module.exports = app;

// --- Local development ---
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ BFHL API running on http://localhost:${PORT}`);
    console.log(`📝 Test endpoint: POST http://localhost:${PORT}/bfhl`);
  });
}