import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type UserRole = {
    #admin;
    #user;
    #guest;
  };

  public type AccessControlState = {
    // adminAssigned is kept for stable memory compatibility with the previous version.
    // It is no longer used in any logic — the token alone grants admin access.
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  public func initState() : AccessControlState {
    {
      var adminAssigned = false;
      userRoles = Map.empty<Principal, UserRole>();
    };
  };

  // Any principal that provides the correct token is ALWAYS registered as admin.
  // No one-time gate. Safe to call on every page load and every redeployment.
  public func initialize(state : AccessControlState, caller : Principal, adminToken : Text, userProvidedToken : Text) {
    if (caller.isAnonymous()) { return };
    if (userProvidedToken == adminToken) {
      // Always (re)assign admin — idempotent, safe on every call
      state.userRoles.add(caller, #admin);
      state.adminAssigned := true; // keep field in sync (unused but preserved for compat)
    } else {
      // Only register as user if not already assigned any role
      switch (state.userRoles.get(caller)) {
        case (?_) {}; // already has a role, don't downgrade
        case (null) {
          state.userRoles.add(caller, #user);
        };
      };
    };
  };

  // Returns #guest for unknown or anonymous principals — never traps
  public func getUserRole(state : AccessControlState, caller : Principal) : UserRole {
    if (caller.isAnonymous()) { return #guest };
    switch (state.userRoles.get(caller)) {
      case (?role) { role };
      case (null) { #guest };
    };
  };

  public func assignRole(state : AccessControlState, caller : Principal, user : Principal, role : UserRole) {
    if (not isAdmin(state, caller)) {
      return; // Silently ignore unauthorized role assignments
    };
    state.userRoles.add(user, role);
  };

  public func hasPermission(state : AccessControlState, caller : Principal, requiredRole : UserRole) : Bool {
    let userRole = getUserRole(state, caller);
    if (userRole == #admin or requiredRole == #guest) { true } else {
      userRole == requiredRole;
    };
  };

  public func isAdmin(state : AccessControlState, caller : Principal) : Bool {
    getUserRole(state, caller) == #admin;
  };
};
