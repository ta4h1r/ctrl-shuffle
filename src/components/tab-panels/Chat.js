import React from 'react'

import Switch from '../switches/Switch'
import ChatGreetingListField from '../list/ChatGreetingListField'
import ActiveTagListField from '../list/ActiveTagListField'


import { makeStyles } from '@material-ui/core';
import { Button, Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import MapsFieldSelect from '../fields/MapsFieldSelect';
import StartPointFieldSelect from '../fields/StartPointFieldSelect'
import NavStatusIndicator from '../indicators/NavStatusIndicator';



const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2),
        borderStyle: "solid", borderColor: "red", borderWidth: "0px"
    },
    button: {
        position: 'relative',
        display: 'flex',
        float: 'centre',
        marginLeft: theme.spacing(2),
        // marginRight: theme.spacing(10),
        // marginBottom: theme.spacing(20),
        // borderStyle: "solid", borderColor: "red", borderWidth: "0px"

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
            // console.log(err);
            setShowFailedUpdateAlert(true)
        })
    }

    const handleCloseSnackbar = () => {
        setShowFailedUpdateAlert(false);
        setShowUpdatedAlert(false);
        setShowUpdatingAlert(false);
    }


    const [tagsData, setTagsData] = React.useState([]);
    const [t, setT] = React.useState('');

    const refTagsDoc = db.collection(botProps.refPath).doc(botProps.robot.deviceId).collection("chat").doc("tags");

    React.useEffect(() => {

        async function getTags() {
            const doc = await refTagsDoc.get();
            if (!doc.exists) {
                console.log('No such document!');
                refTagsDoc.set({"activeTags": [], "toggle": 0})
            } else {
                if (doc.data()["activeTags"]) setTagsData(doc.data()["activeTags"]);
            }
        }

        getTags()

    }, []);

    const handleClickDeleteTagFromList = (listItem) => {
        var newTagsData = tagsData.filter(q => q != listItem)
        setTagsData(newTagsData);
    }
    const handleClickAddNewTagToList = () => {
        if (t) {
            const tagToAdd = t
            var newTagData = [];
            tagsData.forEach(item => {
                newTagData.push(item);
            })
            newTagData.push(tagToAdd);

            setTagsData(newTagData);
            setT('');
        }
    }
    const onChangeTagField = (e) => {
        setT(e.target.value);
    }
    const onUpdateTagList = () => {
        setShowUpdatingAlert(true);

        refTagsDoc.update({ "activeTags": tagsData }).then(() => {
            setShowUpdatedAlert(true)
        }).catch(err => {
            // console.error(err);
            setShowFailedUpdateAlert(true)
        })
    }


    const classes = useStyles();

    return (
        <div className={classes.root} >


            <Switch ability={activity} botProps={botProps}></Switch>


            <div className={classes.root}>


                <ChatGreetingListField
                    category={'greeting'}
                    data={greetingData}
                    handleClickDelete={handleClickDeleteGreetingFromList}
                    handleClickAddNew={handleClickAddNewGreetingToList}
                    onFieldChange={onChangeGreetingField}
                    fieldValue={g}
                    botProps={botProps}
                />

                <Button className={classes.button} onClick={onUpdate} variant="outlined" color="primary">
                    Update
                </Button>


            </div>


            <div className={classes.root}>
                <br />
                <ActiveTagListField
                    category={'active tag'}
                    data={tagsData}
                    handleClickDelete={handleClickDeleteTagFromList}
                    handleClickAddNew={handleClickAddNewTagToList}
                    onFieldChange={onChangeTagField}
                    fieldValue={t}
                    botProps={botProps}
                />

                <div className={classes.button}>
                    <Button onClick={onUpdateTagList} variant="outlined" color="primary">
                        Update
                    </Button>
                </div>
            </div>

            <div className={classes.root}>
                <br />
                {/* <NavStatusIndicator refPath={sessionStorage.getItem("REF_PATH")} deviceId={botProps.robot.deviceId} firebase={botProps.firebase} /> */}
                <MapsFieldSelect botProps={botProps} />
                <StartPointFieldSelect botProps={botProps} />
                <br/>
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
