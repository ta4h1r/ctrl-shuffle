import React from 'react';

import VerticalNav3 from '../components/navs/VerticalNav3';
import StructureDiv from '../components/__structures/StructureDiv';

import Robots from '../components/buckets/Robots'
import Analysis from '../components/buckets/Analysis';
import ChatData from '../components/buckets/ChatbotData';
import FaceData from '../components/buckets/FaceData';
import Logs from '../components/buckets/Logs';

export default function Fleet(props) {

  const [firebase, setFirebase] = React.useState([]);
  const [robotsList, setRobotsList] = React.useState([]);

  const liftFirebaseState = (firebase) => {
    setFirebase(firebase);
  }
  const liftRobotsList =(fetchedRobots) => {
    setRobotsList(fetchedRobots);
  }

  return (
    <React.Fragment>
      <VerticalNav3
        content={{
          brand: {
            text: 'CTRL Robotics ',
            image: './images/ctrl.svg',
            width: '56',
          },
          'brand-small': {
            text: '',
            image: './images/ctrl.svg',
            width: '32',
          },
          link1: 'Robots',
          link2: 'Analytics',
          link3: 'Chatbot Data',
          link4: 'Face Data',
          link5: 'Logs',
          'secondary-action': 'Report Issue',
          'primary-action': 'Logout',
        }}
        
        bucketMain={[<StructureDiv bucket1={[<Robots liftFirebase={liftFirebaseState} liftRobotsList={liftRobotsList}/>]} />]}
        bucketAnalytics={[<StructureDiv bucket1={[<Analysis/>]} />]}
        bucketChatMem={[<StructureDiv bucket1={[<ChatData/>]} />]}
        bucketFaceMem={[<StructureDiv bucket1={[<FaceData/>]} />]}
        bucketLogs={[<StructureDiv bucket1={[<Logs/>]} />]}
        
        firebase={firebase}
        robotsList={robotsList}
      />
    </React.Fragment>
  ); 
}

