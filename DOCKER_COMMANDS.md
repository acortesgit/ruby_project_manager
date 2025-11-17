# Comandos Docker para Desarrollo

Este proyecto usa Docker Compose para el entorno de desarrollo, incluyendo soporte para `rails_code_auditor`.

## Configuración Inicial

1. **Construir las imágenes:**
   ```bash
   docker-compose -f docker-compose.dev.yml build
   ```

2. **Levantar los servicios:**
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```

   O en segundo plano:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

## Comandos Útiles

### Desarrollo

**Iniciar servidor Rails:**
```bash
docker-compose -f docker-compose.dev.yml up web
```

**Ejecutar comandos Rails:**
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails <comando>
```

**Ejecutar migraciones:**
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:migrate
```

**Ejecutar preparar base de datos:**
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails db:prepare
```

**Abrir consola Rails:**
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails console
```

### Auditoría de Código

**Ejecutar rails_code_auditor (auditoría completa):**
```bash
docker-compose -f docker-compose.dev.yml exec web bundle exec rails_code_auditor
```

**Ver logs:**
```bash
docker-compose -f docker-compose.dev.yml logs -f web
```

**Detener servicios:**
```bash
docker-compose -f docker-compose.dev.yml down
```

**Detener y eliminar volúmenes:**
```bash
docker-compose -f docker-compose.dev.yml down -v
```

## Variables de Entorno

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
DB_PASSWORD=postgres
```

## Notas

- Los reportes de `rails_code_auditor` se generarán en el directorio `report/` dentro del proyecto
- PostgreSQL corre en el puerto `5433` (mapeado desde el puerto interno 5432)
- Redis corre en el puerto `6379`
- Rails corre en el puerto `3000`

