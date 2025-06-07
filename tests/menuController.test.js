const assert = require('assert');
const path = require('path');

const FakeMenu = {
  findCalls: [],
  async find(q){ this.findCalls.push(q); return [{ _id: '1' }]; },
  async findById(id){ this.lastFind = id; return { _id: id }; },
  async create(data){ this.created = data; return data; },
  async findByIdAndUpdate(id, data){ this.updated = { id, data }; return { _id: id }; }
};

const modelPath = path.join(__dirname,'..','models','menuModel.js');
require.cache[modelPath] = { exports: FakeMenu };

const { getMenus, getMenu, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');

function resMock(){ return { statusCode:0,data:null,status(c){this.statusCode=c;return this;},json(d){this.data=d;} }; }

async function run(){
  let req={}, res=resMock();
  await getMenus(req,res);
  assert.deepStrictEqual(FakeMenu.findCalls[0], { status:'A' });
  assert.strictEqual(res.statusCode,200);

  req={ params:{ id:'m1' } }; res=resMock();
  await getMenu(req,res);
  assert.strictEqual(FakeMenu.lastFind,'m1');
  assert.strictEqual(res.statusCode,200);

  req={ body:{ name:'n', path:'/x' } }; res=resMock();
  await createMenu(req,res);
  assert.deepStrictEqual(FakeMenu.created, { name:'n', path:'/x' });
  assert.strictEqual(res.statusCode,200);

  req={ params:{ id:'m2' }, body:{ name:'u' } }; res=resMock();
  await updateMenu(req,res);
  assert.deepStrictEqual(FakeMenu.updated,{ id:'m2', data:{ name:'u' } });
  assert.strictEqual(res.statusCode,200);

  req={ params:{ id:'m3' } }; res=resMock();
  await deleteMenu(req,res);
  assert.deepStrictEqual(FakeMenu.updated,{ id:'m3', data:{ status:'D' } });
  assert.strictEqual(res.statusCode,200);

  console.log('menuController tests passed');
}

run().catch(err=>{ console.error(err); process.exit(1); });
