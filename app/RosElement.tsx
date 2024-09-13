'use client'
import {useROS} from "@/app/InstanceRos";
import {useEffect, useState} from "react";
import ROSLIB from 'roslib';

export function RosElementService(json) {
    const [localClient, setLocalClient] = useState<ROSLIB.Service>(null);
    const [localMessage, setLocalMessage] = useState<string>('');

    const {ros} = useROS();
    const localJson = json.json;

    useEffect(() => {
        if (ros) {
            setLocalClient(new ROSLIB.Service({
                ros: ros,
                name: localJson.ServiceName,
                serviceType: localJson.ServiceType
            }));

            // Nettoyage lors du démontage
            return () => {
                //TODO : unsubscribe
            };
        } else {
            console.log('ROS n\'est pas encore prêt.');
        }
    }, []);

    function onHandleClick() {
        const request = new ROSLIB.ServiceRequest(json.Req);

        if (localClient) {
            localClient.callService(request, function (result) {
                console.log('Result for service call on '
                    + localClient.name
                    + ': '
                    + result.sum);
                setLocalMessage(result) //TODO vérifier le type de message pour transformer en string interressante
            });
        } else {
            console.log('localClient n\'est pas encore prêt.');
        }
    }

    return (
        <div>
            <button
                onClick={onHandleClick}
                className="bg-gray-200 w-52 text-black rounded-md px-4 py-2 hover:bg-gray-300 transition duration-300"
            >
                Call Service {localJson.ServiceName}
            </button>

            {localMessage ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>Result: {localMessage}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicEcho(json) {
    const [localClient, setLocalClient] = useState<ROSLIB.Topic>(null);
    const [localMessage, setLocalMessage] = useState<string>('');

    const {ros} = useROS();
    const localJson = json.json;

    useEffect(() => {
        if (ros) {

            setLocalClient(new ROSLIB.Topic({
                ros: ros,
                name: localJson.TopicName,
                mesageType: localJson.MessageType
            }));

            // Nettoyage lors du démontage
            return () => {
                //TODO : unsubscribe
            };
        } else {
            console.log('ROS n\'est pas encore prêt.');
        }
    }, []);

    function onHandleClick() {
        if (localClient) {
            localClient.subscribe((message: ROSLIB.message) => {
                setLocalMessage(message);
                console.log('Received message on ' + localClient.name + ': ' + message.percentage);
            });
        } else {
            console.log('localClient n\'est pas encore prêt.');
        }
    }

    useEffect(() => {
        if (localMessage) {
            console.log('localMessage a changé:', localMessage);
            // Vous pouvez exécuter d'autres actions ici si nécessaire
        }
    }, [localMessage]); // Dépendance à localMessage pour réagir à ses changements

    return (
        <div>
            <button
                onClick={onHandleClick}
                className="bg-gray-200 w-52 text-black rounded-md px-4 py-2 hover:bg-gray-300 transition duration-300"
            >
                Topic echo {localJson.TopicName}
            </button>

            {localMessage ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>Result: {localMessage}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicPub(json) {
    const [localClient, setLocalClient] = useState<ROSLIB.Topic>(null);
    const [localMessage, setLocalMessage] = useState<string>('');

    const {ros} = useROS();
    const localJson = json.json;

    useEffect(() => {
        if (ros) {

            setLocalClient(new ROSLIB.Topic({
                ros: ros,
                name: localJson.TopicName,
                mesageType: localJson.MessageType
            }));

            // Nettoyage lors du démontage
            return () => {
                //TODO : unsubscribe
            };
        } else {
            console.log('ROS n\'est pas encore prêt.');
        }
    }, []);

    function onHandleClick() {
        if (localClient) {
            localClient.publish(json.Message);
        } else {
            console.log('localClient n\'est pas encore prêt.');
        }
        setLocalMessage('')
        console.log(localMessage)
    }

    useEffect(() => {
        if (localMessage) {
            console.log('localMessage a changé:', localMessage);
            // Vous pouvez exécuter d'autres actions ici si nécessaire
        }
    }, [localMessage]); // Dépendance à localMessage pour réagir à ses changements

    return (
        <div>
            <button
                onClick={onHandleClick}
                className="bg-gray-200 w-52 text-black rounded-md px-4 py-2 hover:bg-gray-300 transition duration-300"
            >
                Topic publish {localJson.TopicName}
            </button>

            {localMessage ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>Result: {localMessage}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementAction({json,serviceKey}) {
    const [goal, setGoal] = useState<ROSLIB.Goal>(null);
    const [localFeedBack, setLocalFeedBack] = useState<string>('');
    const [localResult, setLocalResult] = useState<string>('');

    const {ros} = useROS();
    const localJson = json;

    useEffect(() => {
        if (ros) {
            const localClient = new ROSLIB.ActionClient({
                ros: ros,
                serverName: localJson.ServerName,
                actionName: localJson.ActionName,
            });

            setGoal(new ROSLIB.Goal({
                actionClient: localClient,
                goalMessage: localJson.GoalMessage
            }));
        } else {
            console.log('ROS n\'est pas encore prêt.');
        }

        // Nettoyage lors du démontage
        return () => {
            //todo : unsubscribe
        }
        }, []);

        function onHandleClick() {
            if (goal) {
                goal.on('feedback', function (feedback) {
                    console.log('Feedback: ' + feedback.sequence);
                    setLocalFeedBack(feedback.sequence); //TODO vérifier le type de feedback pour transformer en string
                });

                goal.on('result', function (result) {
                    console.log('Final Result: ' + result.sequence);
                    setLocalResult(result.sequence); //TODO vérifier le type de result pour transformer en string
                });
                goal.send();
            } else {
                console.log('goal n\'est pas encore prêt.');
            }
        }

        return (
            <div>
                <button
                    onClick={onHandleClick}
                    className="bg-gray-200 w-52 text-black rounded-md px-4 py-2 hover:bg-gray-300 transition duration-300"
                >
                    Action {serviceKey}
                </button>

                {localFeedBack ? (
                    <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                        <p>Result: {localFeedBack}</p>
                    </div>
                ) : (
                    <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                        <p></p>
                    </div>
                )}

                {localResult ? (
                    <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                        <p>Result: {localResult}</p>
                    </div>
                ) : (
                    <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                        <p></p>
                    </div>
                )}
            </div>
        );
    }
