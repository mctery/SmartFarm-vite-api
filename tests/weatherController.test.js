const assert = require('assert');
const path = require('path');

let axiosCall = null;
const fakeAxios = {
  async get(url){ axiosCall = url; return { data:{ dt:1 } }; }
};

const axiosPath = require.resolve('axios');
require.cache[axiosPath] = { exports: { default: fakeAxios } };
process.env.OPEN_WEATHER_KEY = 'k';

const { getWeatherNow, getWeatherNowAll } = require('../controllers/weatherController');

function resMock(){ return { statusCode:0,data:null,status(c){this.statusCode=c;return this;},json(d){this.data=d;} }; }

async function run(){
  let req={ params:{ city:'bangkok' } }; let res=resMock();
  await getWeatherNow(req,res);
  assert.ok(axiosCall.includes('bangkok')); // ensure axios called
  assert.strictEqual(res.statusCode,200);
  assert.ok(res.data.new_data);

  const resAll = resMock();
  await getWeatherNowAll({},resAll);
  assert.strictEqual(resAll.statusCode,200);
  assert.ok(resAll.data.bangkok);

  console.log('weatherController tests passed');
}

run().catch(err=>{ console.error(err); process.exit(1); });
