# Fantasy Horse League MVP

Una plataforma de fantasy sports para carreras de caballos con moneda virtual ORO.

## 🏆 Características Principales

- **Autenticación Social**: Login con Web3Auth (Google, Facebook, etc.)
- **Sistema ORO**: Moneda virtual para participar en torneos
- **Admin Dashboard**: Panel para gestionar torneos y cargar programas PDF
- **Algoritmo de Precios**: Cálculo automático de costos virtuales basado en odds
- **Scoring 5-3-1**: Sistema de puntuación con manejo de empates
- **Responsive**: Diseño mobile-first

## 🚀 Deployment en Vercel

### 1. Preparar Variables de Entorno

En tu dashboard de Vercel, configura estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://ljmitvkzprariugolzyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=BAH_Hm_hVXz0feX-4JlL4PGglx440JZIUAS99VcBVoRziTT33IxqlqebzFXoI7IahIzNzlf8tU87aVRhbp0_GgI
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 2. Deploy Directo desde Carpeta

1. Sube la carpeta `fantasy-horse-league` a GitHub
2. Conecta el repositorio en Vercel
3. Vercel detectará automáticamente que es Next.js
4. Configura las variables de entorno
5. Deploy automático

## 🗄️ Base de Datos Supabase

### Tablas Requeridas:

```sql
-- Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'player',
  oro_balance INTEGER DEFAULT 1000,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  entry_fee INTEGER NOT NULL,
  total_budget INTEGER NOT NULL,
  is_locked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT REFERENCES users(id)
);

-- Races
CREATE TABLE races (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  race_number INTEGER NOT NULL,
  race_name TEXT NOT NULL,
  post_time TEXT NOT NULL,
  track TEXT NOT NULL
);

-- Horses
CREATE TABLE horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id UUID REFERENCES races(id),
  horse_number INTEGER NOT NULL,
  horse_name TEXT NOT NULL,
  jockey TEXT NOT NULL,
  trainer TEXT NOT NULL,
  morning_line_odds DECIMAL NOT NULL,
  virtual_cost INTEGER NOT NULL
);

-- Entries (Studs)
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  user_id TEXT REFERENCES users(id),
  stud_name TEXT NOT NULL,
  total_cost INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entry Horses (Many-to-Many)
CREATE TABLE entry_horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id),
  horse_id UUID REFERENCES horses(id)
);

-- Results
CREATE TABLE results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race_id UUID REFERENCES races(id),
  first_place_horses INTEGER[],
  second_place_horses INTEGER[],
  third_place_horses INTEGER[],
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard
CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  user_id TEXT REFERENCES users(id),
  entry_id UUID REFERENCES entries(id),
  total_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🎮 Uso de la Aplicación

### Para Jugadores:
1. **Registro**: Login social con Web3Auth
2. **Explorar**: Ver torneos disponibles
3. **Unirse**: Pagar entrada con ORO
4. **Construir**: Crear "Establo" dentro del presupuesto
5. **Competir**: Ver resultados en tiempo real

### Para Administradores:
1. **Acceder**: `/admin` 
2. **Subir PDF**: Programa de carreras
3. **Validar**: Revisar datos extraídos
4. **Calcular**: Precios automáticos por algoritmo
5. **Gestionar**: Bloquear/desbloquear torneos
6. **Resultados**: Ingresar ganadores con manejo de empates

## 🎨 Diseño

- **Tema**: Oscuro inspirado en TwinSpires
- **Colores**: Gradientes azul-cyan (#0ea5e9 → #06b6d4)
- **Acentos**: Dorado (#fbbf24 → #f59e0b)
- **Tipografía**: Sans-serif moderna
- **Responsive**: Mobile-first

## 🔧 Tech Stack

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Autenticación**: Web3Auth
- **Deployment**: Vercel
- **Styling**: Tailwind CSS + Custom gradients
