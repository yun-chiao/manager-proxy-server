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
  try {
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

    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/user', async (req, res) => {
    try{
      const { token } = req.body;
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });

      // If the response is 2xx，send to the client directly.
      if (response.status >= 200 && response.status < 300) {
        res.send(response.data);
      } else {
        // If the response is not 2xx，send error to the client.
        res.status(response.status).send(response.statusText);
      }
    } catch (error) {
      // If the response error，send error to the client.
      console.error(error);
      res.status(500).send('Server Error');
    }
});

app.post('/repos', async (req, res) => {
  try{
    const { token } = req.body;
    const response = await axios.get(`https://api.github.com/user/repos`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/close', async (req, res) => {
  try{
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

    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/updateState', async (req, res) => {
  try{
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
    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/createIssue', async (req, res) => {
  try{
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
    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/updateIssue', async (req, res) => {
  try{
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
    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/issue', async (req, res) => {
  try{
    const { token, owner, repo, issue_number } = req.body;
    const response =  await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues/${issue_number}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28', 
        }
    })
    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.post('/issues', async (req, res) => {
  try{
    const { token, owner, repo, per_page, page, labelsQuery, orderQuery, searchKey } = req.body;
    const response =  await axios.get(`https://api.github.com/search/issues?per_page=${per_page}&page=${page}&q=state:open ${labelsQuery}+sort:created-${orderQuery}+${searchKey} in:title,body+repo:${owner}/${repo}+type:issue&timestamp=${Date.now()}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'X-GitHub-Api-Version': '2022-11-28', 
        }
    })
    // If the response is 2xx，send to the client directly.
    if (response.status >= 200 && response.status < 300) {
      res.send(response.data);
    } else {
      // If the response is not 2xx，send error to the client.
      res.status(response.status).send(response.statusText);
    }
  } catch (error) {
    // If the response error，send error to the client.
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// 處理 GET 請求的路由
app.get('/', (req, res) => {
  res.send('This is the proxy server between GitHub API and github-issue-manager.');
});

// 啟動伺服器，監聽特定的 port
app.listen(process.env.PORT || 5000, () => {
  console.log('App listening on port 5000!');
});
