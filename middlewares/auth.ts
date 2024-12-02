import jwt from 'jsonwebtoken';
import User from '@/models/users';

export const roleMiddleware = (allowedRoles: string | any[]) => async (req: { headers: { authorization: string; }; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; }): any; new(): any; }; }; }, next: () => void) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
