import { Button, MenuItem, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import React from 'react'
import { useEffect, useState } from 'react';

import NavStatusIndicator from '../indicators/NavStatusIndicator';

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


export default function MapsField({
    botProps,
}) {

    const robot = botProps.robot;
    const firebase = botProps.firebase;
    const refPath = botProps.refPath;
    const deviceId = robot.deviceId;

    const db = firebase.firestore();
    const refMaps = db.collection(refPath).doc(deviceId).collection("navigation").doc("maps");

    const [mapsData, setMapsData] = useState([]);
    const [currentMap, setCurrentMap] = useState([]);

    useEffect(() => {

        refMaps.onSnapshot(snapshot => {
            try {

                var keys = Object.keys(snapshot.data());
                var vals = Object.values(snapshot.data());

                setMapsData(snapshot.data());

                for (var i = 0; i < keys.length; i++) {
                    if (vals[i] == 1) {
                        setCurrentMap(keys[i]);
                        break;
                    }
                }
            } catch (err) {
                console.error("Maps unavailable exception: ", err);
            }
        })

    }, []);


    let maps = [];
    for (const item in mapsData) {
        maps.push({
            value: item,
            label: item
        })
    }

    const [targetMap, setTargetMap] = useState([]);

    const handleChangeMap = (event) => {
        setTargetMap(event.target.value);
    };

    async function reqSetMap() {
        try {
            console.log(`Setting map ${targetMap}`);
            const mapsRef = db.collection(refPath).doc(deviceId).collection("navigation").doc("maps");
            const REQ_APPLY_MAP = 2;
            mapsRef.update(targetMap, REQ_APPLY_MAP);
        } catch (err) {
            console.error("Invalid target map exception: ", err);
        }
    }


    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div>

                <Typography className={classes.typography} id="discrete-slider-custom" gutterBottom>
                    {`Current map: ${currentMap}`}
                </Typography>

                <TextField
                    select
                    label="Load map"
                    value={(targetMap.length > 0) ? targetMap : ''}
                    onChange={handleChangeMap}
                    variant="outlined"
                >
                    {maps.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>

                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={reqSetMap}
                >
                    Set
                </Button>

            </div>
        </div>
    )
}
