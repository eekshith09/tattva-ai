const http = require('http');

const PYTHON_BASE_URL = process.env.PYTHON_AI_BASE_URL || 'http://127.0.0.1:8000';

function forwardToPythonSummarizeText(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${PYTHON_BASE_URL}/summarize/text`);

    const data = JSON.stringify(payload);

    const req = http.request(
      url,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (response) => {
        let raw = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          raw += chunk;
        });
        response.on('end', () => {
          try {
            const json = raw ? JSON.parse(raw) : {};
            resolve({ statusCode: response.statusCode, json });
          } catch (e) {
            reject(e);
          }
        });
      }
    );

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const textSummary = async (req, res) => {
  // Do not change API contract/path. Expect { text: '...' }.
  const payload = req.body || {};

  try {
    const { json } = await forwardToPythonSummarizeText(payload);
    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Python summarization service error',
      error: String(err && err.message ? err.message : err),
    });
  }
};

const youtubeSummary = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Endpoint created. AI implementation pending.',
  });
};

module.exports = {
  textSummary,
  youtubeSummary,
};


