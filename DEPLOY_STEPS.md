# DEPLOY PE VERCEL - Pași Compleți

## ✅ PAS 1: Turso Database (FĂ ACUM!)

1. **Mergi pe:** https://turso.tech
2. **Sign up** (cu GitHub sau email)
3. **Click "Create Database"**
4. **Nume:** `vita-fit`
5. **Location:** **AWS EU West (Ireland)** ← ALEGE ASTA!
6. **Click "Create"**
7. **COPIAZĂ connection string-ul** (va arăta: `libsql://vita-fit-username.turso.io`)
8. **SALVEAZĂ-L** - îl vei folosi la pasul 4!

---

## ✅ PAS 2: Login Vercel (FĂ ACUM!)

1. **Deschide CMD/PowerShell** în folderul proiectului
2. **Rulează:** `vercel login`
3. **Apasă ENTER** când zice "Press [ENTER] to open browser"
4. **Login în browser** (cu GitHub sau email)
5. **Revino în CMD** - va zice "Success!"

---

## ✅ PAS 3: Deploy pe Vercel

1. **În CMD, rulează:** `vercel`
2. **Răspunde la întrebări:**
   - `Set up and deploy?` → **Y** (Yes)
   - `Which scope?` → **Alege contul tău**
   - `Link to existing project?` → **N** (No)
   - `Project name?` → **vita-fit** (sau apasă ENTER pentru default)
   - `Directory?` → **.** (punct, apoi ENTER)
   - `Override settings?` → **N** (No)

3. **Așteaptă** până se termină build-ul (2-5 minute)

4. **COPIAZĂ URL-ul** care apare la final (ex: `https://vita-fit.vercel.app`)

---

## ✅ PAS 4: Configurează Environment Variables

1. **Mergi pe:** https://vercel.com
2. **Click pe proiectul tău** (vita-fit)
3. **Settings** (meniu stânga)
4. **Environment Variables** (sub Settings)
5. **Adaugă următoarele:**

### Variable 1:
- **Key:** `DATABASE_URL`
- **Value:** Connection string-ul de la Turso (ex: `libsql://vita-fit-username.turso.io`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 2:
- **Key:** `AUTH_SECRET`
- **Value:** Generează un secret: https://generate-secret.vercel.app/32
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 3:
- **Key:** `AUTH_URL`
- **Value:** URL-ul tău de la Vercel (ex: `https://vita-fit.vercel.app`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 4:
- **Key:** `AUTH_TRUST_HOST`
- **Value:** `true`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 5:
- **Key:** `NEXT_PUBLIC_APP_URL`
- **Value:** URL-ul tău de la Vercel (ex: `https://vita-fit.vercel.app`)
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

6. **Click "Save"** pentru fiecare

---

## ✅ PAS 5: Redeploy (după environment variables)

1. **În Vercel Dashboard**, click pe **"Deployments"**
2. **Click pe ultimul deployment** (cel mai recent)
3. **Click pe "..." (3 puncte)** → **"Redeploy"**
4. **Așteaptă** până se termină (1-2 minute)

---

## ✅ PAS 6: Actualizează Make.com

1. **Mergi în Make.com** → Scenariul tău
2. **Click pe modulul "HTTP Request"** (cel care trimite înapoi)
3. **URL:** `https://vita-fit.vercel.app/api/plans/from-make` (înlocuiește cu URL-ul tău real)
4. **Method:** `POST`
5. **Body type:** `Raw`
6. **Content-Type:** `application/json`
7. **Body:** JSON-ul cu datele (caloriesTarget, proteinTargetG, etc.)
8. **Save**

---

## ✅ GATA! Testează:

1. **Mergi pe:** `https://vita-fit.vercel.app`
2. **Completează assessment-ul**
3. **Verifică dacă planul se generează!**

---

## 🆘 Dacă ceva nu merge:

- **Database errors:** Verifică că `DATABASE_URL` e corect în Vercel
- **Auth errors:** Verifică că `AUTH_SECRET` și `AUTH_URL` sunt setate
- **Make.com errors:** Verifică că URL-ul din Make.com e corect (cu `https://`)

