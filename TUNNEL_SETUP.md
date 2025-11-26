# Setup Cloudflared Tunnel pentru Make.com

## Problema
Make.com nu poate apela `localhost:3000` pentru că localhost-ul tău nu este accesibil din internet.

## Soluția: Cloudflared Tunnel

Cloudflared expune localhost-ul tău printr-un URL public, astfel încât Make.com să poată apela serverul tău.

### Pas 1: Instalează Cloudflared

**Windows (PowerShell ca Administrator):**
```powershell
# Download cloudflared
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "$env:USERPROFILE\cloudflared.exe"

# Adaugă la PATH (opțional, dar recomandat)
$env:Path += ";$env:USERPROFILE"
```

**Sau folosește winget:**
```powershell
winget install --id Cloudflare.cloudflared
```

**Sau descarcă manual:**
- Mergi la: https://github.com/cloudflare/cloudflared/releases
- Descarcă `cloudflared-windows-amd64.exe`
- Pune-l într-un folder din PATH sau rulează-l direct

### Pas 2: Pornește Tunnel-ul

**Opțiunea 1: Script automat (recomandat)**
```powershell
npm run dev:tunnel
```

**Opțiunea 2: Manual în terminal separat**
```powershell
# Terminal 1: Pornește Next.js
npm run dev

# Terminal 2: Pornește cloudflared
cloudflared tunnel --url http://localhost:3000
```

### Pas 3: Copiază URL-ul Public

După ce pornești cloudflared, vei vedea ceva de genul:
```
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take a minute to be reachable):  |
|  https://random-subdomain.trycloudflare.com                                                |
+--------------------------------------------------------------------------------------------+
```

**COPIAZĂ ACEST URL!**

### Pas 4: Setează Environment Variable

Creează/editează `.env.local` și adaugă:
```env
NEXT_PUBLIC_APP_URL=https://random-subdomain.trycloudflare.com
```

**IMPORTANT:** Înlocuiește `https://random-subdomain.trycloudflare.com` cu URL-ul real de la cloudflared!

### Pas 5: Repornește Next.js

După ce ai setat `NEXT_PUBLIC_APP_URL`, repornește Next.js:
```powershell
npm run dev
```

### Pas 6: Verifică

1. Deschide `https://random-subdomain.trycloudflare.com` în browser
2. Ar trebui să vezi aplicația ta VitaFit
3. Make.com va putea apela `https://random-subdomain.trycloudflare.com/api/plans/from-make`

## Notă Importantă

- **URL-ul cloudflared se schimbă la fiecare restart** (dacă folosești quick tunnel)
- Dacă vrei URL permanent, trebuie să creezi un tunnel persistent (necesită cont Cloudflare)
- Pentru development, quick tunnel este suficient

## Troubleshooting

**Eroare: "cloudflared: command not found"**
- Cloudflared nu este în PATH
- Rulează direct: `.\cloudflared.exe tunnel --url http://localhost:3000` (din folderul unde l-ai descărcat)

**Make.com încă nu poate apela**
- Verifică că `NEXT_PUBLIC_APP_URL` este setat corect în `.env.local`
- Verifică că Next.js rulează pe `localhost:3000`
- Verifică că cloudflared rulează și afișează URL-ul public
- Testează manual URL-ul în browser: `https://your-tunnel-url.trycloudflare.com/api/plans/from-make` (ar trebui să returneze eroare de auth, nu 404)

