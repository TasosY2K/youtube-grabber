const fs = require('fs');
const transliteration = require('transliteration');
const ytdl = require('ytdl-core');
const path = require('path');
const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/index.html`));
});

app.get('/download', (req, res) => {
  let url = req.query.url;
  let type = req.query.type;
  if (url && type) {
    ytdl.getInfo(url, (err, info) => {
      if (err) return res.send("error");
      res.header('Content-Disposition', `attachment; filename=${transliteration.transliterate(info.title)}.${type}`);
      res.setHeader('Content-type', 'application/x-msdownload');
      ytdl(url, {format: `${type}`}).pipe(res);
    });
  } else {
    res.send("You must provide url and type");
  }
});

app.get('/info', (req, res) => {
  let url = req.query.url;
  if (url) {
    ytdl.getInfo(url, (err, info) => {
      if (err) return res.send("error");
      res.send(info);
    });
  } else {
    res.send("No url provided");
  }
});

app.listen(3000, () => {
  console.log('Serving on port 3000');
});
