export const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Akses ditolak. Pengguna tidak terautentikasi.'
      });
    }

    const { role } = req.user;

    const hasAccess = Array.isArray(allowedRoles)
      ? allowedRoles.includes(role)
      : role === allowedRoles;

    if (!hasAccess) {
      return res.status(403).json({
        message: `Akses ditolak. Peran '${role}' tidak memiliki izin untuk mengakses resource ini.`
      });
    }

    next();
  };
};
