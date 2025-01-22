import Fastify from 'fastify';
import { YoutubeTranscript } from 'youtube-transcript';

const fastify = Fastify({ logger: true });
const port = process.env.PORT || 3000;

fastify.register(import('@fastify/formbody'))

fastify.get('/', async (req, res) => {
  res.header('Content-Type', 'text/html; charset=utf-8');
  return `
    <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <h1>YouTube Transcript Viewer</h1>
      <form method="post" action="/transcript" style="display: flex; flex-direction: column; gap: 10px; width: 300px;">
        <label for="videoUrl">YouTube Video URL:</label>
        <input type="text" id="videoUrl" name="videoUrl" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;" />
        <button type="submit" style="padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Get Transcript</button>
      </form>
    </div>
  `;
});

fastify.post('/transcript', async (req, res) => {
  const videoUrl = req.body.videoUrl;
  try {
    const videoId = new URL(videoUrl).searchParams.get('v');
    if (!videoId) {
      return res.send('Invalid YouTube URL');
    }
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    res.header('Content-Type', 'text/html; charset=utf-8');
    let formattedTranscript = '';
    transcript.forEach(item => {
      formattedTranscript += `<p>${item.text}</p>`;
    });
    return formattedTranscript;
  } catch (error) {
    res.header('Content-Type', 'text/html; charset=utf-8');
    return `Error fetching transcript: ${error.message}`;
  }
});

fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
