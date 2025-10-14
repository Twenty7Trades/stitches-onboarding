const bcrypt = require('bcryptjs');

async function testStoredHash() {
  const password = 'Stitches123';
  const storedHash = '$2b$12$svvk52lI1K16y27dFmMU1ujhGujXKnmZnhZrttmEABLz1.dxncyGa';
  
  console.log('Testing password:', password);
  console.log('Against hash:', storedHash);
  
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('Password valid:', isValid);
  
  if (!isValid) {
    console.log('Let me try with different variations...');
    
    // Try with different case
    const isValid2 = await bcrypt.compare(password.toLowerCase(), storedHash);
    console.log('Password (lowercase) valid:', isValid2);
    
    const isValid3 = await bcrypt.compare(password.toUpperCase(), storedHash);
    console.log('Password (uppercase) valid:', isValid3);
    
    // Try with extra spaces
    const isValid4 = await bcrypt.compare(password + ' ', storedHash);
    console.log('Password (with space) valid:', isValid4);
    
    const isValid5 = await bcrypt.compare(' ' + password, storedHash);
    console.log('Password (space before) valid:', isValid5);
  }
}

testStoredHash().catch(console.error);
