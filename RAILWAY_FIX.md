# Fix para Railway Build Error

## Problema
Railway falla con: `The path '/rails/core' does not exist` durante `bundle install`

## Causa
Los engines locales (`core` y `admin`) no están disponibles cuando Bundler intenta instalarlos porque se copian después de ejecutar `bundle install`.

## Solución Aplicada

1. **Dockerfile actualizado**: Los engines se copian ANTES de `bundle install`
2. **railway.json**: Configurado para usar Dockerfile en lugar de Nixpacks

## Pasos para Aplicar el Fix

1. **Asegúrate de que los cambios estén commitados y pusheados:**
   ```bash
   git add Dockerfile railway.json .dockerignore
   git commit -m "Fix Railway build: copy engines before bundle install"
   git push origin main
   ```

2. **En Railway:**
   - Ve a tu proyecto
   - Haz clic en "Settings" → "Deploy"
   - Verifica que "Build Command" esté vacío (Railway usará el Dockerfile)
   - Haz clic en "Redeploy" o espera a que Railway detecte el nuevo commit

3. **Si el problema persiste:**
   - Verifica que Railway esté usando el Dockerfile (no Nixpacks)
   - En Railway → Settings → Deploy → Builder, debería decir "Dockerfile"
   - Si dice "Nixpacks", cambia a "Dockerfile"

## Verificación

Después del deploy, verifica en los logs que:
1. Los engines se copian correctamente:
   ```
   COPY core ./core
   COPY admin ./admin
   ```
2. `bundle install` se ejecuta sin errores
3. Los engines se encuentran correctamente

## Notas

- El Dockerfile ahora copia los engines en las líneas 46-47, ANTES de ejecutar `bundle install` (línea 48)
- Esto asegura que Bundler pueda encontrar los gems locales cuando los necesita

