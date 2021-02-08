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

    React.useEffect(() => {
        setData(data);
        console.log('On data Change', data);
    }, [data]);



    const addNotification = (when, message) => {
        console.log('Add Notification');
        let obj = {};
        obj['update'] = message;

        if (when === 'now') {
            obj['timestamp'] = new Date().getTime();
        } if (when === 'minute') {
            obj['timestamp'] = new Date().getTime() - (61 * 1000);
        } if (when === 'hour') {
            obj['timestamp'] = new Date().getTime() - (61 * 60 * 1000);;
        } else if (when === 'yesterday') {
            obj['timestamp'] = new Date().getTime() - (25 * 60 * 60 * 1000);
        }
        else if (when === 'month') {
            obj['timestamp'] = new Date().getTime() - (31 * 24 * 60 * 60 * 1000);
        }
        else if (when === 'year') {
            obj['timestamp'] = new Date().getTime() - (13 * 30 * 24 * 60 * 60 * 1000);
        }
        setData(() => ([...dataRef.current, obj]));
        console.log('data added', data);
    }
    const extractAndSendRelevantNotification = (obj) => {
        console.log(obj)
        if (obj.msgFrom.Web != null) {
            const accordionSummaryMsg = obj.msgFrom['Web'].accordionSummaryMsg;
            console.log(accordionSummaryMsg)
            switch (accordionSummaryMsg) {
                case 'Stopped':
                    addNotification('now', `${capitalizeFirstLetter(obj.robot)} has stopped`) 
                    break;
                case 'Low power':
                    addNotification('now', `${capitalizeFirstLetter(obj.robot)} needs to be charged`) 
                    break;
            }
        }


    }

    React.useEffect(() => {

        async function getFirebaseMessages() {
            console.log(refPath, firebase.firestore)
            var snapshotCounter = 0;
            if (firebase.firestore && refPath) {
                const db = firebase.firestore()
                const robotsRef = db.collection(refPath);
                const robotsSnapshot = await robotsRef.get();

                robotsSnapshot.forEach(async bot => {
                    const messagesRef = db.collection(refPath).doc(bot.id).collection('messages');
                    const msgSnapshot = await messagesRef.get()
                    let obj = {};

                    obj['robot'] = getBotAlias(bot.id);
                    obj['msgFrom'] = {};


                    msgSnapshot.forEach(async msgCategory => {
                        const category = msgCategory.id;
                        messagesRef.doc(category).onSnapshot(s => {
                            snapshotCounter += 1;
                            obj.msgFrom[`${category}`] = s.data();
                            if(snapshotCounter > robotsList.length) {
                                extractAndSendRelevantNotification(obj);
                            }
                        });
                    })
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

    }, [(refPath && firebase && robotsList)])


    return (
        <div style={{ margin: '10px' }}>
            <NotifyMe
                data={data}
                notific_key='timestamp'
                notific_value='update'
                heading='Notification Alerts'
                sortedByKey={false}
                showDate={true}
                size={32}
                color="green"
            />
        </div>
    )
}

export default NotificationPanel
