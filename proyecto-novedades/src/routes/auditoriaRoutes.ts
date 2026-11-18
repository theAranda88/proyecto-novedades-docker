import { Router } from 'express';
import { pool } from '../config/database';
import { RolUsuario, verificarToken } from '../middlewares/authMiddleware';
import { RespuestaUtil } from '../utils/RespuestaUtil';

const router = Router();
const TAMANIO = 20;

router.get('/', verificarToken, async (req, res, next) => {
  if (req.usuario?.rol !== RolUsuario.ADMIN) {
    RespuestaUtil.error(res, 'Solo administración puede consultar la auditoría.', 403);
    return;
  }

  const { entidad, referencia, pagina = '1' } = req.query;
  if (
    (entidad !== undefined && entidad !== 'usuario' && entidad !== 'solicitud') ||
    (referencia !== undefined && (typeof referencia !== 'string' || referencia.length > 120)) ||
    typeof pagina !== 'string' || !/^[1-9]\d{0,5}$/.test(pagina)
  ) {
    RespuestaUtil.error(res, 'Los filtros de auditoría no son válidos.', 422);
    return;
  }

  try {
    const numero = Number(pagina);
    const { rows } = await pool.query(
      'SELECT id, entidad, entidad_id, referencia, accion, actor_nombre, actor_rol, ' +
      'estado_anterior, estado_nuevo, fecha FROM auditoria_eventos ' +
      'WHERE ($1::text IS NULL OR entidad = $1) ' +
      "AND ($2::text IS NULL OR POSITION(LOWER($2) IN LOWER(referencia)) > 0) " +
      'ORDER BY id DESC LIMIT $3 OFFSET $4',
      [entidad ?? null, referencia?.trim() || null, TAMANIO + 1, (numero - 1) * TAMANIO],
    );
    RespuestaUtil.exito(res, 'Auditoría consultada.', {
      eventos: rows.slice(0, TAMANIO),
      pagina: numero,
      haySiguiente: rows.length > TAMANIO,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
