import React from 'react'

import Switch from '../switches/Switch'
import ChatGreetingListField from '../list/ChatGreetingListField'
import { makeStyles } from '@material-ui/core';
import { Button, Snackbar } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
    },
    button: {
        position: 'relative',
        display: 'flex',
        float: 'right',
        marginLeft: theme.spacing(1),
        marginRight: 'auto',
        marginBottom: theme.spacing(1),
    }
}));


function Chat({ activity, botProps }) {

    const db = botProps.firebase.firestore();
    const refGreetingsDoc = db.collection(botProps.refPath).doc(botProps.robot.deviceId).collection("chat").doc("greetings");

    const [greetingData, setGreetingData] = React.useState([]);
    const [g, setG] = React.useState('');

    React.useEffect(() => {

        async function getGreetings() {
            const doc = await refGreetingsDoc.get();
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                setGreetingData(Object.values(doc.data()));
            }
        }

        getGreetings()

    }, []);

    const handleClickDeleteGreetingFromList = (listItem) => {
        var newGreetingData = greetingData.filter(q => q != listItem)
        setGreetingData(newGreetingData);
    }
    const handleClickAddNewGreetingToList = () => {
        if (g) {
            const greetingToAdd = g
            var newGreetingData = [];
            greetingData.forEach(item => {
                newGreetingData.push(item);
            })
            newGreetingData.push(greetingToAdd);

            setGreetingData(newGreetingData);
            setG('');
        }
    }
    const onChangeGreetingField = (e) => {
        setG(e.target.value);
    }

    const onUpdate = () => {
        let data = {};
        for (var i = 0; i < greetingData.length; i++) {
            data[`greeting_${i}`] = greetingData[i]
        }
        refGreetingsDoc.set(data).then(() => {
            console.log("Done")
        })
    }


    const classes = useStyles();

    return (
        <div className={classes.root} >

            <Switch ability={activity} botProps={botProps} />

            <div className={classes.root}>

                <ChatGreetingListField
                    category={'greeting'}
                    data={greetingData}
                    handleClickDelete={handleClickDeleteGreetingFromList}
                    handleClickAddNew={handleClickAddNewGreetingToList}
                    onFieldChange={onChangeGreetingField}
                    fieldValue={g}
                />

                <Button className={classes.button} onClick={onUpdate} variant="outlined" color="primary">
                    Update
                </Button>


            </div>



        </div>


    )
}

export default Chat
