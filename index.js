const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload()); // Middleware for file uploads
app.use(express.static(path.join(__dirname, "frontend")));

// Configure Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET 
});

// Initialize GoogleGenerativeAI client
const genAI = new GoogleGenerativeAI(process.env.G_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const oppositeTraits = {
    'male': 'female',
    'female': 'male',
    'young': 'old',
    'old': 'young',
    'girl': 'boy',
    'boy': 'girl',
    'queer': 'straight',
    'straight': 'queer',
    'evil': 'good',
    'good': 'evil',
    'weak': 'strong',
    'strong': 'weak',
    'fat': 'thin',
    'thin': 'fat',
    'happy': 'sad',
    'sad': 'happy',
    'kind': 'cruel',
    'cruel': 'kind',
    'smart': 'dumb',
    'dumb': 'smart',
    'brave': 'cowardly',
    'cowardly': 'brave',
    'human': 'alien',
    'alien': 'human',
    'rich': 'poor',
    'poor': 'rich',
    'fast': 'slow',
    'slow': 'fast',
    'loud': 'quiet',
    'quiet': 'loud',
    'clean': 'dirty',
    'dirty': 'clean',
    'organized': 'disorganized',
    'disorganized': 'organized',
    'patient': 'impatient',
    'impatient': 'patient',
    'optimistic': 'pessimistic',
    'pessimistic': 'optimistic',
    'confident': 'insecure',
    'insecure': 'confident',
    'generous': 'selfish',
    'selfish': 'generous'
};



app.post('/prompt', async (req, res) => {
    try {
        const longPrompt = req.body.prompt;
        const traits = extractKeyTraits(longPrompt);
        const { longNegativePrompt, negativePrompt } = await generatePrompts(traits,longPrompt);
        const realPrompt=traits.join(' and ');
        console.log('real',realPrompt);
        res.json({
            longNegativePrompt,
            negativePrompt,
            realPrompt
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

function extractKeyTraits(prompt) {
    const keywords = prompt.split(/\s+/).map(keyword => keyword.trim().toLowerCase());
    const traits = keywords.filter(keyword => keyword in oppositeTraits);
    return traits;
}

async function generatePrompts(traits,longPrompt) {
    const prompt = `Given the following personality traits, create a contrasting character with an opposite personality. Provide a vivid 5-line description that emphasizes this contrast and captures the essence of this new character. Retain only the original name, but describe entirely opposite traits to the provided personality: ${longPrompt}`;

     const result = await model.generateContent(prompt);
    const negativeTraits = traits.map(trait => {
        return oppositeTraits[trait] || trait; 
    });

    const negativePrompt = `${negativeTraits.join(' and ')}.`;
   const longNegativePrompt= result.response.text()
   console.log("long:",longNegativePrompt,"short",negativePrompt);
    return { longNegativePrompt, negativePrompt };
}


// Chat API
app.post("/api/chat", async (req, res) => {
    const { message, identity } = req.body;
    console.log(message,identity)
    if (!message) {
        return res.status(401).json({ error: "Prompt missing" });
    }

    try {
        const prompt = `So what I need you to do is be a character that has opposite traits of the traits given in the bracket ${identity} for the following message "${message}". Make sure to fully embrace it and reply in a text chat manner.`;
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
        res.status(200).json({ response: result.response.text() });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while generating the response." });
    }
});

// Image Upload API
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.image) {
            console.log("No image uploaded");
            return res.status(400).json({ message: "No image uploaded" });
        }
        
        const file = req.files.image;
        const toValue = req.body.toValue;
        const fromValue = req.body.fromValue;
      console.log("to;",toValue,"from:",fromValue);

        const uploadResult = await cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            public_id: file.md5
        }, (error, result) => {
            if (error) {
                console.log("Cloudinary upload error:", error);
                return res.status(500).json({ error: error.message });
            }

            const transformedUrl = cloudinary.url(result.public_id, {
                effect: `gen_replace:from_${fromValue};to_${toValue}`
            });
            res.json({ transformedUrl });
        }).end(file.data); // Send the file buffer to Cloudinary

    } catch (error) {
        console.log("Error in upload:", error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
