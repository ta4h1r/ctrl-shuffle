import React from 'react'
import { useEffect, useState } from 'react';
import { MenuItem } from '@material-ui/core'
import { IconButton, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AddBoxIcon from '@material-ui/icons/AddBox';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        flexWrap: 'nowrap',
        width: '100%',
        // borderWidth: '1px', borderStyle: 'solid', borderColor: 'red',
        position: 'relative',
        marginBottom: theme.spacing(2),
        marginLeft: theme.spacing(2),
    }

}));


export default function NewField({
    category,
    onChange,
    handleClickAddNew,
    fieldValue,
    botProps,
}) {

    const robot = botProps.robot;
    const firebase = botProps.firebase;
    const refPath = botProps.refPath;
    const deviceId = robot.deviceId;

    const db = firebase.firestore();
    const refTags = db.collection(refPath).doc(deviceId).collection("navigation").doc("tags");

    const [tagsData, setTagsData] = useState([]);

    useEffect(() => {

        refTags.onSnapshot(snapshot => {
            try {

                setTagsData(snapshot.data());

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


    const classes = useStyles();
    return (
        <div className={classes.root}>
            <TextField
                select
                label="Tags"
                value={(fieldValue.length > 0) ? fieldValue : ''}
                onChange={onChange}
                variant="outlined"
            >
                {tags.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <IconButton
                onClick={handleClickAddNew}
                color='primary'
                aria-label="delete">
                <AddBoxIcon />
            </IconButton>

        </div>
    )
}
