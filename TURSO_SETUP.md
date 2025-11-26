# Setup Turso - Pas cu Pas

## Pas 1: Creează cont Turso
1. Deschide browser-ul
2. Mergi pe: https://turso.tech
3. Click pe "Sign Up" (colțul dreapta sus)
4. Sign up cu GitHub sau email
5. Confirmă email-ul dacă e necesar

## Pas 2: Creează Database
1. După login, click pe "Create Database" (buton mare verde/albastru)
2. Nume database: `vita-fit` (sau ce vrei tu)
3. Region: Alege cel mai apropiat (ex: `iad` pentru US East)
4. Click "Create"
5. Așteaptă 10-20 secunde până se creează

## Pas 3: Obține Connection String
1. După ce database-ul e creat, vei vedea o pagină cu detalii
2. Caută secțiunea "Connection String" sau "Connect"
3. Va arăta ceva de genul: `libsql://vita-fit-username.turso.io`
4. Click pe "Copy" sau copiază manual
5. **SALVEAZĂ-L UNDEVA** - îl vei folosi la pasul următor!

## Pas 4: Creează Auth Token (dacă e necesar)
1. Dacă vezi "Auth Token", click pe "Create Token"
2. Copiază token-ul
3. Connection string complet va fi: `libsql://vita-fit-username.turso.io?authToken=your-token`

## IMPORTANT:
- Connection string-ul arată așa: `libsql://vita-fit-username.turso.io`
- Sau cu token: `libsql://vita-fit-username.turso.io?authToken=abc123...`
- **COPIAZĂ-L COMPLET** - îl vei folosi în Vercel!

