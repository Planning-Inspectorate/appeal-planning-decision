This doc is not auto generated so may get out of date if changes not reflected here

```mermaid
---
title: Before you start routing
---

flowchart TD
    %%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%

    %% Legend
    subgraph Legend
        legQuestion[Question to user]
        legDecision{Decision - appeal type is known}:::decisionStyle
        legAppealForm@{ shape: doc, label: "Appeal Form" }
        legExit(((Exit))):::exitStyle
    end

    %% Exit
    deadline(((-> deadline))):::exitStyle
    acp1(((-> ACP))):::exitStyle

    %% Decisions
    decideHAS{appeal type = HAS}:::decisionStyle
    decideS78A{appeal type = S78}:::decisionStyle
    decideS78B{appeal type = S78}:::decisionStyle
    decideS20{appeal type = S20}:::decisionStyle
    decideCAS{appeal type = CAS Planning}:::decisionStyle
    decideAdvert{appeal type = Adverts}:::decisionStyle
    decideLDC{appeal type = LDC}:::decisionStyle

    %% Appeal Forms
    HAS@{ shape: doc, label: "HAS Appeal" }
    S78@{ shape: doc, label: "S78 Appeal" }
    S20@{ shape: doc, label: "S20 Appeal" }
    CAS@{ shape: doc, label: "CAS Planning Appeal" }
    Advert@{ shape: doc, label: "Advert/CAS Advert Appeal" }
    Enforcement@{ shape: doc, label: "Enforcement Notice Appeal" }
    LDC@{ shape: doc, label: "Lawful Development Certificate Appeal"}

    %% questions
    lpa[LPA?]
    appealAbout[what is your appeal about?]
    applicationAbout[application about?]
    applicationAboutCAS[commercial application about?]
    existingHome[existing-home?]
    conditionsHouseholder[conditions for householder?]
    listedBuilding[is listed building?]
    grantedRefused[granted/refused?]
    grantedRefusedUndecided[granted/refused - undecided?]
    applicationDate[date of application]
    decisionDate[date of decision?]
    enforcementListedBuilding[enforcement listed building?]
    enforcementIssueDate[enforcement issue date?]
    enforcementEffectiveDate[enforcement effective date?]
    didYouContactPlanningInspectorate[did you contact planning inspectorate?]
    contactPlanningInspectorateDate[contact planning inspectorate date?]

    %% routing
    lpa --> appealAbout

    appealAbout -- full planning --> decideS78A
    appealAbout -- householder --> grantedRefusedUndecided
    appealAbout -- listed building consent --> decideS20
    appealAbout -- enforcement --> enforcementIssueDate
    appealAbout -- enforcementListedBuilding --> enforcementIssueDate
    appealAbout -- display advert --> decideAdvert
    appealAbout -- minor commercial --> applicationAboutCAS
    appealAbout -- lawful development certificate --> decideLDC
    appealAbout -- outline planning --> decideS78A
    appealAbout -- prior approval --> existingHome
    appealAbout -- reserved --> decideS78A
    appealAbout -- conditions --> conditionsHouseholder
    appealAbout -- permission in principle -->
    appealAbout -- none/something else --> acp1

    enforcementIssueDate --> enforcementEffectiveDate

    enforcementEffectiveDate -- valid date --> Enforcement
    enforcementEffectiveDate -- current/past date --> didYouContactPlanningInspectorate

    didYouContactPlanningInspectorate -- Yes --> contactPlanningInspectorateDate
    didYouContactPlanningInspectorate -- missed deadline --> deadline

    contactPlanningInspectorateDate -- valid date --> Enforcement
    contactPlanningInspectorateDate -- missed deadline --> deadline

    applicationAbout -- any --> acp1
    applicationAbout -- none --> decideS78A

    applicationAboutCAS -- none --> decideCAS
    applicationAboutCAS -- any other --> decideS78A

    existingHome -- yes --> grantedRefusedUndecided
	existingHome -- no --> decideS78A

    conditionsHouseholder -- yes --> listedBuilding
    conditionsHouseholder -- no --> listedBuilding

    listedBuilding -- yes (not LDC) --> decideS20
    listedBuilding -- no (not LDC) --> decideS78A
    listedBuilding -- yes (LDC) --> grantedRefused
    listedBuilding -- no (LDC) --> LDC

    decideS78A --> applicationDate
    decideS20 --> grantedRefused
    decideAdvert --> grantedRefused
    decideCAS --> grantedRefused
    decideLDC --> listedBuilding

    applicationDate --> grantedRefused
    grantedRefused --> decisionDate

    grantedRefusedUndecided -- granted/no decision --> decideS78B
    grantedRefusedUndecided -- refused --> decideHAS

    decideHAS --> decisionDate
    decideS78B --> decisionDate

    decisionDate -- missed deadline --> deadline
    decisionDate -- HAS --> HAS
    decisionDate -- S78 --> S78
    decisionDate -- Advert --> Advert
    decisionDate -- CAS --> CAS
    decisionDate -- S20 --> S20
    decisionDate -- LDC --> LDC

    %% styles
    classDef decisionStyle fill:#ffe8c6,stroke:#c26d00,color:#111,stroke-width:2px;
    classDef appealForm fill:#e5f8ec,stroke:#1b7f3c,color:#111,stroke-width:2px;
    classDef exitStyle fill:#ffe6e6,stroke:#d4351c,color:#111,stroke-width:2px;

    class HAS,S78,S20,Advert,CAS,legAppealForm,Enforcement,LDC,example appealForm;
```
