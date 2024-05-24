workspace "Appeal service" {
	model {
		properties {
			"structurizr.groupSeparator" "/"
		}

		userLocalPlanningAuthority = person "LPA" "A local planning authority, issuing decisions on planning applications"
		userAppellant = person "Appellant" "A member of the public, or a representative (agent), appealing against a planning decision"
		userInterested = person "Interested Party" "A member of the public, with an interest in the appeal"
		userRule6 = person "Rule 6 Party" "A member of the public, with an interest in the appeal, given special 'rule 6' status"

		group "Planning Inspectorate: Appeals" {
			userCaseOfficer = person "Case officer" "Validates and manages case data, documents and general appeal processing"
			userInspector = person "Inspector" "Inspects the appeal site and issues appeal decisions"

			systemSharedServices = softwareSystem "Shared PINs Services" {
				containerRegistry = container "Container Registry" "stores docker images" {
					tags "Microsoft Azure - Container Registries"
				}

				containerKeyVault = container "Azure Key Vault" "Secret store for appeals" "Azure Key Vault" {
					tags "Microsoft Azure - Key Vaults"
				}
			}			

			systemAppsFo = softwareSystem "Appeals Front-Office" "Public dashboards for appellants and LPAs" {
				containerFrontDoor = container "PINs Front Door" {
					tags "Microsoft Azure - Front Door and CDN Profiles"
				}

				containerAppealsWAF = container "Appeals WAF Policy" {
					tags "Microsoft Azure - Web Application Firewall Policies(WAF)"
				}

				group "Appeal Front-Office VNET" {
					containerFoWeb = container "Appeal Front-Office Web" "Web UI" "Node.js, Azure Web App" {
						tags "Browser,Microsoft Azure - App Services"
					}

					group "Appeal Front-Office Back End" {
						group "Appeal Front-Office Data" {
							containerFoFileStorage = container "Blob storage for documents" "Stores all files uploaded in the Front-Office" "Azure Blob Storage" {
								tags "Microsoft Azure - Storage Accounts"
							}

							containerFoAzureSql = container "Azure SQL Database" "Data store for appeals" "Azure SQL" {
								tags "Microsoft Azure - SQL Database" "Database"
							}

							containerFoAzureCosmos = container "Azure Cosmos Mongo Database" "Data store for appeals" "Azure Cosmos" {
								tags "Microsoft Azure - Azure Cosmos DB" "Database"
							}
						}

						group "Appeal Front-Office APIs" {
							containerFoApi = container "Appeal Front-Office API" "API" "Node.js, Azure Web App" {
								tags "Microsoft Azure - App Services"
							}

							containerFoDocsApi = container "Appeal Front-Office Document API" "API" "Node.js, Azure Web App" {
								tags "Microsoft Azure - App Services"
							}

							containerFoPdfApi = container "Appeal Front-Office PDF API" "API" "Node.js, Azure Web App" {
								tags "Microsoft Azure - App Services"
							}
						}

						containerFoClamAV = container "ClamAV" {
							tags "Microsoft Azure - Container Instances"
						}

						containerFoAuthServer = container "Appeal Front-Office Auth Server" "API" "Node.js, Azure Web App" {
							tags "Microsoft Azure - App Services"
						}

						containerFunctionApp = container "integration-functions" "Consumes messages from Service Bus" "Function App, JavaScript" {
							tags "Microsoft Azure - Function Apps", "FunctionApp"
						}
					}			
				}
			}

			systemAppsBo = softwareSystem "Appeals Back-Office" "Internal service to manage planning appeals in England"  {
				// simplified, see equivalent diagram in back office for more detail
				group "Appeal Back-Office VNET" {
					containerBoFileStorage = container "Storage Account" "Document storage" {
						tags "Microsoft Azure - Storage Accounts"
					}

					containerBoWeb = container "Appeal Back-Office Web" "Web UI" "Node.js, Azure Web App" {
						tags "Browser,Microsoft Azure - App Services"
					}	
				}
			}

			systemIntegration = softwareSystem "Integration Layer" "Data exchange between FO and back office" {
				containerBoServiceBus = container "Service Bus" "Messaging platform for data exchange" "Azure ServiceBus Namespace" {
					tags "Microsoft Azure - Azure Service Bus"

					group "Commands" {
						componentCaseCmdTopic = component "Service Bus Appeal submission topic" "Appeal submission commands"
						componentLpaqCmdTopic = component "Service Bus LPA submission topic" "LPA submission commands"
					}

					group "Events" {
						componentCaseMessageTopic = component "Service Bus Appeal topic" "Appeal messages"
						componentDocumentMessageTopic = component "Service Bus Document topic" "Appeal document messages"
						componentServiceUserMessageTopic = component "Service Bus Service User topic" "Service user messages"
						componentEventMessageTopic = component "Service Bus Event topic" "Event message"
					}
				}
			}

            systemGovUk = softwareSystem "GOV Notify" {
				tags = "ExternalSystem"

				containerGovNotify = container "GOV Notify" "UK government messaging platform for sending emails, text and letters to users"
			}

			systemClamAv = softwareSystem "ClamAV" "External ClamAV defintions" {
				tags = "ExternalSystem"				
			}

			systemDevops = softwareSystem "Azure Devops" {
				tags = "ExternalSystem"

				containerPipelines = container "Pipelines"
				containerInfraPipelines = container "Infra Pipelines"
			}

			systemGithub = softwareSystem "Github" {
				tags = "ExternalSystem"
			}

            systemLegacyIntegration = softwareSystem "Legacy Horizon Wrapper" "Data exchange between FO and legacy back office" "Kong" {
				tags "LegacySystem"
			}

            systemLegacyBo = softwareSystem "Horizon" "Legacy internal service to manage planning appeals in England" {
				tags "LegacySystem"
			}

			# Relationships

			// Deployment
			containerPipelines -> systemGithub "Retrieves code"
			containerPipelines -> containerKeyVault "Retrieves secrets"
			containerPipelines -> containerRegistry "Pushes new container versions to registry"
			systemAppsFo -> containerRegistry "Apps pull latest container version"
			containerInfraPipelines -> systemAppsFo "Terraform updates infra"

			// users
			userCaseOfficer -> containerBoWeb "Manages cases"
			userInspector -> containerBoWeb "Decides cases"

			userAppellant ->  containerFrontDoor "Registers appeals"
            userLocalPlanningAuthority ->  containerFrontDoor "Responds to appeals"
            userInterested -> containerFrontDoor "Comments on appeals"
            userRule6 -> containerFrontDoor "Comments on appeals"

			// Networking
			containerFrontDoor -> containerAppealsWAF "Check traffic with WAF"
			containerFrontDoor -> containerFoWeb "Forward valid traffic to user facing website"
			systemAppsFo -> systemAppsBo "Peered VNets"

			// Forms Web App
            containerFoWeb -> containerFoApi "gets/sets appeal data"
            containerFoWeb -> containerFoDocsApi "gets/sets documents"
            containerFoWeb -> containerFoAuthServer "gets auth tokens"
            containerFoWeb -> containerFoPdfApi "creates pdfs"
			containerFoWeb -> containerFoClamAV "Scans file uploads"
            containerFoWeb -> containerFoAzureCosmos "stores user session data"
			containerFoWeb -> containerKeyVault "retrieves secrets"
            
			// Appeals API
            containerFoApi -> containerFoAzureSql "stores data"
            containerFoApi -> containerFoAzureCosmos "stores data"
            containerFoApi -> containerFoAuthServer "validates auth tokens"
            containerFoApi -> componentCaseCmdTopic "informs back office of new appeals"
            containerFoApi -> componentLpaqCmdTopic "informs back office of new lpaqs"
			containerFoApi -> containerKeyVault "retrieves secrets"

			// Docs API
            containerFoDocsApi -> containerFoAzureSql "stores data"
            containerFoDocsApi -> containerFoAzureCosmos "stores data"
            containerFoDocsApi -> containerFoAuthServer "validates auth tokens"
            containerFoDocsApi -> containerFoFileStorage "stores/retrieves documents"
            containerFoDocsApi -> containerBoFileStorage "retrives BO docs"
			containerFoDocsApi -> containerKeyVault "retrieves secrets"


			// Notify
            containerFoApi -> containerGovNotify "Sends emails"
            containerFoAuthServer -> containerGovNotify "Sends emails"
			containerBoWeb -> containerGovNotify "Sends emails"
			containerGovNotify -> userLocalPlanningAuthority "Notifies the LPA"
			containerGovNotify -> userAppellant "Notifies the appellant"
			containerGovNotify -> userInterested "Notifies the interested party"
			containerGovNotify -> userRule6 "Notifies the rule 6 interested party"

			// clam av
			containerFoClamAV -> systemClamAv "Gets latest definitions"

			// service bus
            containerFoApi -> componentCaseCmdTopic "Records appellant submissions"
			containerFoApi -> componentLpaqCmdTopic "Records LPA submissions"

			containerBoWeb -> componentCaseMessageTopic "Records changes to appeals"
			containerBoWeb -> componentDocumentMessageTopic "Records changes to documents"
			containerBoWeb -> componentServiceUserMessageTopic "Records changes to user information"
			containerBoWeb -> componentEventMessageTopic "Records changes to site visits and other events"

			// Integration functions
			containerFunctionApp -> componentCaseMessageTopic "Poll for new messages"
			containerFunctionApp -> componentDocumentMessageTopic "Poll for new messages"
			containerFunctionApp -> componentServiceUserMessageTopic "Poll for new messages"
			containerFunctionApp -> componentEventMessageTopic "Poll for new messages"
			containerFunctionApp -> containerFoApi "forward service bus messages to API"

            // legacy
            userCaseOfficer -> systemLegacyBo "Manages cases"
			userInspector -> systemLegacyBo "Decides cases"
            containerFoApi -> systemLegacyIntegration "Scheduled job sends appeals to Horizon Wrapper"
            systemLegacyIntegration -> systemLegacyBo "Forwards appeals to legacy back office"
		}
	}

	views {
		properties {
			"structurizr.sort" "created"
		}

		# Azure icons only
		theme default
		theme https://static.structurizr.com/themes/microsoft-azure-2023.01.24/icons.json

		styles {
			element Person {
				shape Person
			}

			element Database {
				shape Cylinder
			}

			element Browser {
                shape WebBrowser
            }

			element ExternalSystem {
				background #AAAAAA
			}

			element LegacySystem {
				background #CCCCCC
			}
		}
	}
}
