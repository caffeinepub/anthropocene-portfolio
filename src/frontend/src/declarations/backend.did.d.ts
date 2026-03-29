/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface ArtPortfolioItem {
  'id' : bigint,
  'title' : string,
  'imagePath' : string,
  'isLive' : boolean,
}
export interface DesignPortfolioItem {
  'id' : bigint,
  'figmaUrl' : string,
  'client' : string,
  'title' : string,
  'pdfData' : string,
  'imageData' : string,
  'tags' : Array<string>,
  'year' : string,
  'description' : string,
  'isLive' : boolean,
  'videoUrl' : string,
}
export interface LectureItem {
  'id' : bigint,
  'title' : string,
  'duration' : string,
  'pdfData' : string,
  'description' : string,
  'isLive' : boolean,
  'prototypeUrl' : string,
}
export interface ResearchItem {
  'id' : bigint,
  'title' : string,
  'imagePath' : string,
  'description' : string,
  'isLive' : boolean,
}
export interface StudentWorkItem {
  'id' : bigint,
  'photoData' : string,
  'pdfData' : string,
  'studentName' : string,
  'description' : string,
  'isLive' : boolean,
}
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export interface _SERVICE {
  '_initializeAccessControlWithSecret' : ActorMethod<[string], undefined>,
  'addArtItem' : ActorMethod<[string, string], bigint>,
  'addDesignPortfolio' : ActorMethod<[string, string, string, Array<string>, string, string, string, string, string], bigint>,
  'addLecture' : ActorMethod<[string, string, string, string, string], bigint>,
  'addResearchItem' : ActorMethod<[string, string, string], bigint>,
  'addStudentWork' : ActorMethod<[string, string, string, string], bigint>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'deleteArtItem' : ActorMethod<[bigint], boolean>,
  'clearAllArtItems' : ActorMethod<[], undefined>,
  'clearAllDesignPortfolio' : ActorMethod<[], undefined>,
  'clearAllLectures' : ActorMethod<[], undefined>,
  'clearAllResearchItems' : ActorMethod<[], undefined>,
  'clearAllStudentWorks' : ActorMethod<[], undefined>,
  'deleteDesignPortfolio' : ActorMethod<[bigint], boolean>,
  'deleteLecture' : ActorMethod<[bigint], boolean>,
  'deleteResearchItem' : ActorMethod<[bigint], boolean>,
  'deleteStudentWork' : ActorMethod<[bigint], boolean>,
  'getArtItems' : ActorMethod<[bigint, bigint], Array<ArtPortfolioItem>>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getCvLink' : ActorMethod<[], string>,
  'getCvPdf' : ActorMethod<[], string>,
  'getLectures' : ActorMethod<[bigint, bigint], Array<LectureItem>>,
  'getProfessionalNarrative' : ActorMethod<[], string>,
  'getResearchItems' : ActorMethod<[bigint, bigint], Array<ResearchItem>>,
  'getStudentWorks' : ActorMethod<[bigint, bigint], Array<StudentWorkItem>>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'healthCheck' : ActorMethod<[], boolean>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'listAllDesignPortfolio' : ActorMethod<[], Array<DesignPortfolioItem>>,
  'listLiveArtItems' : ActorMethod<[], Array<ArtPortfolioItem>>,
  'listLiveDesignPortfolio' : ActorMethod<[], Array<DesignPortfolioItem>>,
  'listLiveLectures' : ActorMethod<[], Array<LectureItem>>,
  'listLiveResearchItems' : ActorMethod<[], Array<ResearchItem>>,
  'listLiveStudentWorks' : ActorMethod<[], Array<StudentWorkItem>>,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'setArtItemLive' : ActorMethod<[bigint, boolean], boolean>,
  'setCvLink' : ActorMethod<[string], undefined>,
  'setCvPdf' : ActorMethod<[string], undefined>,
  'setDesignPortfolioLive' : ActorMethod<[bigint, boolean], boolean>,
  'setLectureLive' : ActorMethod<[bigint, boolean], boolean>,
  'setProfessionalNarrative' : ActorMethod<[string], undefined>,
  'setResearchItemLive' : ActorMethod<[bigint, boolean], boolean>,
  'setStudentWorkLive' : ActorMethod<[bigint, boolean], boolean>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
