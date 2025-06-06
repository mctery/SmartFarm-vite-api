const assert = require('assert');
const path = require('path');

const FakeSensor = {
  findCalls: [],
  async find(query){ this.findCalls.push(query); return [{_id:'1'}]; },
  async findById(id){ this.lastFindById = id; return { _id:id }; },
  async create(data){ this.created = data; return data; },
  async findByIdAndUpdate(id,data){ this.updated = {id,data}; return { _id:id }; },
  async findByIdAndDelete(id){ this.deleted = id; return { _id:id }; },
};

const modelPath = path.join(__dirname,'..','models','sensorModel.js');
require.cache[modelPath] = { exports: FakeSensor };

const {
  getSensors,
  getSensor,
  getDeviceSensor,
  createSensor,
  updateSensor,
  deleteSensor
} = require('../controllers/sensorController');

function resMock(){
  return {
    statusCode:0,
    data:null,
    status(c){ this.statusCode=c; return this; },
    json(d){ this.data=d; }
  };
}

async function run(){
  let req = {}; let res = resMock();
  await getSensors(req,res);
  assert.deepStrictEqual(FakeSensor.findCalls[0],{});
  assert.strictEqual(res.statusCode,200);

  req = {params:{id:'s1'}}; res = resMock();
  await getSensor(req,res);
  assert.strictEqual(FakeSensor.lastFindById,'s1');
  assert.strictEqual(res.statusCode,200);

  req = {params:{id:'d1',type:'t1',version:'v1'}}; res = resMock();
  await getDeviceSensor(req,res);
  assert.deepStrictEqual(FakeSensor.findCalls[1],{ device_id:'d1', sensor_type:'t1', version:'v1' });

  req = {body:{ foo:'bar' }}; res = resMock();
  await createSensor(req,res);
  assert.deepStrictEqual(FakeSensor.created,{ foo:'bar' });

  req = {params:{id:'s1'}, body:{ value:1 }}; res = resMock();
  await updateSensor(req,res);
  assert.deepStrictEqual(FakeSensor.updated,{id:'s1', data:{ value:1 }});

  req = {params:{id:'s2'}}; res = resMock();
  await deleteSensor(req,res);
  assert.strictEqual(FakeSensor.deleted,'s2');

  console.log('sensorController tests passed');
}

run().catch(err=>{ console.error(err); process.exit(1); });
