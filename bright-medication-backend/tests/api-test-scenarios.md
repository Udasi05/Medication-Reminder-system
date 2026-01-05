// ============================================
// FILE: tests/api-test-scenarios.md
// ============================================
# API Testing Scenarios

## 1. Authentication Flow

### Register New Caregiver
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Dr. Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "test123",
  "phoneNumber": "9876543210"
}

Expected: 201 Created with token
```

### Login
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "rajesh@example.com",
  "password": "test123"
}

Expected: 200 OK with token
Save this token for subsequent requests!
```

### Get Profile
```bash
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK with caregiver details
```

## 2. Elder Management

### Create Elder
```bash
POST http://localhost:5000/api/elders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Ramesh Sharma",
  "phoneNumber": "9111111111",
  "preferredLanguage": "hi",
  "age": 75,
  "address": "Mumbai, Maharashtra",
  "emergencyContact": "9876543210"
}

Expected: 201 Created
Save the elder ID!
```

### Get All Elders
```bash
GET http://localhost:5000/api/elders
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK with array of elders
```

### Update Elder
```bash
PUT http://localhost:5000/api/elders/ELDER_ID
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "preferredLanguage": "mr",
  "age": 76
}

Expected: 200 OK
```

## 3. Medication Management

### Create Medication (Test at current time + 2 minutes)
```bash
POST http://localhost:5000/api/medications
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test Medicine",
  "dosage": "50mg",
  "elderId": "YOUR_ELDER_ID",
  "times": ["15:30"],
  "startDate": "2025-01-02",
  "instructions": "Test medication for scheduler"
}

Expected: 201 Created
Watch console for scheduler trigger at 15:30!
```

### Get Medications for Elder
```bash
GET http://localhost:5000/api/medications/elder/ELDER_ID
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK with medications array
```

## 4. Reminder Tracking

### Get Today's Reminders
```bash
GET http://localhost:5000/api/reminders/today
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK with summary and reminders
```

### Get Adherence Stats
```bash
GET http://localhost:5000/api/reminders/stats
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK with adherence statistics
```

### Manually Confirm Medication
```bash
PUT http://localhost:5000/api/reminders/REMINDER_ID/confirm
Authorization: Bearer YOUR_TOKEN

Expected: 200 OK
```

## 5. Error Handling Tests

### Invalid Phone Number
```bash
POST http://localhost:5000/api/elders
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test Elder",
  "phoneNumber": "1234567890",
  "preferredLanguage": "hi"
}

Expected: 400 Bad Request with validation error
```

### Invalid Time Format
```bash
POST http://localhost:5000/api/medications
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Test Med",
  "dosage": "50mg",
  "elderId": "ELDER_ID",
  "times": ["25:00"]
}

Expected: 400 Bad Request
```

### Unauthorized Access
```bash
GET http://localhost:5000/api/elders
Authorization: Bearer invalid_token

Expected: 401 Unauthorized
```

## 6. Scheduler Testing

### Setup Test Medication
1. Get current time
2. Add 2 minutes to current time
3. Create medication with that time
4. Watch console logs for:
   - Voice call trigger
   - Grace period check
   - SMS escalation (if not confirmed)
   - Caregiver alert (if still not confirmed)

### Expected Console Output:
```
📞 Triggering reminder for Ramesh Sharma - Test Medicine at 15:30
📞 ========== VOICE CALL SERVICE ==========
📱 Calling: 9111111111
🌍 Language: HI
💊 Medication: Test Medicine
...
(After 15 minutes)
📱 ========== SMS SERVICE ==========
...
(After another 10 minutes)
🚨 ========== CAREGIVER ALERT ==========
```