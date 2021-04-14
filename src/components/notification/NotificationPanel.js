import React from 'react'

import NotifyMe from './NotifyMe';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function NotificationPanel(props) {

    const [data, setData] = React.useState([]);
    const dataRef = React.useRef(data);
    dataRef.current = data;

    let robotsList = props.robotsList;
    const firebase = props.firebase;

    const refPath = sessionStorage.getItem("REF_PATH");

    const addNotification = (msg, timestamp) => {
        let obj = {};
        obj['update'] = msg;
        obj['timestamp'] =  1000 * timestamp;

        setData(() => ([...dataRef.current, obj]));
      }
    const extractAndSendRelevantNotification = (obj) => {
        const timestamp = obj.msgFrom.Web.time;
        msgRef.current = timestamp;
        if (obj.msgFrom.Web != null) {
            const accordionSummaryMsg = obj.msgFrom['Web'].accordionSummaryMsg;
            switch (accordionSummaryMsg) {
                case 'Stopped':
                    addNotification(`${capitalizeFirstLetter(obj.robot)} has stopped`, timestamp)
                    break;
                case 'Low power':
                    addNotification(`${capitalizeFirstLetter(obj.robot)}'s battery is low`, timestamp)
                    break;
                case 'Waiting...':
                    addNotification(`${capitalizeFirstLetter(obj.robot)} is waiting for pick up`, timestamp)
                    break;
            }
        }


    }

    const [msgObj, setMsgObj] = React.useState([])
    React.useEffect(() => {

        async function getFirebaseMessages() {
            if (firebase.firestore && refPath && robotsList) {

                const db = firebase.firestore()
                const robotsRef = db.collection(refPath);
                const robotsSnapshot = await robotsRef.get();

                let snapshotCounter = 0;

                robotsSnapshot.forEach(async bot => {
                    const messagesRef = db.collection(refPath).doc(bot.id).collection('messages').doc("Web");
                    const msgSnapshot = await messagesRef.get();

                    let obj = {};

                    obj['robot'] = getBotAlias(bot.id);
                    obj['msgFrom'] = {};

                    messagesRef.onSnapshot(async s => {
                        obj.msgFrom[`${s.id}`] = s.data();
                        setMsgObj(obj);
                    });

                })

            }
        }
        function getBotAlias(botId) {
            for (var i = 0; i < robotsList.length; i++) {
                if (robotsList[i].deviceId == botId) {
                    return robotsList[i].robotAlias;
                }
            }
        }

        getFirebaseMessages();

    }, [(refPath && robotsList)])

    const msgRef = React.useRef();

    React.useEffect(() => {
        const msgCategories = Object.values(msgObj)[1];
        if (msgCategories) {
            if (msgRef.current !== msgCategories.Web.time) {
                extractAndSendRelevantNotification(msgObj)
            };
        }
    }, [msgObj]);


    return (
        <div style={{ margin: '10px' }}>
            <NotifyMe
                data={data}
                notific_key='timestamp'
                notific_value='update'
                heading='Notification Alerts'
                sortedByKey={false}
                showDate={false}
                size={28}
                color="white"
            />
        </div>
    )
}

export default NotificationPanel
