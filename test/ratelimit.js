var should = require('should')
var fetch = require('node-fetch')
const { doesNotThrow } = require('should')

async function apiGetContinuously(times,url){
  let lastTimeResponse = ''
  for(i=0;i<=times;i++){
    // console.log(`${i}-api-get`)
    lastTimeResponse = await fetch(url)
    // console.log(`${i}-api-over`)
  }
  return lastTimeResponse
}


describe("Test rate-limit", function(){
  it("check get rate-limit", async function(){
    this.timeout(1000000);

    let res = await apiGetContinuously(5,'http://localhost:3000/')
    let resJson = await res.json()
    console.log('res:',resJson)
    // api打5次，需出現5
    resJson.should.equal(5)

    let res2 = await apiGetContinuously(61,'http://localhost:3000/')
    let res2Text = await res2.text()
    console.log('res:',res2Text)
    // api打61次，需出現Error
    res2Text.should.equal('Error')
  })

})

