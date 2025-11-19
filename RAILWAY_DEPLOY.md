# Railway Deployment Guide

Esta guía te ayudará a desplegar la aplicación DevHub en Railway.

## 📋 Prerequisitos

1. Cuenta en [Railway.app](https://railway.app)
2. Repositorio en GitHub con el código del proyecto
3. Git configurado localmente

## 🚀 Pasos para Deploy

### 1. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app) y crea una cuenta o inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Conecta tu cuenta de GitHub y selecciona el repositorio `training_app`

### 2. Crear Servicios

Railway detectará automáticamente que es una aplicación Rails. Necesitas crear 3 servicios:

#### A. PostgreSQL Database
1. En el proyecto, haz clic en "+ New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway creará automáticamente la variable `DATABASE_URL`

#### B. Redis
1. Haz clic en "+ New"
2. Selecciona "Database" → "Add Redis"
3. Railway creará automáticamente la variable `REDIS_URL`

#### C. Web Service (Rails App)
1. Haz clic en "+ New"
2. Selecciona "GitHub Repo" → Selecciona tu repositorio
3. Railway detectará automáticamente que es Rails

### 3. Configurar Variables de Entorno

En el servicio **Web Service**, ve a la pestaña "Variables" y agrega:

#### Variables Requeridas:

```bash
RAILS_ENV=production
SECRET_KEY_BASE=dbf845ed76a2ecabcec47ecc3a96bc2d320f0321181ae1843a39e4a2762eed2f5b5bb45c75440d3117176ea41322f2af0ab91e387e54ee04f24d8a2d360358f8
RAILS_MASTER_KEY=<tu_master_key_si_usas_credentials>
```

**⚠️ IMPORTANTE:** 
- **DEBES** generar un nuevo `SECRET_KEY_BASE` para producción (el de arriba es solo un ejemplo)
- No uses el mismo SECRET_KEY_BASE de desarrollo
- **Este es un paso CRÍTICO** - sin esto la aplicación no iniciará
- Para generar uno nuevo, ejecuta: `rails secret` (en tu máquina local o en Railway console)

#### Variables Automáticas (Railway las crea automáticamente):
- `DATABASE_URL` - Se conecta automáticamente al servicio PostgreSQL
- `REDIS_URL` - Se conecta automáticamente al servicio Redis
- `PORT` - Puerto donde corre la aplicación (Railway lo asigna)

### 4. Configurar Build y Deploy

En el servicio **Web Service**, ve a "Settings":

1. **Build Command:** (Railway lo detecta automáticamente)
   ```
   bundle install && yarn install && rails assets:precompile
   ```

2. **Start Command:** (Railway usa el Procfile automáticamente)
   ```
   web: bundle exec rails server -p $PORT
   ```

3. **Health Check Path:** (Opcional)
   ```
   /up
   ```

### 5. Configurar Sidekiq Worker

Para que Sidekiq procese los background jobs:

1. En el servicio **Web Service**, ve a "Settings"
2. En "Processes", verifica que hay dos procesos:
   - `web` - Servidor Rails
   - `worker` - Sidekiq worker

Si no aparece el worker automáticamente:
1. Ve a "Settings" → "Deploy"
2. Railway debería detectar el Procfile que tiene ambos procesos

### 6. Ejecutar Migraciones

Las migraciones se ejecutarán automáticamente en el primer deploy. Si necesitas ejecutarlas manualmente:

1. Ve al servicio **Web Service**
2. Haz clic en "Deployments" → Selecciona el deployment más reciente
3. Haz clic en "View Logs"
4. Busca en los logs que las migraciones se ejecutaron correctamente

O ejecuta manualmente desde la consola de Railway:
```bash
rails db:migrate
```

### 7. Verificar Deploy

1. Una vez completado el deploy, Railway te dará una URL pública (ej: `https://tu-app.up.railway.app`)
2. Visita la URL y verifica que la aplicación funciona
3. Verifica que puedes crear usuarios, proyectos y tareas
4. Verifica que las notificaciones funcionan (crea una tarea y asígnala a un usuario)

## 🔧 Configuración Adicional

### Dominio Personalizado

1. Ve a "Settings" → "Networking"
2. Haz clic en "Generate Domain" o agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Railway

### Monitoreo

Railway proporciona métricas básicas:
- CPU y Memoria
- Logs en tiempo real
- Métricas de red

### Logs

Para ver los logs:
1. Ve al servicio **Web Service**
2. Haz clic en "Deployments" → Selecciona un deployment
3. Haz clic en "View Logs"

## 🐛 Troubleshooting

### Error: "Database connection failed"
- Verifica que el servicio PostgreSQL esté corriendo
- Verifica que `DATABASE_URL` esté configurada correctamente
- Verifica que las migraciones se hayan ejecutado

### Error: "Redis connection failed"
- Verifica que el servicio Redis esté corriendo
- Verifica que `REDIS_URL` esté configurada correctamente

### Jobs no se procesan
- Verifica que el proceso `worker` (Sidekiq) esté corriendo
- Ve a los logs del worker para ver errores
- Verifica que `REDIS_URL` esté configurada

### Assets no se cargan
- Verifica que `rails assets:precompile` se ejecutó en el build
- Verifica que `RAILS_ENV=production` esté configurada

## 📝 Notas Importantes

1. **SECRET_KEY_BASE**: Genera uno nuevo para producción, nunca uses el de desarrollo
2. **Migraciones**: Se ejecutan automáticamente en el primer deploy
3. **Sidekiq**: Asegúrate de que el proceso `worker` esté corriendo
4. **Variables de Entorno**: Railway crea automáticamente `DATABASE_URL` y `REDIS_URL` cuando conectas los servicios
5. **Logs**: Siempre revisa los logs si algo no funciona

## 🔐 Seguridad

- Nunca commitees `SECRET_KEY_BASE` o `RAILS_MASTER_KEY` al repositorio
- Usa variables de entorno para toda información sensible
- Railway encripta las variables de entorno automáticamente

## 📚 Recursos

- [Railway Documentation](https://docs.railway.app)
- [Rails on Railway](https://docs.railway.app/guides/rails)
- [Sidekiq Configuration](https://github.com/sidekiq/sidekiq/wiki/Deployment)

