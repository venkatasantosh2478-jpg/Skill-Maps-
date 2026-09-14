# Security Specification for SkillsMap

## Data Invariants
1. A user can only write to their own `/users/{userId}` and subcollections `/users/{userId}/badges/{badgeId}`.
2. Admins (`venkatasantosh2478@gmail.com` or verified admin users in `/admins/{adminId}`) have administrative visibility and override permissions.
3. Ordinary users cannot alter their role to `admin` or modify other users' profile stats.
4. Community messages require authenticated authors matching `request.auth.uid`.

## The Dirty Dozen Payloads
1. Spoofing `userId` on another user's profile write -> REJECTED (PERMISSION_DENIED).
2. Setting `role: "admin"` as an unauthorized user -> REJECTED.
3. Writing a badge directly to another user's `/users/{targetId}/badges` -> REJECTED.
4. Injecting oversized string (>2000 chars) into community message -> REJECTED.
5. Deleting another student's community message -> REJECTED.
6. Reading all users' private profile documents indiscriminately -> REJECTED.
7. Unauthenticated user writing a community message -> REJECTED.
8. Writing an invalid badge with unsupported tier -> REJECTED.
9. Modifying immortal field `createdAt` on an existing document -> REJECTED.
10. Attempting to bypass verification via non-whitelisted email -> REJECTED.
11. Injecting invalid path parameter with special symbols -> REJECTED.
12. Attempting to wipe `/admins` collection -> REJECTED.
