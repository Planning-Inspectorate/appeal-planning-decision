This doc is not auto generated so may get out of date if changes not reflected here

```mermaid
---
title: Before you start routing
---

flowchart TD
    %%{init: {"flowchart": {"defaultRenderer": "elk"}} }%%

    %% questions
    lpa[LPA?]
    enf[enforcement?]
    app[application type?]
    appAbout[application about?]
    appAboutCAS[application about?]
    listed[is listed building?]
    existingHome[existing-home?]
    conditionsHouseHolder[conditions for householder?]
    costsHouseHolder[applying for costs?]
    refused[granted/refused?]
    refusedV2[granted/refused?]
    refusedV2CAS[granted/refused?]
    refusedHouseHolder[granted/refused?]
    refusedHouseHolderV2[granted/refused?]
    refusedListedV2[granted/refused?]

    %% simplified - no decision has different wording for date
    date[date of decision?]
    dateV2[date of decision?]
    dateHouseHolder[date of decision?]
    dateHouseHolderV2[date of decision?]
    dateListedV2[date of decision?]
    dateV2CAS[date of decision?]

    %% Exit paths, multiple acp nodes to simplify graph rendering
    deadline(((-> deadline)))
    deadline2(((-> deadline)))
    deadline3(((-> deadline)))
    deadline4(((-> deadline)))
    acp(((-> ACP)))
    acp2(((-> ACP)))
    acp3(((-> ACP)))
    acp4(((-> ACP)))
    acp5(((-> ACP)))
    classDef exitStyle stroke:#ff0000,stroke-width:1px;
    class acp,acp2,acp3,acp4,acp5,deadline,deadline2,deadline3,deadline4 exitStyle;

    %% Forms
    v1HAS@{ shape: doc, label: "-> V1 HAS Appeal" }
    v1S78@{ shape: doc, label: "-> V1 S78 Appeal" }
    v2HAS@{ shape: doc, label: "-> V2 HAS Appeal" }
    v2S78@{ shape: doc, label: "-> V2 S78 Appeal" }
    v2S20@{ shape: doc, label: "-> V2 S20 Appeal" }
    v2CAS@{ shape: doc, label: "-> V2 CAS Appeal" }
    v2Advert@{ shape: doc, label: "-> V2 Advert/CAS Advert Appeal" }
    classDef v1 stroke:#00ff00,stroke-width:1px;
    classDef v2 stroke:#0000ff,stroke-width:1px;
    class v1HAS,v1S78 v1;
    class v2HAS,v2S78,v2S20,v2Advert,v2CAS v2;

    %% common routes
    lpa --> enf
    enf -- Yes --> acp
    enf -- No --> app
    app -- none/something else --> acp2
    app -- prior --> existingHome

    %% v1 routes
    app -- v1 full/outline/reserved --> appAbout
    app -- v1 householder --> listed

    existingHome -- v1 yes --> listed
    existingHome -- v1 no --> appAbout

    conditionsHouseHolder -- yes --> listed
    conditionsHouseHolder -- no --> appAbout

    appAbout -- any --> acp3
    appAbout -- none --> refused

    listed -- v1 yes --> acp4

    refused --> date

    refusedHouseHolder -- granted/no decision --> date
    refusedHouseHolder -- refused --> dateHouseHolder

    date -- missed --> deadline
    date -- in time --> v1S78

    dateHouseHolder -- missed --> deadline
    dateHouseHolder -- in time --> costsHouseHolder

    costsHouseHolder -- no --> v1HAS
    costsHouseHolder -- yes --> acp5

    %% v2 routes
    app -- v2 full/outline/reserved --> refusedV2
    app -- v2 listed building consent --> refusedListedV2
    app -- v2 householder --> refusedHouseHolderV2
    app -- conditions --> conditionsHouseHolder
    app -- v2 minor commercial --> appAboutCAS

    appAboutCAS -- none --> refusedV2CAS
    appAboutCAS -- any other -->  refusedV2
    refusedV2CAS --> dateV2CAS

    dateV2CAS -- missed --> deadline4
    dateV2CAS -- in time --> v2CAS

    listed -- v2 yes --> refusedListedV2
    listed -- v2 no --> refusedHouseHolder
    listed -- v2 no --> refusedHouseHolderV2

    existingHome -- v2 yes --> refusedHouseHolderV2
	existingHome -- v2 no --> refusedV2

    refusedListedV2 --> dateListedV2

    refusedHouseHolderV2 -- granted --> dateV2
    refusedHouseHolderV2 -- no decision --> dateV2
    refusedHouseHolderV2 -- refused --> dateHouseHolderV2

    refusedV2 --> dateV2

    dateV2 -- missed --> deadline2
    dateV2 -- in time --> v2S78

    dateListedV2 -- missed --> deadline3
    dateListedV2 -- in time --> v2S20

    dateHouseHolderV2 -- in time --> v2HAS
    dateHouseHolderV2 -- missed --> deadline2
```
