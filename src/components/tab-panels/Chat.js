import React from 'react'

import Switch from '../switches/Switch'
import ChatGreetingListField from '../list/ChatGreetingListField'
import { makeStyles } from '@material-ui/core';
import { Button, Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';



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
    const [showUpdatingAlert, setShowUpdatingAlert] = React.useState(false);
    const [showUpdatedAlert, setShowUpdatedAlert] = React.useState(false);
    const [showFailedUpdateAlert, setShowFailedUpdateAlert] = React.useState(false);

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
        setShowUpdatingAlert(true);
        let data = {};
        for (var i = 0; i < greetingData.length; i++) {
            data[`greeting_${i}`] = greetingData[i]
        }
        refGreetingsDoc.set(data).then(() => {
            setShowUpdatedAlert(true)
        }).catch(err => {
            console.log(err);
            setShowFailedUpdateAlert(true)
        })
    }

    const handleCloseSnackbar = () => {
        setShowFailedUpdateAlert(false); 
        setShowUpdatedAlert(false); 
        setShowUpdatingAlert(false); 
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


            <Snackbar open={showUpdatingAlert} onClose={handleCloseSnackbar}>
                    <Alert severity="info">
                        <AlertTitle>Info</AlertTitle>
                            Updating data...
                    </Alert>
                </Snackbar>
                <Snackbar open={showUpdatedAlert} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                            Successfully updated.
                    </Alert>
                </Snackbar>
                <Snackbar open={showFailedUpdateAlert} autoHideDuration={2000} onClose={handleCloseSnackbar}>
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                            Failed to update.
                    </Alert>
                </Snackbar>


        </div>


    )
}

export default Chat
