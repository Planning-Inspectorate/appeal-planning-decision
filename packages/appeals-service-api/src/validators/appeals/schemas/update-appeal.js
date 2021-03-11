const yup = require('yup');
const parseDateString = require('../../../lib/parse-date-string');

function document() {
  return yup
    .object()
    .shape({
      uploadedFile: yup.object().shape({
        name: yup.string().max(255).ensure().required(),
        id: yup
          .string()
          .uuid()
          .transform((value) => (!value ? null : value))
          .required(),
      }),
    })
    .noUnknown(true);
}

function sectionState() {
  return yup.string().oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED']).required();
}

exports.updateAppeal = yup
  .object()
  .noUnknown(true)
  .shape({
    id: yup.lazy((id) => {
      if (id !== undefined) {
        return yup.string().uuid().required();
      }
      return yup.mixed().notRequired();
    }),
    horizonId: yup.lazy((horizonId) => {
      if (horizonId !== undefined) {
        return yup.string().trim().max(20).nullable();
      }
      return yup.mixed().notRequired();
    }),
    lpaCode: yup.lazy((lpaCode) => {
      if (lpaCode !== undefined) {
        return yup.string().trim().max(20).nullable();
      }
      return yup.mixed().notRequired();
    }),
    decisionDate: yup.lazy((decisionDate) => {
      if (decisionDate !== undefined) {
        return yup.date().transform(parseDateString).nullable();
      }
      return yup.mixed().notRequired();
    }),
    submissionDate: yup.lazy((submissionDate) => {
      if (submissionDate !== undefined) {
        return yup.date().transform(parseDateString).nullable();
      }
      return yup.mixed().notRequired();
    }),
    state: yup.lazy((state) => {
      if (state !== undefined) {
        return yup.string().oneOf(['DRAFT', 'SUBMITTED']);
      }
      return yup.mixed().notRequired();
    }),
    eligibility: yup.lazy((eligibility) => {
      if (eligibility !== undefined) {
        return yup
          .object()
          .shape({
            enforcementNotice: yup.lazy((enforcementNotice) => {
              if (enforcementNotice !== undefined) {
                return yup.bool().required();
              }
              return yup.mixed().notRequired();
            }),
            householderPlanningPermission: yup.lazy((householderPlanningPermission) => {
              if (householderPlanningPermission !== undefined) {
                return yup.bool().required();
              }
              return yup.mixed().notRequired();
            }),
            isClaimingCosts: yup.lazy((isClaimingCosts) => {
              if (isClaimingCosts !== undefined) {
                return yup.bool().required();
              }
              return yup.mixed().notRequired();
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    aboutYouSection: yup.lazy((aboutYouSection) => {
      if (aboutYouSection !== undefined) {
        return yup
          .object()
          .shape({
            yourDetails: yup.object().shape({
              isOriginalApplicant: yup.lazy((isOriginalApplicant) => {
                if (isOriginalApplicant !== undefined) {
                  return yup.bool().required();
                }
                return yup.mixed().notRequired();
              }),
              name: yup.lazy((name) => {
                if (name !== undefined) {
                  return yup
                    .string()
                    .min(2)
                    .max(80)
                    .matches(/^[a-z\-' ]+$/i)
                    .required();
                }
                return yup.mixed().notRequired();
              }),
              email: yup.lazy((emailValue) => {
                if (emailValue !== undefined) {
                  return yup.string().email().max(255).required();
                }
                return yup.mixed().notRequired();
              }),
              appealingOnBehalfOf: yup.lazy((appealingOnBehalfOf) => {
                if (appealingOnBehalfOf !== undefined) {
                  return yup
                    .string()
                    .max(80)
                    .matches(/^[a-z\-' ]+$/i)
                    .nullable();
                }
                return yup.mixed().notRequired();
              }),
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    requiredDocumentsSection: yup.lazy((requiredDocumentsSection) => {
      if (requiredDocumentsSection !== undefined) {
        return yup
          .object()
          .shape({
            applicationNumber: yup.lazy((applicationNumber) => {
              if (applicationNumber !== undefined) {
                return yup.string().max(30).required();
              }
              return yup.mixed().notRequired();
            }),
            originalApplication: yup.lazy((originalApplication) => {
              if (originalApplication !== undefined) {
                return document();
              }
              return yup.mixed().notRequired();
            }),
            decisionLetter: yup.lazy((decisionLetter) => {
              if (decisionLetter !== undefined) {
                return document();
              }
              return yup.mixed().notRequired();
            }),
          })
          .noUnknown(true);
      }
      return yup.mixed().notRequired();
    }),
    yourAppealSection: yup.lazy((yourAppealSection) => {
      if (yourAppealSection !== undefined) {
        return yup.object().shape({
          appealStatement: yup.lazy((appealStatement) => {
            if (appealStatement !== undefined) {
              return document().shape({ hasSensitiveInformation: yup.bool().required() });
            }
            return yup.mixed().notRequired();
          }),
          otherDocuments: yup.lazy((otherDocuments) => {
            if (otherDocuments !== undefined) {
              return yup.object().shape({
                uploadedFiles: yup.array().of(
                  yup
                    .object()
                    .shape({
                      name: yup.string().max(255).ensure().required(),
                      id: yup
                        .string()
                        .uuid()
                        .transform((value) => (!value ? null : value))
                        .required(),
                    })
                    .noUnknown(true)
                ),
              });
            }
            return yup.mixed().notRequired();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),
    appealSubmission: yup.lazy((appealSubmission) => {
      if (appealSubmission !== undefined) {
        return yup.object().shape({
          appealPDFStatement: yup.lazy(() => {
            return document();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),
    appealSiteSection: yup.lazy((value) => {
      if (value !== undefined) {
        return yup.object().shape({
          siteAddress: yup.lazy((siteAddress) => {
            if (siteAddress !== undefined) {
              return yup
                .object()
                .shape({
                  addressLine1: yup.lazy((addressLine1) => {
                    if (addressLine1 !== undefined) {
                      return yup.string().max(60).ensure().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  addressLine2: yup.lazy((addressLine2) => {
                    if (addressLine2 !== undefined) {
                      return yup.string().max(60).ensure().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  town: yup.lazy((town) => {
                    if (town !== undefined) {
                      return yup.string().max(60).ensure().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  county: yup.lazy((county) => {
                    if (county !== undefined) {
                      return yup.string().max(60).ensure().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  postcode: yup.lazy((postcode) => {
                    if (postcode !== undefined) {
                      return yup.string().max(8).ensure().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          siteOwnership: yup.lazy((siteOwnership) => {
            if (siteOwnership !== undefined) {
              return yup
                .object()
                .shape({
                  ownsWholeSite: yup.lazy((ownsWholeSite) => {
                    if (ownsWholeSite !== undefined) {
                      return yup.bool().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  haveOtherOwnersBeenTold: yup.lazy((haveOtherOwnersBeenTold) => {
                    if (haveOtherOwnersBeenTold !== undefined) {
                      return yup.bool().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          siteAccess: yup.lazy((siteAccess) => {
            if (siteAccess !== undefined) {
              return yup
                .object()
                .shape({
                  canInspectorSeeWholeSiteFromPublicRoad: yup.lazy((seeWholeSite) => {
                    if (seeWholeSite !== undefined) {
                      return yup.bool().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  howIsSiteAccessRestricted: yup.lazy((howIsSiteAccessRestricted) => {
                    if (howIsSiteAccessRestricted !== undefined) {
                      return yup.string().max(255).ensure().nullable();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          healthAndSafety: yup.lazy((healthAndSafety) => {
            if (healthAndSafety !== undefined) {
              return yup
                .object()
                .shape({
                  hasIssues: yup.lazy((hasIssues) => {
                    if (hasIssues !== undefined) {
                      return yup.bool().required();
                    }
                    return yup.mixed().notRequired();
                  }),
                  healthAndSafetyIssues: yup.lazy((healthAndSafetyIssues) => {
                    if (healthAndSafetyIssues !== undefined) {
                      return yup.string().max(255).ensure().nullable();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),

    sectionStates: yup.lazy((value) => {
      if (value !== undefined) {
        return yup.object().shape({
          aboutYouSection: yup.lazy((aboutYouSection) => {
            if (aboutYouSection !== undefined) {
              return yup
                .object()
                .shape({
                  yourDetails: yup.lazy((yourDetails) => {
                    if (yourDetails !== undefined) {
                      return yup
                        .string()
                        .oneOf(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'])
                        .required();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          requiredDocumentsSection: yup.lazy((requiredDocumentsSection) => {
            if (requiredDocumentsSection !== undefined) {
              return yup
                .object()
                .shape({
                  applicationNumber: yup.lazy((applicationNumber) => {
                    if (applicationNumber !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  originalApplication: yup.lazy((originalApplication) => {
                    if (originalApplication !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  decisionLetter: yup.lazy((decisionLetter) => {
                    if (decisionLetter !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          yourAppealSection: yup.lazy((yourAppealSection) => {
            if (yourAppealSection !== undefined) {
              return yup
                .object()
                .shape({
                  appealStatement: yup.lazy((appealStatement) => {
                    if (appealStatement !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  otherDocuments: yup.lazy((otherDocuments) => {
                    if (otherDocuments !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
          appealSiteSection: yup.lazy((appealSiteSection) => {
            if (appealSiteSection !== undefined) {
              return yup
                .object()
                .shape({
                  siteAddress: yup.lazy((siteAddress) => {
                    if (siteAddress !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  siteAccess: yup.lazy((siteAccess) => {
                    if (siteAccess !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  siteOwnership: yup.lazy((siteOwnership) => {
                    if (siteOwnership !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                  healthAndSafety: yup.lazy((healthAndSafety) => {
                    if (healthAndSafety !== undefined) {
                      return sectionState();
                    }
                    return yup.mixed().notRequired();
                  }),
                })
                .noUnknown(true);
            }
            return yup.mixed().notRequired();
          }),
        });
      }
      return yup.mixed().notRequired();
    }),
  });
