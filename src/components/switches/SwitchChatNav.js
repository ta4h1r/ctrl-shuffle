import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function mSwitch({ botProps }) {

    const robot = botProps.robot;
    const refPath = botProps.refPath;
    const deviceId = robot.deviceId;


    /** Decide the state of the switch */
    let checkedState = false;

    const [state, setState] = React.useState({
        checkedA: checkedState,
    });

    const [toggleState, setToggleState] = React.useState([])

    const db = botProps.firebase.firestore();
    const robotRef = db.collection(refPath).doc(deviceId);
    const navDocRef = robotRef.collection("chat").doc("navigate");

    React.useEffect(() => {

        async function getToggleValue() {

            try {

                const snapshot = await navDocRef.get();
                const toggleValue = snapshot.data()["toggle"];

                if (toggleValue == 1) {
                    setState({ checkedA: true })
                } else {
                    setState({ checkedA: false })
                }

            } catch (err) {
                console.error("getToggleValue: Value does not exist. ")
                return false;
            }

        }
        getToggleValue()

    }, [])

    /** What happens when the switch is pressed */
    const handleSwitch = (event) => {
        const switchOn = !event.target.checked;
        if (switchOn) {
            navDocRef.update({"toggle": 0})
            setState({ checkedA: false })
        } else {
            navDocRef.update({"toggle": 1})
            setState({ checkedA: true })
        }
    };


    function sendMessage(field, msg) {
        const refPath = sessionStorage.getItem('REF_PATH');
        const db = firebase.firestore();
        const robotRef = db.collection(refPath).doc(robot.deviceId);
        var obj = {};
        obj[field] = msg;
        robotRef.collection("messages").doc("Web").update(obj);
    }

    return (
        <span>
            <FormControlLabel
                control={<Switch checked={state.checkedA} onChange={handleSwitch} name="checkedA" />}
                label="Off/On"
            />
        </span>
    )
}

export default mSwitch
