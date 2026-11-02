#!/usr/bin/env node
/**
 * Bootstrap de BD para Docker Compose.
 * - Si la BD está vacía: ejecuta 000_setup_completo.sql
 * - Luego aplica migraciones incrementales posteriores al setup maestro
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

require('dotenv').config({ path: '.env' });

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'proyecto_novedades',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };
}

const pool = new Pool(buildPoolConfig());

const MIGRACIONES_INCREMENTALES = [
  '010_tabla_notificaciones_hibrida.sql',
  '011_login_google_y_campos_estudiante.sql',
  '012_seed_usuarios_google_institucional.sql',
];

async function esperarPostgres(intentos = 30, pausaMs = 2000) {
  for (let i = 1; i <= intentos; i += 1) {
    try {
      await pool.query('SELECT 1');
      console.log('✓ PostgreSQL disponible');
      return;
    } catch (error) {
      console.log(`⏳ Esperando PostgreSQL (${i}/${intentos})…`);
      await new Promise((resolve) => setTimeout(resolve, pausaMs));
    }
  }
  throw new Error('PostgreSQL no respondió a tiempo');
}

async function existeEsquemaBase() {
  const { rows } = await pool.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = 'usuarios'
    ) AS ok
  `);
  return Boolean(rows[0]?.ok);
}

async function ejecutarArchivo(nombreArchivo) {
  const ruta = path.join(__dirname, '..', 'migrations', nombreArchivo);
  if (!fs.existsSync(ruta)) {
    console.log(`⊘ Migración no encontrada (omitida): ${nombreArchivo}`);
    return;
  }

  const sql = fs.readFileSync(ruta, 'utf8');
  if (!sql.trim()) {
    console.log(`⊘ Archivo vacío: ${nombreArchivo}`);
    return;
  }

  console.log(`⏳ Ejecutando: ${nombreArchivo}`);
  await pool.query(sql);
  console.log(`✓ Completado: ${nombreArchivo}`);
}

async function main() {
  try {
    await esperarPostgres();

    const yaInicializada = await existeEsquemaBase();
    if (!yaInicializada) {
      await ejecutarArchivo('000_setup_completo.sql');
    } else {
      console.log('ℹ Esquema base detectado — se omite 000_setup_completo.sql');
    }

    for (const archivo of MIGRACIONES_INCREMENTALES) {
      try {
        await ejecutarArchivo(archivo);
      } catch (error) {
        console.warn(`⚠ ${archivo}: ${error.message} (continuando)`);
      }
    }

    console.log('\n✓ Bootstrap de base de datos finalizado\n');
  } catch (error) {
    console.error('✗ Bootstrap de BD falló:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
