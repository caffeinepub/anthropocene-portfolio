# Anthropocene Portfolio

## Current State
Full-stack portfolio CMS with Motoko backend and React frontend. Admin dashboard at `/admin` manages lectures, students works, art portfolio, design portfolio, research items, and CV data. Authentication uses Internet Identity (II) combined with a password login. The backend uses a "first authenticated principal becomes admin" pattern — admin registration lives in canister memory and is wiped on every redeployment. This means every redeploy requires II re-authentication to re-register as admin. The frontend also gates the Add button and all save actions on `isActorReady` which depends on II being connected.

## Requested Changes (Diff)

### Add
- Token-based admin verification on every backend call: any call that provides the correct `CAFFEINE_ADMIN_TOKEN` is treated as admin, regardless of which principal made the call (anonymous or otherwise)
- New backend functions accept an extra `adminToken: Text` parameter for all write/admin operations
- `checkAdminToken` helper in backend that validates the token directly against the env var on each call

### Modify
- All admin-gated backend functions (`addLecture`, `deleteLecture`, `setLectureLive`, `listAllLectures`, `addStudentWork`, `deleteStudentWork`, `setStudentWorkLive`, `listAllStudentWorks`, `addArtItem`, `deleteArtItem`, `setArtItemLive`, `listAllArtItems`, `addDesignPortfolio`, `deleteDesignPortfolio`, `setDesignPortfolioLive`, `listAllDesignPortfolio`, `addResearchItem`, `deleteResearchItem`, `setResearchItemLive`, `listAllResearchItems`, `setCvLink`, `setCvPdf`, `setProfessionalNarrative`) — replace `checkAdmin(caller)` with `checkAdminToken(adminToken)` where `adminToken` is a new parameter passed by the frontend on every call
- `listAll*` query functions must also accept `adminToken` for verification instead of checking principal role
- Frontend `useActor` hook: pass the `caffeineAdminToken` on every admin call
- Frontend AdminDashboard: remove all `isActorReady`/`identity` gates — the Add button and CV save buttons work as long as the actor exists (anonymous actor is fine), since auth is now via token
- Remove the auto-trigger of II login popup from AdminDashboard — II is now optional, not required
- Error messages: distinguish auth errors from connection errors properly

### Remove
- Principal-based admin registration flow (`_initializeAccessControlWithSecret` still exists for legacy but is no longer relied upon)
- `needsIdentity` state and the II identity banner in AdminDashboard
- All `disabled={!isActorReady}` and `disabled={!identity}` guards that block the Add button

## Implementation Plan
1. Regenerate Motoko backend with token-based auth on all admin functions
2. Update frontend AdminDashboard to pass token on every call and remove II dependency gates
3. Deploy
