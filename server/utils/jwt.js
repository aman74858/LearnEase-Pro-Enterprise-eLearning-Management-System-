import jwt from 'jsonwebtoken';

export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    role: user.role,
    email: user.email,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET || 'learnease_pro_super_secret_jwt_key_2026_xyz123',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'learnease_pro_refresh_token_secret_456abc',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  );

  return { accessToken, refreshToken };
};

export const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const { accessToken, refreshToken } = generateTokens(user);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.cookie('token', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const userSafe = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    headline: user.headline,
    bio: user.bio,
    themePreference: user.themePreference || 'light',
    isApprovedInstructor: user.isApprovedInstructor,
  };

  res.status(statusCode).json({
    success: true,
    message,
    token: accessToken,
    refreshToken,
    user: userSafe,
  });
};

