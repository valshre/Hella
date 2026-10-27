const SECRET_KEY = process.env.JWT_SECRET || 'clave_secreta_hella_2026';

const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Debes iniciar sesión para realizar un pedido'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.usuario = jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'La sesión no es válida o ha expirado'
    });
  }
};