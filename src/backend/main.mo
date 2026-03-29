import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import BlobStorageMixin "blob-storage/Mixin";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include BlobStorageMixin();

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // ─── DATA TYPES ─────────────────────────────────────────────────────────────

  public type LectureItem = {
    id : Nat;
    title : Text;
    prototypeUrl : Text;
    description : Text;
    duration : Text;
    isLive : Bool;
    pdfData : Text;
  };

  public type StudentWorkItem = {
    id : Nat;
    studentName : Text;
    description : Text;
    photoData : Text;
    pdfData : Text;
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
    pdfData : Text;
  };

  public type ResearchItem = {
    id : Nat;
    title : Text;
    description : Text;
    imagePath : Text;
    isLive : Bool;
  };

  // ─── STORAGE ─────────────────────────────────────────────────────────────────

  var professionalNarrative = "I am a multidisciplinary design educator and art practitioner working across printmaking, interaction design, and ecological performance. Currently, I serve as an Assistant Professor of Interaction Design at KMCT School of Design, Kerala, where I teach UX research and UI fundamentals. Previously, I was the Design Head at PrepLadder (Unacademy), leading a creative team of 16 in illustration and animation. I hold a Master of Fine Arts and a Bachelor of Fine Arts in Printmaking and Design from the Government College of Art, Chandigarh. My practice is recognized internationally, supported by a Venice Biennale Travel Grant and a MAIR Residency Fellowship in 2024. I specialize in bridging traditional mediums like Etching and Pottery with digital mastery in Figma and the Adobe Creative Suite.";
  var cvLink = "";
  var cvPdfData = "";

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

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  func requireAdmin(caller : Principal) {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
  };

  func sliceArray<T>(arr : [T], offset : Nat, limit : Nat) : [T] {
    let size = arr.size();
    if (offset >= size) { return [] };
    let end = if (offset + limit > size) { size } else { offset + limit };
    Array.tabulate<T>(end - offset, func(i) { arr[offset + i] });
  };

  // Strip base64 data URIs — replace any field starting with "data:" with ""
  // so old base64-encoded content never inflates the response past the 3MB limit
  func stripBase64(s : Text) : Text {
    if (s.size() > 5) {
      let prefix = s.chars();
      var i = 0;
      var matched = true;
      let check = "data:";
      for (c in check.chars()) {
        switch (prefix.next()) {
          case (?ch) { if (ch != c) { matched := false } };
          case null { matched := false };
        };
        i += 1;
      };
      if (matched) { return "" };
    };
    s;
  };

  // ─── PROFESSIONAL NARRATIVE ──────────────────────────────────────────────────

  public query func getProfessionalNarrative() : async Text {
    professionalNarrative;
  };

  public shared ({ caller }) func setProfessionalNarrative(narrative : Text) : async () {
    requireAdmin(caller);
    professionalNarrative := narrative;
  };

  // ─── CV ──────────────────────────────────────────────────────────────────────

  public query func getCvLink() : async Text {
    cvLink;
  };

  public shared ({ caller }) func setCvLink(link : Text) : async () {
    requireAdmin(caller);
    cvLink := link;
  };

  public query func getCvPdf() : async Text {
    cvPdfData;
  };

  public shared ({ caller }) func setCvPdf(data : Text) : async () {
    requireAdmin(caller);
    cvPdfData := data;
  };

  // ─── LECTURES ────────────────────────────────────────────────────────────────

  public shared ({ caller }) func addLecture(
    title : Text,
    prototypeUrl : Text,
    description : Text,
    duration : Text,
    pdfData : Text,
  ) : async Nat {
    requireAdmin(caller);
    let id = nextLectureId;
    lectures.add(id, { id; title; prototypeUrl; description; duration; pdfData; isLive = false });
    nextLectureId += 1;
    id;
  };

  public shared ({ caller }) func deleteLecture(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (lectures.get(id)) {
      case (null) { false };
      case (?_) { lectures.remove(id); true };
    };
  };

  public shared ({ caller }) func setLectureLive(id : Nat, isLive : Bool) : async Bool {
    requireAdmin(caller);
    switch (lectures.get(id)) {
      case (null) { false };
      case (?existing) { lectures.add(id, { existing with isLive }); true };
    };
  };

  public shared ({ caller }) func clearAllLectures() : async () {
    requireAdmin(caller);
    lectures.clear();
  };

  public query func getLectures(offset : Nat, limit : Nat) : async [LectureItem] {
    let all = lectures.values().toArray();
    let stripped = Array.tabulate(all.size(), func(i) {
      { all[i] with pdfData = stripBase64(all[i].pdfData) }
    });
    sliceArray(stripped, offset, limit);
  };

  public query func listLiveLectures() : async [LectureItem] {
    let all = lectures.values().toArray().filter(func(l) { l.isLive });
    Array.tabulate(all.size(), func(i) {
      { all[i] with pdfData = stripBase64(all[i].pdfData) }
    });
  };

  // ─── STUDENT WORKS ───────────────────────────────────────────────────────────

  public shared ({ caller }) func addStudentWork(
    studentName : Text,
    description : Text,
    photoData : Text,
    pdfData : Text,
  ) : async Nat {
    requireAdmin(caller);
    let id = nextStudentWorkId;
    studentWorks.add(id, { id; studentName; description; photoData; pdfData; isLive = false });
    nextStudentWorkId += 1;
    id;
  };

  public shared ({ caller }) func deleteStudentWork(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (studentWorks.get(id)) {
      case (null) { false };
      case (?_) { studentWorks.remove(id); true };
    };
  };

  public shared ({ caller }) func setStudentWorkLive(id : Nat, isLive : Bool) : async Bool {
    requireAdmin(caller);
    switch (studentWorks.get(id)) {
      case (null) { false };
      case (?existing) { studentWorks.add(id, { existing with isLive }); true };
    };
  };

  public shared ({ caller }) func clearAllStudentWorks() : async () {
    requireAdmin(caller);
    studentWorks.clear();
  };

  public query func getStudentWorks(offset : Nat, limit : Nat) : async [StudentWorkItem] {
    let all = studentWorks.values().toArray();
    let stripped = Array.tabulate(all.size(), func(i) {
      { all[i] with photoData = stripBase64(all[i].photoData); pdfData = stripBase64(all[i].pdfData) }
    });
    sliceArray(stripped, offset, limit);
  };

  public query func listLiveStudentWorks() : async [StudentWorkItem] {
    let all = studentWorks.values().toArray().filter(func(w) { w.isLive });
    Array.tabulate(all.size(), func(i) {
      { all[i] with photoData = stripBase64(all[i].photoData); pdfData = stripBase64(all[i].pdfData) }
    });
  };

  // ─── ART PORTFOLIO ───────────────────────────────────────────────────────────

  public shared ({ caller }) func addArtItem(title : Text, imagePath : Text) : async Nat {
    requireAdmin(caller);
    let id = nextArtId;
    artPortfolio.add(id, { id; title; imagePath; isLive = false });
    nextArtId += 1;
    id;
  };

  public shared ({ caller }) func deleteArtItem(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (artPortfolio.get(id)) {
      case (null) { false };
      case (?_) { artPortfolio.remove(id); true };
    };
  };

  public shared ({ caller }) func setArtItemLive(id : Nat, isLive : Bool) : async Bool {
    requireAdmin(caller);
    switch (artPortfolio.get(id)) {
      case (null) { false };
      case (?existing) { artPortfolio.add(id, { existing with isLive }); true };
    };
  };

  public shared ({ caller }) func clearAllArtItems() : async () {
    requireAdmin(caller);
    artPortfolio.clear();
  };

  public query func getArtItems(offset : Nat, limit : Nat) : async [ArtPortfolioItem] {
    let all = artPortfolio.values().toArray();
    let stripped = Array.tabulate(all.size(), func(i) {
      { all[i] with imagePath = stripBase64(all[i].imagePath) }
    });
    sliceArray(stripped, offset, limit);
  };

  public query func listLiveArtItems() : async [ArtPortfolioItem] {
    let all = artPortfolio.values().toArray().filter(func(a) { a.isLive });
    Array.tabulate(all.size(), func(i) {
      { all[i] with imagePath = stripBase64(all[i].imagePath) }
    });
  };

  // ─── DESIGN PORTFOLIO ────────────────────────────────────────────────────────

  public shared ({ caller }) func addDesignPortfolio(
    title : Text,
    client : Text,
    year : Text,
    tags : [Text],
    figmaUrl : Text,
    imageData : Text,
    videoUrl : Text,
    description : Text,
    pdfData : Text,
  ) : async Nat {
    requireAdmin(caller);
    let id = nextDesignPortfolioId;
    designPortfolio.add(id, { id; title; client; year; tags; figmaUrl; imageData; videoUrl; description; pdfData; isLive = false });
    nextDesignPortfolioId += 1;
    id;
  };

  public shared ({ caller }) func deleteDesignPortfolio(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (designPortfolio.get(id)) {
      case (null) { false };
      case (?_) { designPortfolio.remove(id); true };
    };
  };

  public shared ({ caller }) func setDesignPortfolioLive(id : Nat, isLive : Bool) : async Bool {
    requireAdmin(caller);
    switch (designPortfolio.get(id)) {
      case (null) { false };
      case (?existing) { designPortfolio.add(id, { existing with isLive }); true };
    };
  };

  public shared ({ caller }) func clearAllDesignPortfolio() : async () {
    requireAdmin(caller);
    designPortfolio.clear();
  };

  public query func listAllDesignPortfolio() : async [DesignPortfolioItem] {
    let all = designPortfolio.values().toArray();
    Array.tabulate(all.size(), func(i) {
      { all[i] with imageData = stripBase64(all[i].imageData); pdfData = stripBase64(all[i].pdfData) }
    });
  };

  public query func listLiveDesignPortfolio() : async [DesignPortfolioItem] {
    let all = designPortfolio.values().toArray().filter(func(d) { d.isLive });
    Array.tabulate(all.size(), func(i) {
      { all[i] with imageData = stripBase64(all[i].imageData); pdfData = stripBase64(all[i].pdfData) }
    });
  };

  // ─── RESEARCH ITEMS ──────────────────────────────────────────────────────────

  public shared ({ caller }) func addResearchItem(
    title : Text,
    description : Text,
    imagePath : Text,
  ) : async Nat {
    requireAdmin(caller);
    let id = nextResearchItemId;
    researchItems.add(id, { id; title; description; imagePath; isLive = false });
    nextResearchItemId += 1;
    id;
  };

  public shared ({ caller }) func deleteResearchItem(id : Nat) : async Bool {
    requireAdmin(caller);
    switch (researchItems.get(id)) {
      case (null) { false };
      case (?_) { researchItems.remove(id); true };
    };
  };

  public shared ({ caller }) func setResearchItemLive(id : Nat, isLive : Bool) : async Bool {
    requireAdmin(caller);
    switch (researchItems.get(id)) {
      case (null) { false };
      case (?existing) { researchItems.add(id, { existing with isLive }); true };
    };
  };

  public shared ({ caller }) func clearAllResearchItems() : async () {
    requireAdmin(caller);
    researchItems.clear();
  };

  public query func getResearchItems(offset : Nat, limit : Nat) : async [ResearchItem] {
    let all = researchItems.values().toArray();
    let stripped = Array.tabulate(all.size(), func(i) {
      { all[i] with imagePath = stripBase64(all[i].imagePath) }
    });
    sliceArray(stripped, offset, limit);
  };

  public query func listLiveResearchItems() : async [ResearchItem] {
    let all = researchItems.values().toArray().filter(func(r) { r.isLive });
    Array.tabulate(all.size(), func(i) {
      { all[i] with imagePath = stripBase64(all[i].imagePath) }
    });
  };

  // ─── HEALTH CHECK ────────────────────────────────────────────────────────────

  public query func healthCheck() : async Bool {
    true;
  };
};
