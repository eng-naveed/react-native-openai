const cors = require('cors');
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json());
app.use('/', express.static(__dirname + '/frontend'));

app.post('/openai', async (req, res) => {
    const { prompt, isImage = false } = req.body;
    if (!prompt) {
        return res.status(400).send({ error: 'Prompt is missing in the request' });
    }

    try {
        if (isImage) {
            const result = await openai.createImage({
                prompt,
                size: '512x512',
                response_format: 'url',
            });
            return res.send(result.data.data[0].url);
        }
        const completion = await openai.createCompletion({
            model: !isImage ? "text-davinci-003" : 'code-davinci-002',
            prompt: `Please reply below question in markdown format.\n ${prompt}`,
            max_tokens: !isImage ? 4000 : 8000
        });
        return res.send(completion.data.choices[0].text);
    } catch (error) {
        const errorMsg = error.response ? error.response.data.error : `${error}`;
        console.error(errorMsg);
        return res.status(500).send(errorMsg);
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Listening on port ${port}`));
