const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

// 啟用跨域資源共用
app.use(cors());

// 解析 HTTP 請求的 body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login/oauth/access_token', async (req, res) => {
    const { client_id, client_secret, code } = req.body;
    const response = await axios.post('https://github.com/login/oauth/access_token', {
      client_id,
      client_secret,
      code
    }, {
      headers: {
        accept: 'application/json'
      }
    });
    res.send(response.data);
});

app.post('/user', async (req, res) => {
    const { token } = req.body;
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    res.send(response.data);
});

app.post('/repos', async (req, res) => {
    const { token, owner } = req.body;
    const response = await axios.get(`https://api.github.com/users/${owner}/repos`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
    });
    res.send(response.data);
});

app.post('/close', async (req, res) => {
    const { token, owner, repo, issue_number } = req.body;
    const response =  axios.patch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
        state: 'closed',
      }, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });
    res.send(response.data);
});

app.post('/updateState', async (req, res) => {
    const { token, owner, repo, issue_number, labels } = req.body;
    const response =  await axios.patch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
        labels,
      }, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });
    res.send(response.data);
});

app.post('/createIssue', async (req, res) => {
    const { token, owner, repo, title, body, labels } = req.body;
    const response =  await axios.post(`https://api.github.com/repos/${owner}/${repo}/issues`,{
          title,
          body,
          labels
        },
        {
          headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );
    res.send(response.data);
});

app.post('/updateIssue', async (req, res) => {
    const { token, owner, repo, title, body, issue_number } = req.body;
    const response =  axios.patch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
        title,
        body
      }, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28',
        }
      });
    res.send(response.data);
});

app.post('/issue', async (req, res) => {
    const { token, owner, repo, issue_number } = req.body;
    const response =  await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28', 
        }
    })
    res.send(response.data);
});

app.post('/issues', async (req, res) => {
    const { token, owner, repo, per_page, page, labelsQuery, orderQuery, searchKey } = req.body;
    const response =  await axios.get(`https://api.github.com/search/issues?per_page=${per_page}&page=${page}&q=state:open+label:${labelsQuery}+sort:created-${orderQuery}+${searchKey} in:title,body+repo:${owner}/${repo}+type:issue&timestamp=${Date.now()}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28', 
        }
    })
    res.send(response.data);
});

// 處理 GET 請求的路由
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 啟動伺服器，監聽特定的 port
app.listen(5000, () => {
  console.log('App listening on port 5000!');
});
