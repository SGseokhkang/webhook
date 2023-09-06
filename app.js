const axios = require("axios");
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.json());  // JSON 파싱 미들웨어 추가

let latestComment = "No comments yet.";

// 웹훅 엔드포인트 설정
app.post('/webhook-ppool', (req, res) => {
  const passcode = req.headers['x-figma-passcode'];
  console.log('Received passcode:', passcode);
  if (passcode === 'ppool12345') {
    // 웹훅 로직 처리
    console.log('Received Figma event:', req.body);
    if (req.body && req.body.comment) {
      // 코멘트를 하나의 문자열로 합칩니다.
      latestComment = req.body.comment.map(item => item.text || `[Mention: ${item.mention}]`).join(' ');
    } else {
      latestComment = "No comment data found.";
    }
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});


// 웹 페이지 라우팅
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 웹 페이지에서 사용할 최신 코멘트를 제공하는 API
app.get('/webhook-ppool', (req, res) => {
  res.json({ comment: latestComment});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
