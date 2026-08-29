# ⚡ APICONVEX — Backend & REST API con Convex

Proyecto backend serverless y API REST construido sobre **Convex**, diseñado para sincronización de datos en tiempo real, ejecución de queries/mutations y procesamiento de endpoints HTTP Actions.

---

## 🌐 URLs del Proyecto Convex

- **Convex Cloud Deployment (Real-time DB / Queries / Mutations):**
  [`https://colorless-anteater-240.convex.cloud`](https://colorless-anteater-240.convex.cloud/)

- **HTTP Actions URL (REST API / Webhooks):**
  [`https://colorless-anteater-240.convex.site`](https://colorless-anteater-240.convex.site/)

---

## 📁 Estructura del Proyecto

```
apiconvex/
├── convex/
│   ├── schema.ts          # Definición del esquema de la base de datos (reflections, sessions, api_logs)
│   ├── http.ts            # Router de HTTP Actions (Endpoints REST en convex.site)
│   ├── reflections.ts     # Queries y Mutations para reflejos y datos
│   ├── sessions.ts        # Queries y Mutations de sesiones
│   ├── ai.ts              # Action de Convex para procesamiento de texto con IA
│   ├── cors.ts            # Manejador de CORS y helpers de respuesta HTTP
│   ├── tsconfig.json      # Configuración de TypeScript para Convex
│   └── _generated/        # Bindings y tipos autogenerados
├── .env.example           # Plantilla de variables de entorno
├── convex.json            # Configuración del proyecto Convex ("apiconvex")
├── package.json           # Dependencias y scripts
├── tsconfig.json          # Configuración global de TypeScript
└── README.md              # Documentación de la API
```

---

## 🗄️ Esquema de Base de Datos (`convex/schema.ts`)

### Tabla `reflections`
| Campo | Tipo | Descripción |
|---|---|---|
| `transcript` | `string` | Texto de entrada recibido |
| `reflection` | `string` | Respuesta o reflexión generada |
| `mood` | `"calm" \| "warm" \| "electric" \| "neutral"` | Clasificación de estado emocional |
| `sessionId` | `optional string` | ID de sesión asociada |
| `audioUrl` | `optional string` | Enlace al audio sintetizado (opcional) |
| `metadata` | `optional any` | Metadatos adicionales |
| `createdAt` | `number` | Marca de tiempo (milisegundos) |

### Tabla `sessions`
| Campo | Tipo | Descripción |
|---|---|---|
| `sessionId` | `string` | Identificador único de sesión |
| `status` | `"active" \| "completed"` | Estado de la sesión |
| `device` | `optional string` | Información del dispositivo o cliente |
| `reflectionsCount` | `number` | Cantidad de reflejos creados en la sesión |
| `startedAt` | `number` | Fecha de inicio |
| `lastActiveAt` | `number` | Fecha de última actividad |

### Tabla `api_logs`
| Campo | Tipo | Descripción |
|---|---|---|
| `endpoint` | `string` | Ruta consultada |
| `method` | `string` | Método HTTP |
| `status` | `number` | Código de estado HTTP |
| `timestamp` | `number` | Fecha del evento |

---

## 📡 Endpoints de la API REST (HTTP Actions)

Base URL: **`https://colorless-anteater-240.convex.site`**

### 1. Estado de Salud (Health Check)
```bash
curl -X GET https://colorless-anteater-240.convex.site/api/health
```
**Respuesta:**
```json
{
  "status": "healthy",
  "service": "Reflejo Convex API",
  "cloudUrl": "https://colorless-anteater-240.convex.cloud",
  "httpActionsUrl": "https://colorless-anteater-240.convex.site",
  "timestamp": 1740845400000,
  "version": "1.0.0"
}
```

---

### 2. Listar Registros (GET)
```bash
curl -X GET "https://colorless-anteater-240.convex.site/api/reflections?limit=10&mood=calm"
```
**Respuesta:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "k57...",
      "transcript": "La noche está tranquila y en silencio",
      "reflection": "En el silencio, la mente encuentra su propio reflejo.",
      "mood": "calm",
      "createdAt": 1740845400000
    }
  ]
}
```

---

### 3. Procesar y Generar con IA (POST)
```bash
curl -X POST https://colorless-anteater-240.convex.site/api/reflect \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "El tiempo vuela cuando estamos creando cosas nuevas",
    "sessionId": "sess_1001"
  }'
```
**Respuesta:**
```json
{
  "success": true,
  "reflection": "Crear transforma los segundos en instantes eternos.",
  "mood": "electric",
  "transcript": "El tiempo vuela cuando estamos creando cosas nuevas",
  "savedRecord": {
    "_id": "k57..."
  }
}
```

---

### 4. Crear Registro Directo (POST)
```bash
curl -X POST https://colorless-anteater-240.convex.site/api/reflections \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "Texto original",
    "reflection": "Reflexión generada externamente",
    "mood": "warm",
    "sessionId": "sess_1002"
  }'
```

---

### 5. Consultar Estadísticas y Métricas (GET)
```bash
curl -X GET https://colorless-anteater-240.convex.site/api/stats
```
**Respuesta:**
```json
{
  "success": true,
  "data": {
    "totalReflections": 25,
    "totalSessions": 5,
    "activeSessions": 2,
    "moodDistribution": {
      "calm": 8,
      "warm": 10,
      "electric": 5,
      "neutral": 2
    }
  }
}
```

---

### 6. Registrar o Iniciar Sesión (POST)
```bash
curl -X POST https://colorless-anteater-240.convex.site/api/sessions \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "sess_custom_001",
    "device": "Web Client"
  }'
```

---

## 🛠️ Comandos de Desarrollo

### Instalar dependencias
```bash
npm install
```

### Ejecutar Convex en modo desarrollo
```bash
npx convex dev
```

### Desplegar a Producción
```bash
npx convex deploy
```

### Comprobación de Tipos TypeScript
```bash
npm run typecheck
```
