const assert = require('assert');
const path = require('path');

const FakeUser = {
  async find(query){ FakeUser.lastFind = query; return [{ _id:'1' }]; },
  async findById(id){ FakeUser.lastFindById = id; return { _id:id }; }
};

const userModelPath = path.join(__dirname,'..','src/models','userModel.js');
require.cache[userModelPath] = { exports: FakeUser };

const { getUsers, getUser } = require('../src/controllers/userController');

function resMock(){ return { statusCode:0,data:null,status(c){this.statusCode=c;return this;},json(d){this.data=d;} }; }

(async ()=>{
  let res=resMock();
  await getUsers({},res);
  assert.deepStrictEqual(FakeUser.lastFind,{ status:'A' });
  assert.strictEqual(res.statusCode,200);

  res=resMock();
  await getUser({ params:{ id:'u1' } },res);
  assert.strictEqual(FakeUser.lastFindById,'u1');
  assert.strictEqual(res.statusCode,200);
  console.log('user get tests passed');
})().catch(err=>{ console.error(err); process.exit(1); });
