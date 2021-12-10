export const getPage = (page)=>{
  let name = '';
  switch (page){
    case 'task list':
      name = 'task-list';
      break;
    case 'Review accuracy of the appellant submission':
      name = 'accuracy-submission';
      break;
    case 'Extra conditions':
      name = 'extra-conditions';
      break;
    case 'Other appeals':
      name = 'other-appeals';
      break;
    case 'See appeal site from public land':
      name = 'public-land';
      break;
    case 'Need to enter the appeal site':
      name = 'site-access';
      break;
    case 'Access to neighbours land':
      name = 'neighbours-land';
      break;
    case 'Health and Safety issues':
      name = 'health-safety';
      break;
    case 'Affect setting of listed building':
      name = 'listed-building';
      break;
    case 'In Green belt':
      name = 'green-belt';
      break;
    case 'Near conservation area':
      name = 'conservation-area';
      break;
    case 'Plans used to reach decision':
      name = 'plans';
      break;
    case 'Planning officers report':
      name = 'officers-report';
      break;
    case 'Interested parties':
      name = 'interested-parties';
      break;
    case 'Interested parties representation':
      name = 'representations';
      break;
    case 'Notify interested parties':
      name = 'notifications';
      break;
    case 'Publicise original planning application':
      name = 'application-publicity';
      break;
    case 'Site Notices':
      name = 'site-notice';
      break;
    case 'Conservation area map and guidance':
      name = 'conservation-area-map';
      break;
    case 'Planning History':
      name = 'planning-history';
      break;
    case 'Other relevant policies':
      name = 'other-policies';
      break;
    case 'Statutory development plan policy':
      name = 'statutory-development';
      break;
    case 'Supplementary planning documents':
      name = 'supplementary-documents/uploaded-documents';
      break;
    case 'Development Plan Document or Neighbourhood Plan':
      name = 'development-plan';
      break;
    case 'Check your answers':
      name = 'confirm-answers';
      break;

    default:
      throw new Error('Unknown page = ' + page);
  }

  return name;
}

