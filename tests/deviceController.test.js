const assert = require('assert');
const path = require('path');

const FakeDevice = {
  findCalls: [],
  async find(query) { this.findCalls.push(query); return [{_id:'1'}]; },
  async findById(id) { this.lastFindById = id; return { _id: id }; },
  async create(data) { this.created = data; return data; },
  async findByIdAndUpdate(id, data) { this.updated = {id, data}; return { _id:id }; },
};

const FakeSensorWidget = {
  async create(data) { FakeSensorWidget.created = data; return data; },
  async findOneAndUpdate(query, update) { this.updated = {query, update}; return { device_id: query.device_id }; },
};

const deviceModelPath = path.join(__dirname, '..', 'models', 'deviceModel.js');
const widgetModelPath = path.join(__dirname, '..', 'models', 'sensorWidgetModel.js');
require.cache[deviceModelPath] = { exports: FakeDevice };
require.cache[widgetModelPath] = { exports: FakeSensorWidget };

const {
  getDevices,
  getDevice,
  getDeviceUser,
  createDevice,
  updateDevice,
  deleteDevice
} = require('../controllers/deviceController');

function mockRes() {
  return {
    statusCode: 0,
    data: null,
    status(code){ this.statusCode = code; return this; },
    json(payload){ this.data = payload; }
  };
}

async function run() {
  // getDevices
  let req = {}; let res = mockRes();
  await getDevices(req,res);
  assert.deepStrictEqual(FakeDevice.findCalls[0], { status: 'A' });
  assert.strictEqual(res.statusCode,200);

  // getDevice
  req = { params:{id:'dev1'} }; res = mockRes();
  await getDevice(req,res);
  assert.strictEqual(FakeDevice.lastFindById,'dev1');
  assert.strictEqual(res.statusCode,200);

  // getDeviceUser
  req = { params:{user_id:'u1'} }; res = mockRes();
  await getDeviceUser(req,res);
  assert.deepStrictEqual(FakeDevice.findCalls[1], { user_id:'u1', status:'A' });
  assert.strictEqual(res.statusCode,200);

  // createDevice
  req = { body:{ device_id:'d1', name:'n', user_id:'u1' } }; res = mockRes();
  await createDevice(req,res);
  assert.deepStrictEqual(FakeDevice.created, { device_id:'d1', name:'n', user_id:'u1', status:'A' });
  assert.deepStrictEqual(FakeSensorWidget.created, { device_id:'d1' });
  assert.strictEqual(res.statusCode,200);

  // updateDevice
  req = { params:{id:'d1'}, body:{ name:'new' } }; res = mockRes();
  await updateDevice(req,res);
  assert.deepStrictEqual(FakeDevice.updated,{id:'d1', data:{ name:'new' }});
  assert.strictEqual(res.statusCode,200);

  // deleteDevice
  req = { params:{id:'d2'} }; res = mockRes();
  await deleteDevice(req,res);
  assert.deepStrictEqual(FakeDevice.updated,{id:'d2', data:{ status:'D' }});
  assert.strictEqual(res.statusCode,200);

  console.log('deviceController tests passed');
}

run().catch(err => { console.error(err); process.exit(1); });
