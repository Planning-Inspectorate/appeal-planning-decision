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

							containerFoAzureSqlStorage = container "Azure SQL Database storage" "Log storage account for sql" "Azure Blob Storage" {
								tags "Microsoft Azure - Storage Accounts"
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

						containerFoAppInsights = container "App Insights" {
							tags "Microsoft Azure - Application Insights"
						}

						group "Appeal Front-Office Functions" {
							containerFunctionApp = container "integration-functions" "Consumes messages from Service Bus" "Function App, JavaScript" {
								tags "Microsoft Azure - Function Apps", "FunctionApp"
							}

							containerFunctionAppStorage = container "integration-functions storage" "function app storage account" "Azure Blob Storage" {
								tags "Microsoft Azure - Storage Accounts"
							}
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

			systemLegacyIntegration = softwareSystem "Legacy Horizon Wrapper" "Data exchange between FO and legacy back office" "Kong" {
				tags "LegacySystem"
			}

			systemLegacyBo = softwareSystem "Horizon" "Legacy internal service to manage planning appeals in England" {
				tags "LegacySystem"
			}
		}

		group "External Systems" {
			systemGovUk = softwareSystem "GOV Notify" {
				tags "ExternalSystem"

				containerGovNotify = container "GOV Notify" "UK government messaging platform for sending emails, text and letters to users"
			}

			systemClamAv = softwareSystem "ClamAV" "External ClamAV definitions" {
				tags "ExternalSystem"
			}

			systemDevops = softwareSystem "Azure Devops" {
				tags "ExternalSystem"

				containerPipelines = container "Pipelines"
				containerInfraPipelines = container "Infra Pipelines"
			}

			systemGithub = softwareSystem "Github" {
				tags "ExternalSystem"
			}
		}

		# Relationships <identifier> -> <identifier> [description] [technology] [tags]

		// Deployment
		containerPipelines -> systemGithub "Retrieves code" "HTTPS"
		containerPipelines -> containerKeyVault "Retrieves secrets" "HTTPS"
		containerPipelines -> containerRegistry "Pushes new container versions to registry" "Docker"
		systemAppsFo -> containerRegistry "Apps pull latest container version" "Docker"
		containerInfraPipelines -> systemAppsFo "Terraform updates infra" "Terraform/AzureRM"

		// users
		userCaseOfficer -> containerBoWeb "Manages cases" "HTML/HTTPS"
		userInspector -> containerBoWeb "Decides cases" "HTML/HTTPS"

		userAppellant ->  containerFrontDoor "Registers appeals" "HTML/HTTPS"
		userLocalPlanningAuthority ->  containerFrontDoor "Responds to appeals" "HTML/HTTPS"
		userInterested -> containerFrontDoor "Comments on appeals" "HTML/HTTPS"
		userRule6 -> containerFrontDoor "Comments on appeals" "HTML/HTTPS"

		// Networking (could we include more networking info by adding private-endpoints/dns-zones/vnets/nics as items?)
		containerFrontDoor -> containerAppealsWAF "Checks traffic" "Azure WAF Policy"
		containerFrontDoor -> containerFoWeb "Forwards traffic to domain onto App Service" "Azure Front Door, HTTPS"
		systemAppsFo -> systemAppsBo "Peered VNets" "Azure Private endpoint, Azure Private DNS zones, Azure VNet"

		// Forms Web App
		containerFoWeb -> containerFoApi "Gets/sets appeal data" "REST/HTTPS"
		containerFoWeb -> containerFoDocsApi "Gets/sets documents" "REST/HTTPS"
		containerFoWeb -> containerFoAuthServer "Gets auth tokens" "OAUTH2/HTTPS"
		containerFoWeb -> containerFoPdfApi "Creates pdfs" "REST/HTTPS"
		containerFoWeb -> containerFoClamAV "Scans file uploads" "CLAMAV"
		containerFoWeb -> containerFoAzureCosmos "Stores user session data" "HTTPS"
		containerFoWeb -> containerKeyVault "Retrieves secrets" "HTTPS"

		// Appeals API
		containerFoApi -> containerFoAzureSql "Stores data" "SQL/HTTPS"
		containerFoApi -> containerFoAzureCosmos "Stores data" "Azure Cosmos(Mongo API)/HTTPS"
		containerFoApi -> containerFoAuthServer "Validates auth tokens" "OAUTH2/HTTPS"
		containerFoApi -> componentCaseCmdTopic "Informs back office of new appeals" "Service Bus Topic" "ServiceBus"
		containerFoApi -> componentLpaqCmdTopic "Informs back office of new lpaqs" "Service Bus Topic" "ServiceBus"
		containerFoApi -> containerKeyVault "Retrieves secrets" "HTTPS"

		// Docs API
		containerFoDocsApi -> containerFoAzureSql "Stores data" "SQL/HTTPS"
		containerFoDocsApi -> containerFoAzureCosmos "Stores data" "Mongo/HTTPS"
		containerFoDocsApi -> containerFoAuthServer "Validates auth tokens" "OAUTH2/HTTPS"
		containerFoDocsApi -> containerFoFileStorage "Stores/retrieves documents" "HTTPS"
		containerFoDocsApi -> containerBoFileStorage "Retrives BO docs SAS URLs" "HTTPS"
		containerFoDocsApi -> containerKeyVault "Retrieves secrets" "HTTPS"

		// Notify
		containerFoApi -> containerGovNotify "Requests emails to be sent" "REST/HTTPS"
		containerFoAuthServer -> containerGovNotify "Requests emails to be sent" "REST/HTTPS"
		containerBoWeb -> containerGovNotify "Requests emails to be sent" "REST/HTTPS"
		containerGovNotify -> userLocalPlanningAuthority "Emails the LPA" "EMAIL/SMTP"
		containerGovNotify -> userAppellant "Emails the appellant" "EMAIL/SMTP"
		containerGovNotify -> userInterested "Emails the interested party" "EMAIL/SMTP"
		containerGovNotify -> userRule6 "Emails the rule 6 interested party" "EMAIL/SMTP"

		// clam av
		containerFoClamAV -> systemClamAv "Gets latest virus definitions"

		// service bus
		containerFoApi -> componentCaseCmdTopic "Records appellant submissions" "Service Bus Topic" "ServiceBus"
		containerFoApi -> componentLpaqCmdTopic "Records LPA submissions" "Service Bus Topic" "ServiceBus"

		containerBoWeb -> componentCaseMessageTopic "Records changes to appeals" "Service Bus Topic" "ServiceBus"
		containerBoWeb -> componentDocumentMessageTopic "Records changes to documents" "Service Bus Topic" "ServiceBus"
		containerBoWeb -> componentServiceUserMessageTopic "Records changes to user information" "Service Bus Topic" "ServiceBus"
		containerBoWeb -> componentEventMessageTopic "Records changes to site visits and other events" "Service Bus Topic" "ServiceBus"

		// Integration functions
		containerFunctionApp -> componentCaseMessageTopic "Poll for new messages" "Service Bus Topic" "ServiceBus"
		containerFunctionApp -> componentDocumentMessageTopic "Poll for new messages" "Service Bus Topic" "ServiceBus"
		containerFunctionApp -> componentServiceUserMessageTopic "Poll for new messages" "Service Bus Topic" "ServiceBus"
		containerFunctionApp -> componentEventMessageTopic "Poll for new messages" "Service Bus Topic" "ServiceBus"
		containerFunctionApp -> containerFoApi "Forward service bus messages to API" "REST/HTTPS"
		containerFunctionApp -> containerFunctionAppStorage "Stores files"
		
		// Logs
		containerFoAzureSql -> containerFoAzureSqlStorage "Store sql audit logs/scans"
		containerFunctionApp -> containerFoAppInsights "Store App Logs/Requests"
		containerFoApi -> containerFoAppInsights "Store App Logs/Requests"
		containerFoAuthServer -> containerFoAppInsights "Store App Logs/Requests"
		containerFoDocsApi -> containerFoAppInsights "Store App Logs/Requests"
		containerFoWeb -> containerFoAppInsights "Store App Logs/Requests"
		containerFoPdfApi -> containerFoAppInsights "Store App Logs/Requests"

		// legacy
		userCaseOfficer -> systemLegacyBo "Manages cases" "HTML/HTTPS"
		userInspector -> systemLegacyBo "Decides cases" "HTML/HTTPS"
		containerFoApi -> systemLegacyIntegration "Scheduled job sends appeals to Horizon Wrapper" "JSON/HTTP"
		systemLegacyIntegration -> systemLegacyBo "Forwards appeals to legacy back office" "SOAP/HTTP"
	}

	views {
		properties {
			"structurizr.sort" "created"
		}

		systemLandscape "SystemLandscape" {
			include *
			exclude "element.tag==LegacySystem"
			title "System Landscape"
		}

		systemContext systemAppsFo "AppealsFOContext" {
			include *
			exclude "element.tag==LegacySystem"
			autoLayout tb
			title "Appeals Front-Office Context"
		}

		container systemAppsFo "AppealsFOContainer" {
			include *
			exclude "element.tag==LegacySystem" "element==systemSharedServices"
			autoLayout tb
			title "Appeals Front-Office Container"
		}

		systemContext systemAppsBo "AppealsBOContext" {
			include *
			autoLayout tb
			title "Appeals Back-Office Context"
		}

		container systemAppsBo "AppealsBOContainer" {
			include *
			autoLayout tb
			title "Appeals Back-Office Container"
		}

		systemContext systemIntegration "IntegrationContext" {
			include *
			autoLayout tb
			title "Integration Context"
		}

		component containerBoServiceBus "IntegrationComponents" {
			include *
			autoLayout tb
			title "Integration Components"
		}

		systemContext systemLegacyIntegration "LegacyIntegrationContext" {
			include *
			autoLayout tb
			title "Legacy Integration Context"
		}

		systemContext systemClamAv "ClamAVContext" {
			include *
			autoLayout tb
			title "ClamAV Context"
		}

		systemContext systemGovUk "GovUKContext" {
			include *
			autoLayout tb
			title "GovUK Context"
		}

		container systemGovUk "GovUKContainer" {
			include *
			autoLayout tb
			title "GovUK Container"
		}

		systemContext systemDevops "DevopsContext" {
			include *
			autoLayout tb
			title "Devops Context"
		}

		container systemDevops "DevopsContainer" {
			include *
			autoLayout tb
			title "Devops Container"
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

			relationship ServiceBus {
				style dotted
			}
		}
	}
}
