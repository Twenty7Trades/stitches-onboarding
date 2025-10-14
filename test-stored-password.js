const bcrypt = require('bcryptjs');

async function testStoredPassword() {
  const password = 'Stitches123';
  const storedHash = '$2b$12$svvk52lI1K16y27dFmMU1ujhGujXKnmZnhZrttmEABLz1.dxncyGa';
  
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('Stored password valid:', isValid);
  
  // Also test with a fresh hash
  const newHash = await bcrypt.hash(password, 12);
  const newValid = await bcrypt.compare(password, newHash);
  console.log('New password valid:', newValid);
}

testStoredPassword().catch(console.error);
