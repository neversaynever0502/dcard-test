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
  const forwarded = req.headers['x-forwarded-for']
  const userIp = forwarded ? forwarded.split(/, /)[0] : req.connection.remoteAddress
  console.log(userIp)

  let times = await getCacheById(userIp)
  if(!times){
    times = 1
    await client.set(userIp,times,'EX',60);
  }else{
    times = Number(times) + 1;
    await client.set(userIp,times,'KEEPTTL');
  }
  if(times>60){
    res.send('Error')
  }else{
    res.send(`${times}`)
  }
})

app.listen(3000)