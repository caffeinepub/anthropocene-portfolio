import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var professionalNarrative = "I am a multidisciplinary design educator and art practitioner working across printmaking, interaction design, and ecological performance. Currently, I serve as an Assistant Professor of Interaction Design at KMCT School of Design, Kerala, where I teach UX research and UI fundamentals. Previously, I was the Design Head at PrepLadder (Unacademy), leading a creative team of 16 in illustration and animation. I hold a Master of Fine Arts and a Bachelor of Fine Arts in Printmaking and Design from the Government College of Art, Chandigarh. My practice is recognized internationally, supported by a Venice Biennale Travel Grant and a MAIR Residency Fellowship in 2024. I specialize in bridging traditional mediums like Etching and Pottery with digital mastery in Figma and the Adobe Creative Suite.";

  var cvLink = "";

  public type UserProfile = {
    name : Text;
  };

  public type LectureItem = {
    id : Nat;
    title : Text;
    prototypeUrl : Text;
    description : Text;
    duration : Text;
    isLive : Bool;
  };

  public type StudentWorkItem = {
    id : Nat;
    title : Text;
    student : Text;
    year : Text;
    tags : [Text];
    isLive : Bool;
  };

  public type ArtPortfolioItem = {
    id : Nat;
    title : Text;
    imagePath : Text;
    isLive : Bool;
  };

  public type DesignPortfolioItem = {
    id : Nat;
    title : Text;
    client : Text;
    year : Text;
    tags : [Text];
    isLive : Bool;
    figmaUrl : Text;
    imageData : Text;
    videoUrl : Text;
    description : Text;
  };

  public type ResearchItem = {
    id : Nat;
    title : Text;
    description : Text;
    imagePath : Text;
    isLive : Bool;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let lectures = Map.empty<Nat, LectureItem>();
  let studentWorks = Map.empty<Nat, StudentWorkItem>();
  let artPortfolio = Map.empty<Nat, ArtPortfolioItem>();
  let designPortfolio = Map.empty<Nat, DesignPortfolioItem>();
  let researchItems = Map.empty<Nat, ResearchItem>();

  var nextLectureId = 1;
  var nextStudentWorkId = 1;
  var nextArtId = 1;
  var nextDesignPortfolioId = 1;
  var nextResearchItemId = 1;

  func checkNotGuest(caller : Principal) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };

  // PROFESSIONAL NARRATIVE
  public query func getProfessionalNarrative() : async Text {
    professionalNarrative;
  };

  public shared ({ caller }) func setProfessionalNarrative(narrative : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the professional narrative");
    };
    professionalNarrative := narrative;
  };

  // USER PROFILE MANAGEMENT
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // LECTURES
  public shared ({ caller }) func addLecture(title : Text, prototypeUrl : Text, description : Text, duration : Text) : async Nat {
    checkNotGuest(caller);
    let id = nextLectureId;
    let lecture : LectureItem = {
      id;
      title;
      prototypeUrl;
      description;
      duration;
      isLive = false;
    };
    lectures.add(id, lecture);
    nextLectureId += 1;
    id;
  };

  public shared ({ caller }) func deleteLecture(id : Nat) : async Bool {
    checkNotGuest(caller);
    switch (lectures.get(id)) {
      case (null) { false };
      case (?_) {
        lectures.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func setLectureLive(id : Nat, isLive : Bool) : async Bool {
    checkNotGuest(caller);
    switch (lectures.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated = { existing with isLive };
        lectures.add(id, updated);
        true;
      };
    };
  };

  public query func listAllLectures() : async [LectureItem] {
    lectures.values().toArray();
  };

  public query func listLiveLectures() : async [LectureItem] {
    lectures.values().toArray().filter(func(l) { l.isLive });
  };

  // STUDENT WORK
  public shared ({ caller }) func addStudentWork(title : Text, student : Text, year : Text, tags : [Text]) : async Nat {
    checkNotGuest(caller);
    let id = nextStudentWorkId;
    let work : StudentWorkItem = {
      id;
      title;
      student;
      year;
      tags;
      isLive = false;
    };
    studentWorks.add(id, work);
    nextStudentWorkId += 1;
    id;
  };

  public shared ({ caller }) func deleteStudentWork(id : Nat) : async Bool {
    checkNotGuest(caller);
    switch (studentWorks.get(id)) {
      case (null) { false };
      case (?_) {
        studentWorks.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func setStudentWorkLive(id : Nat, isLive : Bool) : async Bool {
    checkNotGuest(caller);
    switch (studentWorks.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated = { existing with isLive };
        studentWorks.add(id, updated);
        true;
      };
    };
  };

  public query func listAllStudentWorks() : async [StudentWorkItem] {
    studentWorks.values().toArray();
  };

  public query func listLiveStudentWorks() : async [StudentWorkItem] {
    studentWorks.values().toArray().filter(func(w) { w.isLive });
  };

  // ART PORTFOLIO
  public shared ({ caller }) func addArtItem(title : Text, imagePath : Text) : async Nat {
    checkNotGuest(caller);
    let id = nextArtId;
    let item : ArtPortfolioItem = {
      id;
      title;
      imagePath;
      isLive = false;
    };
    artPortfolio.add(id, item);
    nextArtId += 1;
    id;
  };

  public shared ({ caller }) func deleteArtItem(id : Nat) : async Bool {
    checkNotGuest(caller);
    switch (artPortfolio.get(id)) {
      case (null) { false };
      case (?_) {
        artPortfolio.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func setArtItemLive(id : Nat, isLive : Bool) : async Bool {
    checkNotGuest(caller);
    switch (artPortfolio.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated = { existing with isLive };
        artPortfolio.add(id, updated);
        true;
      };
    };
  };

  public query func listAllArtItems() : async [ArtPortfolioItem] {
    artPortfolio.values().toArray();
  };

  public query func listLiveArtItems() : async [ArtPortfolioItem] {
    artPortfolio.values().toArray().filter(func(a) { a.isLive });
  };

  // DESIGN PORTFOLIO
  public shared ({ caller }) func addDesignPortfolio(
    title : Text,
    client : Text,
    year : Text,
    tags : [Text],
    figmaUrl : Text,
    imageData : Text,
    videoUrl : Text,
    description : Text,
  ) : async Nat {
    checkNotGuest(caller);
    let id = nextDesignPortfolioId;
    let item : DesignPortfolioItem = {
      id;
      title;
      client;
      year;
      tags;
      isLive = false;
      figmaUrl;
      imageData;
      videoUrl;
      description;
    };
    designPortfolio.add(id, item);
    nextDesignPortfolioId += 1;
    id;
  };

  public shared ({ caller }) func deleteDesignPortfolio(id : Nat) : async Bool {
    checkNotGuest(caller);
    switch (designPortfolio.get(id)) {
      case (null) { false };
      case (?_) {
        designPortfolio.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func setDesignPortfolioLive(id : Nat, isLive : Bool) : async Bool {
    checkNotGuest(caller);
    switch (designPortfolio.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated = { existing with isLive };
        designPortfolio.add(id, updated);
        true;
      };
    };
  };

  public query func listAllDesignPortfolio() : async [DesignPortfolioItem] {
    designPortfolio.values().toArray();
  };

  public query func listLiveDesignPortfolio() : async [DesignPortfolioItem] {
    designPortfolio.values().toArray().filter(func(d) { d.isLive });
  };

  // RESEARCH ITEMS
  public shared ({ caller }) func addResearchItem(title : Text, description : Text, imagePath : Text) : async Nat {
    checkNotGuest(caller);
    let id = nextResearchItemId;
    let item : ResearchItem = {
      id;
      title;
      description;
      imagePath;
      isLive = false;
    };
    researchItems.add(id, item);
    nextResearchItemId += 1;
    id;
  };

  public shared ({ caller }) func deleteResearchItem(id : Nat) : async Bool {
    checkNotGuest(caller);
    switch (researchItems.get(id)) {
      case (null) { false };
      case (?_) {
        researchItems.remove(id);
        true;
      };
    };
  };

  public shared ({ caller }) func setResearchItemLive(id : Nat, isLive : Bool) : async Bool {
    checkNotGuest(caller);
    switch (researchItems.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated = { existing with isLive };
        researchItems.add(id, updated);
        true;
      };
    };
  };

  public query func listAllResearchItems() : async [ResearchItem] {
    researchItems.values().toArray();
  };

  public query func listLiveResearchItems() : async [ResearchItem] {
    researchItems.values().toArray().filter(func(r) { r.isLive });
  };

  public query func healthCheck() : async Bool {
    true;
  };

  // CV LINK FUNCTIONALITY
  public query ({ caller }) func getCvLink() : async Text {
    cvLink;
  };

  public shared ({ caller }) func setCvLink(link : Text) : async () {
    checkNotGuest(caller);
    cvLink := link;
  };
};
