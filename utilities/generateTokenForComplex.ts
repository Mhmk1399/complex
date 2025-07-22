import jwt from 'jsonwebtoken';
import connect from '@/lib/data';
import users from '@/models/users';
export async function generateTokenForComplex(DiskUrl: string): Promise<string> {
  try {
     const DiskUrlParts = DiskUrl.split('/');
     const storeId = DiskUrlParts[DiskUrlParts.length - 1];

    await connect();
    console.log('MongoDB connected successfully');

    const user = await users.findOne({ storeId: storeId.trim() });
    
    if (!user) {
      console.error('No user found with storeId:', storeId.trim());
      
      // Optional: List all users to help debug
      const allUsers = await users.find({});
      console.log('All users:', allUsers);
      
      throw new Error(`No user found with storeId: ${storeId.trim()}`);
    }

    console.log('Found user:', user);

    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign({ storeId: storeId.trim(), user }, SECRET_KEY, {
      expiresIn: '30d'
    });

    return token;
  } catch (error) {
    console.error('Comprehensive error in token generation:', error);
    throw error;
  }
}
