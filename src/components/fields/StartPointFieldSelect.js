import { Button, MenuItem, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React from 'react'
import { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        marginLeft: theme.spacing(17),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    button: {
        marginTop: theme.spacing(2.5),
        marginLeft: theme.spacing(2),
        width: '15ch',
        height: '4ch'
    },
    typography: {
        float: "left",
        marginTop: theme.spacing(2.5),
        marginLeft: "auto",
        width: '30ch',
        height: '4ch'
    }
}));


export default function CalibrateField({
    botProps,
}) {

    const robot = botProps.robot;
    const firebase = botProps.firebase;
    const refPath = botProps.refPath;
    const deviceId = robot.deviceId;

    const db = firebase.firestore();
    const refTags = db.collection(refPath).doc(deviceId).collection("navigation").doc("tags");
    
    const [startPoint, setStartPoint] = useState([]);
    const [tagsData, setTagsData] = useState([]);

    useEffect(() => {

        refTags.onSnapshot(snapshot => {
            try {
                var keys = Object.keys(snapshot.data());
                var vals = Object.values(snapshot.data());

                
                setTagsData(snapshot.data());

                for (var i = 0; i < keys.length; i++) {
                    if (vals[i] == 3) {
                        setStartPoint(keys[i]);
                        break;
                    }
                }
            } catch (err) {
                console.error("Tags unavailable exception: ", err);
            }
        })

    }, []);


    const tags = []
    for (const item in tagsData) {
        tags.push({
            value: item,
            label: item
        })
    }

    const [targetStartPoint, setTargetStartPoint] = useState([]);

    const handleChangeStart = (event) => {
        setTargetStartPoint(event.target.value);
    }

    async function reqCalibrate() {
        try {
            // console.log(`Calibrating to position ${targetStartPoint} in map ${currentMap}`);
            const tagsRef = db.collection(refPath).doc(deviceId).collection("navigation").doc("tags");
            const REQ_CALIBRATE_TAG = 3;
            tagsRef.update(targetStartPoint, REQ_CALIBRATE_TAG);
        } catch (err) {
            console.error("Invalid target start point exception: ", err);
        }
    }


    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div>

                <Typography className={classes.typography} id="discrete-slider-custom" gutterBottom>
                    {`Start point: ${startPoint}`}
                </Typography>

                <TextField
                    select
                    label="Start point"
                    value={(targetStartPoint.length > 0) ? targetStartPoint : ''}
                    onChange={handleChangeStart}
                    variant="outlined"
                >
                    {tags.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={reqCalibrate}
                >
                    Calibrate
                </Button>

            </div>
        </div>
    )
}
