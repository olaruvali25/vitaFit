# Make.com Integration Guide

Acest document explică cum să configurezi Make.com pentru a calcula TDEE/BMR și macro-uri, apoi să trimită rezultatele către VitaFit pentru generarea planului.

## Flow-ul complet

1. **Utilizatorul completează assessment-ul** pe `/assessment`
2. **VitaFit trimite datele către Make.com** webhook: `https://hook.eu2.make.com/6gf31px9yw2lv6voo7oun6h7lfym3xqa`
3. **Make.com calculează** TDEE/BMR și macro-uri bazat pe datele utilizatorului
4. **Make.com trimite rezultatele** către `/api/plans/from-make` pentru generarea planului
5. **Planul este generat automat** și apare în contul utilizatorului

## Datele trimise către Make.com

Când utilizatorul completează assessment-ul, următoarele date sunt trimise către webhook-ul Make.com:

```json
{
  "profileId": "string",
  "userId": "string",
  "email": "string",
  "name": "string",
  "age": number,
  "gender": "string",
  "weightKg": number,
  "weightLbs": number,
  "heightCm": number,
  "heightFt": "string",
  "goal": "string",
  "goalWeight": number,
  "timeline": "string",
  "activityLevel": "string",
  "workoutDays": number,
  "workoutDuration": "string",
  "mealPrepDuration": "string",
  "dietaryRestrictions": ["array", "of", "strings"],
  "foodPreferences": ["array", "of", "strings"],
  "callbackUrl": "http://localhost:3000/api/plans/from-make"
}
```

## Configurarea Make.com

### Pasul 1: Primirea datelor

1. În Make.com, creează un scenariu nou
2. Adaugă un modul **Webhook** > **Custom webhook**
3. Configurează webhook-ul să primească datele de la VitaFit
4. URL-ul webhook-ului este: `https://hook.eu2.make.com/6gf31px9yw2lv6voo7oun6h7lfym3xqa`

### Pasul 2: Calcularea TDEE/BMR și macro-urilor

Adaugă module în Make.com pentru a calcula:

- **BMR (Basal Metabolic Rate)** - folosind formula Mifflin-St Jeor sau Harris-Benedict
- **TDEE (Total Daily Energy Expenditure)** - BMR × Activity Multiplier
- **Macro-uri** bazate pe goal-ul utilizatorului:
  - **Protein**: 1.6-2.2g per kg body weight (sau % din calorii)
  - **Carbs**: % din calorii rămase
  - **Fats**: % din calorii rămase

### Pasul 3: Trimiterea rezultatelor către VitaFit

1. Adaugă un modul **HTTP** > **Make a request**
2. Configurează:
   - **URL**: `{{callbackUrl}}` (din datele primite) sau `http://localhost:3000/api/plans/from-make` pentru development
   - **Method**: `POST`
   - **Headers**: 
     ```
     Content-Type: application/json
     Authorization: Bearer {{MAKE_WEBHOOK_SECRET}} (opțional, pentru securitate)
     ```
   - **Body** (JSON):
     ```json
     {
       "profileId": "{{profileId}}",
       "days": 7,
       "caloriesTarget": {{calculatedTDEE}},
       "proteinTargetG": {{calculatedProtein}},
       "fatTargetG": {{calculatedFat}},
       "carbTargetG": {{calculatedCarbs}},
       "workoutsPerWeek": {{workoutDays}},
       "dietaryRestrictions": {{dietaryRestrictions}},
       "foodPreferences": {{foodPreferences}}
     }
     ```

## Exemple de calcule în Make.com

### BMR Calculation (Mifflin-St Jeor)

Pentru bărbați:
```
BMR = (10 × weightKg) + (6.25 × heightCm) - (5 × age) + 5
```

Pentru femei:
```
BMR = (10 × weightKg) + (6.25 × heightCm) - (5 × age) - 161
```

### TDEE Calculation

```
TDEE = BMR × Activity Multiplier

Activity Multipliers:
- Sedentary: 1.2
- Lightly Active: 1.375
- Moderately Active: 1.55
- Active: 1.725
- Very Active: 1.9
```

### Macro Calculations

**Protein** (exemplu: 30% din calorii sau 2g/kg):
```
proteinTargetG = (caloriesTarget × 0.30) / 4
sau
proteinTargetG = weightKg × 2
```

**Fat** (exemplu: 25% din calorii):
```
fatTargetG = (caloriesTarget × 0.25) / 9
```

**Carbs** (restul):
```
carbTargetG = (caloriesTarget - (proteinTargetG × 4) - (fatTargetG × 9)) / 4
```

## Securitate (Opțional)

Pentru securitate suplimentară, poți configura un secret în Make.com:

1. Setează `MAKE_WEBHOOK_SECRET` în `.env`
2. În Make.com, adaugă header-ul `Authorization: Bearer {{MAKE_WEBHOOK_SECRET}}` la request-ul către `/api/plans/from-make`

## Testing

Pentru a testa integrarea:

1. Completează assessment-ul pe `/assessment`
2. Verifică în Make.com că datele au fost primite
3. Verifică că Make.com calculează corect TDEE și macro-urile
4. Verifică că Make.com trimite datele către `/api/plans/from-make`
5. Verifică în `/account?tab=plans` că planul a fost generat

## Troubleshooting

### Make.com nu primește datele
- Verifică că URL-ul webhook-ului este corect
- Verifică că request-ul este POST cu Content-Type: application/json

### Planul nu este generat
- Verifică în logs-urile Make.com că request-ul către `/api/plans/from-make` a reușit
- Verifică că toate câmpurile necesare sunt trimise (caloriesTarget, proteinTargetG, etc.)
- Verifică că `profileId` este valid

### Eroare de autentificare
- Endpoint-ul `/api/plans/from-make` nu necesită autentificare de utilizator
- Dacă ai configurat `MAKE_WEBHOOK_SECRET`, asigură-te că este trimis în header

