/* eslint-disable */

// @ts-nocheck

import { IDL } from '@icp-sdk/core/candid';

export const UserRole = IDL.Variant({
  'admin' : IDL.Null,
  'user' : IDL.Null,
  'guest' : IDL.Null,
});
export const UserProfile = IDL.Record({ 'name' : IDL.Text });
export const ArtPortfolioItem = IDL.Record({
  'id' : IDL.Nat,
  'title' : IDL.Text,
  'imagePath' : IDL.Text,
  'isLive' : IDL.Bool,
});
export const DesignPortfolioItem = IDL.Record({
  'id' : IDL.Nat,
  'figmaUrl' : IDL.Text,
  'client' : IDL.Text,
  'title' : IDL.Text,
  'pdfData' : IDL.Text,
  'imageData' : IDL.Text,
  'tags' : IDL.Vec(IDL.Text),
  'year' : IDL.Text,
  'description' : IDL.Text,
  'isLive' : IDL.Bool,
  'videoUrl' : IDL.Text,
});
export const LectureItem = IDL.Record({
  'id' : IDL.Nat,
  'title' : IDL.Text,
  'duration' : IDL.Text,
  'pdfData' : IDL.Text,
  'description' : IDL.Text,
  'isLive' : IDL.Bool,
  'prototypeUrl' : IDL.Text,
});
export const ResearchItem = IDL.Record({
  'id' : IDL.Nat,
  'title' : IDL.Text,
  'imagePath' : IDL.Text,
  'description' : IDL.Text,
  'isLive' : IDL.Bool,
});
export const StudentWorkItem = IDL.Record({
  'id' : IDL.Nat,
  'photoData' : IDL.Text,
  'pdfData' : IDL.Text,
  'studentName' : IDL.Text,
  'description' : IDL.Text,
  'isLive' : IDL.Bool,
});

export const idlService = IDL.Service({
  '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
  'addArtItem' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
  'addDesignPortfolio' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text), IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  'addLecture' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  'addResearchItem' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  'addStudentWork' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
  'clearAllArtItems' : IDL.Func([], [], []),
  'clearAllDesignPortfolio' : IDL.Func([], [], []),
  'clearAllLectures' : IDL.Func([], [], []),
  'clearAllResearchItems' : IDL.Func([], [], []),
  'clearAllStudentWorks' : IDL.Func([], [], []),
  'deleteArtItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'deleteDesignPortfolio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'deleteLecture' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'deleteResearchItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'deleteStudentWork' : IDL.Func([IDL.Nat], [IDL.Bool], []),
  'getArtItems' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(ArtPortfolioItem)], ['query']),
  'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
  'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
  'getCvLink' : IDL.Func([], [IDL.Text], ['query']),
  'getCvPdf' : IDL.Func([], [IDL.Text], ['query']),
  'getLectures' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(LectureItem)], ['query']),
  'getProfessionalNarrative' : IDL.Func([], [IDL.Text], ['query']),
  'getResearchItems' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(ResearchItem)], ['query']),
  'getStudentWorks' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(StudentWorkItem)], ['query']),
  'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
  'healthCheck' : IDL.Func([], [IDL.Bool], ['query']),
  'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
  'listAllDesignPortfolio' : IDL.Func([], [IDL.Vec(DesignPortfolioItem)], ['query']),
  'listLiveArtItems' : IDL.Func([], [IDL.Vec(ArtPortfolioItem)], ['query']),
  'listLiveDesignPortfolio' : IDL.Func([], [IDL.Vec(DesignPortfolioItem)], ['query']),
  'listLiveLectures' : IDL.Func([], [IDL.Vec(LectureItem)], ['query']),
  'listLiveResearchItems' : IDL.Func([], [IDL.Vec(ResearchItem)], ['query']),
  'listLiveStudentWorks' : IDL.Func([], [IDL.Vec(StudentWorkItem)], ['query']),
  'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
  'setArtItemLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  'setCvLink' : IDL.Func([IDL.Text], [], []),
  'setCvPdf' : IDL.Func([IDL.Text], [], []),
  'setDesignPortfolioLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  'setLectureLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  'setProfessionalNarrative' : IDL.Func([IDL.Text], [], []),
  'setResearchItemLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  'setStudentWorkLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
});

export const idlInitArgs = [];

export const idlFactory = ({ IDL }) => {
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const ArtPortfolioItem = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'imagePath' : IDL.Text,
    'isLive' : IDL.Bool,
  });
  const DesignPortfolioItem = IDL.Record({
    'id' : IDL.Nat,
    'figmaUrl' : IDL.Text,
    'client' : IDL.Text,
    'title' : IDL.Text,
    'pdfData' : IDL.Text,
    'imageData' : IDL.Text,
    'tags' : IDL.Vec(IDL.Text),
    'year' : IDL.Text,
    'description' : IDL.Text,
    'isLive' : IDL.Bool,
    'videoUrl' : IDL.Text,
  });
  const LectureItem = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'duration' : IDL.Text,
    'pdfData' : IDL.Text,
    'description' : IDL.Text,
    'isLive' : IDL.Bool,
    'prototypeUrl' : IDL.Text,
  });
  const ResearchItem = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'imagePath' : IDL.Text,
    'description' : IDL.Text,
    'isLive' : IDL.Bool,
  });
  const StudentWorkItem = IDL.Record({
    'id' : IDL.Nat,
    'photoData' : IDL.Text,
    'pdfData' : IDL.Text,
    'studentName' : IDL.Text,
    'description' : IDL.Text,
    'isLive' : IDL.Bool,
  });

  return IDL.Service({
    '_initializeAccessControlWithSecret' : IDL.Func([IDL.Text], [], []),
    'addArtItem' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'addDesignPortfolio' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Vec(IDL.Text), IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'addLecture' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'addResearchItem' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'addStudentWork' : IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'clearAllArtItems' : IDL.Func([], [], []),
  'clearAllDesignPortfolio' : IDL.Func([], [], []),
  'clearAllLectures' : IDL.Func([], [], []),
  'clearAllResearchItems' : IDL.Func([], [], []),
  'clearAllStudentWorks' : IDL.Func([], [], []),
  'deleteArtItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteDesignPortfolio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteLecture' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteResearchItem' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'deleteStudentWork' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'getArtItems' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(ArtPortfolioItem)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getCvLink' : IDL.Func([], [IDL.Text], ['query']),
    'getCvPdf' : IDL.Func([], [IDL.Text], ['query']),
    'getLectures' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(LectureItem)], ['query']),
    'getProfessionalNarrative' : IDL.Func([], [IDL.Text], ['query']),
    'getResearchItems' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(ResearchItem)], ['query']),
    'getStudentWorks' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(StudentWorkItem)], ['query']),
    'getUserProfile' : IDL.Func([IDL.Principal], [IDL.Opt(UserProfile)], ['query']),
    'healthCheck' : IDL.Func([], [IDL.Bool], ['query']),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'listAllDesignPortfolio' : IDL.Func([], [IDL.Vec(DesignPortfolioItem)], ['query']),
    'listLiveArtItems' : IDL.Func([], [IDL.Vec(ArtPortfolioItem)], ['query']),
    'listLiveDesignPortfolio' : IDL.Func([], [IDL.Vec(DesignPortfolioItem)], ['query']),
    'listLiveLectures' : IDL.Func([], [IDL.Vec(LectureItem)], ['query']),
    'listLiveResearchItems' : IDL.Func([], [IDL.Vec(ResearchItem)], ['query']),
    'listLiveStudentWorks' : IDL.Func([], [IDL.Vec(StudentWorkItem)], ['query']),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'setArtItemLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'setCvLink' : IDL.Func([IDL.Text], [], []),
    'setCvPdf' : IDL.Func([IDL.Text], [], []),
    'setDesignPortfolioLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'setLectureLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'setProfessionalNarrative' : IDL.Func([IDL.Text], [], []),
    'setResearchItemLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'setStudentWorkLive' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  });
};

export const init = ({ IDL }) => { return []; };
