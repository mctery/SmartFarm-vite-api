/**
 * Migration script: seeds Menu data and creates UserMenu documents
 * for all existing users.
 *
 * Usage: node src/scripts/migrateMenus.js
 *
 * Safe to run multiple times — skips menus that already exist (by key)
 * and UserMenu docs that already exist.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const { mongoUrl } = require('../config');
const User = require('../models/userModel');
const Menu = require('../models/menuModel');
const UserMenu = require('../models/userMenuModel');

const MENU_SEED = [
  { key: 'dashboard', name: 'Dashboard', path: '/dashboard', icon: 'Home', order: 1, parent_key: null },
  { key: 'devices', name: 'Devices', path: '/farm_control_system/devices', icon: 'Devices', order: 2, parent_key: null },
  { key: 'about', name: 'About', path: '/about', icon: 'Info', order: 3, parent_key: null },
  { key: 'help', name: 'Help', path: '/help', icon: 'Help', order: 4, parent_key: null },
  { key: 'admin', name: 'Admin', path: '/admin', icon: 'AdminPanelSettings', order: 100, parent_key: null },
  { key: 'admin_users', name: 'User Management', path: '/admin/users', icon: 'People', order: 1, parent_key: 'admin' },
];

const ADMIN_ONLY_KEYS = ['admin', 'admin_users'];

async function migrate() {
  await mongoose.connect(mongoUrl);
  console.log('Connected to MongoDB');

  // 1. Seed Menu documents
  const menuMap = new Map();
  let menusCreated = 0;

  // First pass: create/find all menus
  for (const seed of MENU_SEED) {
    let menu = await Menu.findOne({ key: seed.key });
    if (!menu) {
      menu = await Menu.create({
        key: seed.key,
        name: seed.name,
        path: seed.path,
        icon: seed.icon,
        order: seed.order,
        parent_id: null,
        status: 'A',
      });
      menusCreated++;
      console.log(`  Created menu: ${seed.key}`);
    } else {
      console.log(`  Skipped (exists): ${seed.key}`);
    }
    menuMap.set(seed.key, menu);
  }

  // Second pass: set parent_id for children
  for (const seed of MENU_SEED) {
    if (seed.parent_key) {
      const parent = menuMap.get(seed.parent_key);
      const child = menuMap.get(seed.key);
      if (parent && child && !child.parent_id) {
        child.parent_id = parent._id;
        await child.save();
        console.log(`  Linked ${seed.key} -> parent ${seed.parent_key}`);
      }
    }
  }
  console.log(`Created ${menusCreated} new Menu documents`);

  // 2. Determine menu IDs
  const allMenuIds = Array.from(menuMap.values()).map(m => m._id);
  const regularMenuIds = Array.from(menuMap.entries())
    .filter(([key]) => !ADMIN_ONLY_KEYS.includes(key))
    .map(([, menu]) => menu._id);

  // 3. Create UserMenu documents for all existing active users
  const allUsers = await User.find({ status: 'A' });
  let userMenusCreated = 0;

  for (const user of allUsers) {
    const userId = String(user.user_id || user._id);
    const existing = await UserMenu.findOne({ user_id: userId });
    if (!existing) {
      const menuIds = user.role === 'admin' ? allMenuIds : regularMenuIds;
      await UserMenu.create({ user_id: userId, menu_ids: menuIds });
      userMenusCreated++;
      console.log(`  Created UserMenu for user: ${userId} (${user.role}) with ${menuIds.length} menus`);
    } else {
      console.log(`  Skipped UserMenu (exists): ${userId}`);
    }
  }
  console.log(`Created ${userMenusCreated} new UserMenu documents`);

  await mongoose.disconnect();
  console.log('Migration complete');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
