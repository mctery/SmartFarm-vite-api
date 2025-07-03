const assert = require('assert');
const path = require('path');

// Mock User model
const FakeUser = {
  async findByIdAndUpdate(id, info) {
    FakeUser.lastUpdate = { id, info };
    return { _id: id };
  },
  async findById(id) {
    return { _id: id, ...(FakeUser.lastUpdate ? FakeUser.lastUpdate.info : {}) };
  },
  lastUpdate: null,
};

// Mock bcrypt
let hashCalls = 0;
const bcrypt = {
  async hash(password) {
    hashCalls++;
    return 'hashed:' + password;
  },
};

// Patch require cache before loading controller
const userModelPath = path.join(__dirname, '..', 'src/models', 'userModel.js');
require.cache[userModelPath] = { exports: FakeUser };
const bcryptPath = require.resolve('bcrypt');
require.cache[bcryptPath] = { exports: bcrypt };

const { updateUser } = require('../src/controllers/userController');

async function runUpdate(body) {
  const req = { params: { id: 'id1' }, body };
  const res = {
    statusCode: 0,
    data: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.data = data; },
  };
  let caught;
  await updateUser(req, res, err => { caught = err; });
  if (caught) throw caught;
  return { res, lastUpdate: FakeUser.lastUpdate };
}

(async () => {
  // Update with password
  hashCalls = 0;
  FakeUser.lastUpdate = null;
  await runUpdate({ first_name: 'A', password: 'secret' });
  assert.strictEqual(hashCalls, 1, 'password should be hashed');
  assert.strictEqual(FakeUser.lastUpdate.info.password, 'hashed:secret');

  // Update without password
  hashCalls = 0;
  FakeUser.lastUpdate = null;
  await runUpdate({ first_name: 'B' });
  assert.strictEqual(hashCalls, 0, 'hash should not be called');
  assert.deepStrictEqual(FakeUser.lastUpdate.info, { first_name: 'B' });

  console.log('All tests passed.');
})();
