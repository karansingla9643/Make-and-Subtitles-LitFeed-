const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: ''
});

async function textGenerated(userText) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: userText }],
        model: "gpt-4o",
    });

    return completion.choices[0].message.content;
}
function extractSrtContent(srtContent) {
    // Split the content by lines
    const lines = srtContent.split('\n');
    // Find the index where '1' appears
    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === '1') {
            startIndex = i;
            break;
        }
    }
    // Return the remaining content from the point where '1' is found
    if (startIndex !== -1) {
        return lines.slice(startIndex).join('\n');
    } else {
        return "Subtitle sequence starting with '1' not found.";
    }
}

const inputVideo = './video.mp4'
const outputVideo = './outputvideo.mp4'
const subtitlesPath = './subtitles.srt'


async function addData(videoPath, subtitlesPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .outputOptions('-vf', `subtitles=${subtitlesPath}`)
            .save(outputPath)
            .on('end', () => {
                console.log('Subtitles added successfully!');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error adding subtitles:', err);
                reject(err);
            });
    });
}
async function mainFunction(data) {
    const user = data;
    const textGenerate = await textGenerated(`Give me just only nothing other than that  1 srt file : make a srt file content for abput 5 second telling cat is cute and welcoming ${user}`)
    const subtitleContent = await extractSrtContent(textGenerate);
    fs.writeFileSync('subtitles.srt', subtitleContent);
    await addData(inputVideo, subtitlesPath, outputVideo);

}
mainFunction('Karan')
module.exports = { mainFunction }
