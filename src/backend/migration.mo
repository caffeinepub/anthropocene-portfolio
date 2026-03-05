import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldDesignPortfolioItem = {
    id : Nat;
    title : Text;
    client : Text;
    year : Text;
    tags : [Text];
    isLive : Bool;
    figmaUrl : Text;
    imageData : Text;
    videoUrl : Text;
  };

  type NewDesignPortfolioItem = {
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

  type OldActor = {
    professionalNarrative : Text;
    cvLink : Text;
    userProfiles : Map.Map<Principal, { name : Text }>;
    lectures : Map.Map<Nat, { id : Nat; title : Text; prototypeUrl : Text; description : Text; duration : Text; isLive : Bool }>;
    studentWorks : Map.Map<Nat, { id : Nat; title : Text; student : Text; year : Text; tags : [Text]; isLive : Bool }>;
    artPortfolio : Map.Map<Nat, { id : Nat; title : Text; imagePath : Text; isLive : Bool }>;
    designPortfolio : Map.Map<Nat, OldDesignPortfolioItem>;
    researchItems : Map.Map<Nat, { id : Nat; title : Text; description : Text; imagePath : Text; isLive : Bool }>;
    nextLectureId : Nat;
    nextStudentWorkId : Nat;
    nextArtId : Nat;
    nextDesignPortfolioId : Nat;
    nextResearchItemId : Nat;
  };

  type NewActor = {
    professionalNarrative : Text;
    cvLink : Text;
    userProfiles : Map.Map<Principal, { name : Text }>;
    lectures : Map.Map<Nat, { id : Nat; title : Text; prototypeUrl : Text; description : Text; duration : Text; isLive : Bool }>;
    studentWorks : Map.Map<Nat, { id : Nat; title : Text; student : Text; year : Text; tags : [Text]; isLive : Bool }>;
    artPortfolio : Map.Map<Nat, { id : Nat; title : Text; imagePath : Text; isLive : Bool }>;
    designPortfolio : Map.Map<Nat, NewDesignPortfolioItem>;
    researchItems : Map.Map<Nat, { id : Nat; title : Text; description : Text; imagePath : Text; isLive : Bool }>;
    nextLectureId : Nat;
    nextStudentWorkId : Nat;
    nextArtId : Nat;
    nextDesignPortfolioId : Nat;
    nextResearchItemId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newDesignPortfolio = old.designPortfolio.map<Nat, OldDesignPortfolioItem, NewDesignPortfolioItem>(
      func(_id, oldItem) {
        { oldItem with description = "" };
      }
    );
    { old with designPortfolio = newDesignPortfolio };
  };
};
