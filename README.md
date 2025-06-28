# Projektmanagement Dashboard – Studio Doesinger

**Stack:** Vite + React + TypeScript + Supabase

## Ziel
Modernes Dashboard für Projekte, Nutzerverwaltung, Zeitleiste, Budget. Live-CRUD via Supabase.

## Supabase-Zugang
- **URL:** https://rshorvzyxmzvdxwfdtqs.supabase.co
- **API-Key (anon):** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzaG9ydnp5eG16dmR4d2ZkdHFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2ODgzMTMsImV4cCI6MjA2NjI2NDMxM30.1Cp2Wrd71w3oBr8Djsd8LNLoE6NfJHFW2icqQnwmm40

## Features
- Projekt-CRUD (anzeigen, erstellen, editieren, löschen)
- Userverwaltung mit Rollen (Admin, Vendor, Kunde)
- Zeitplan und Budgetverwaltung (Platzhalter)
- Responsive, cleanes UI ähnlich doesinger.com

## Tabellenstruktur (Supabase)
### projects
| id | name | beschreibung | status | startdatum | enddatum | budget |
### users
| id | email | rolle | projektzuordnung | aktiv |

**Siehe Supabase für Tabellenschema und Testdaten.**

## Quickstart
```bash
git clone https://github.com/DEIN-USERNAME/project-dashboard-studio-doesinger.git
cd doezy-app
npm install
cp .env.example .env      # .env mit deinen Keys ausfüllen
npm run dev

