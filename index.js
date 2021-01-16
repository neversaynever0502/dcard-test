const express = require('express')
const redis = require('redis');
require('dotenv').config()

const client = redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
);
client.auth(process.env.REDIS_PASSWORD);

client.on('connect', () => {
  console.log('Redis client connected');
});

const app = express()

function getCacheById(key) {
  return new Promise((resv, rej) => {
    client.get(key, (err, reply) => {
      resv(reply);
    });
  })
}

app.get('/',async function(req,res){
  // 確認user ip
  const forwarded = req.headers['x-forwarded-for']
  const userIp = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress

  // 取得目前user打的次數
  let times = await getCacheById(userIp)
  if(!times){
    // 若目前沒有次數，則新增一筆1次，並且設定expire time為60秒
    times = 1
    await client.set(userIp,times,'EX',60);
  }else{
    // 若有次數，則增加1次，並且KEEPTTL保持原本的expire time
    // times = Number(times) + 1;
    // await client.set(userIp,times,'KEEPTTL');

    // Avoid race-condition and will not reset ttl.
    await client.incr(userIp)
  }
  if(times>60){
    // 若次數大於60次，顯示error
    res.send('Error')
  }else{
    // 若次數小於等於60次，顯示次數
    res.send(`${times}`)
  }
})


app.listen(3000,function(){
  console.log('Server is listen on port 3000.')
})