'use client'
import {useROS} from "@/app/InstanceRos";
import {useEffect, useState} from "react";
// @ts-ignore
import ROSLIB from 'roslib';
import {ServiceValueInterface} from '@/app/interface';


export function RosElementService({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localClient, setLocalClient] = useState<ROSLIB.Service>(null);
    const [localMessage, setLocalMessage] = useState<string>('');

    const {ros} = useROS();
    const localJson = param;
    console.log(localJson)

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
        const request = new ROSLIB.ServiceRequest(localJson.Req);

        if (localClient) {
            localClient.callService(request, function (result: ROSLIB.result) {
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
                Call Service {serviceKey}
            </button>

            {localMessage ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>{JSON.stringify(localMessage)}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicEcho({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localMessage, setLocalMessage] = useState<string>('');

    const {ros} = useROS();
    const localJson = param;
    console.log(localJson);

    useEffect(() => {
        if (ros) {
            console.log('initiation de localClient')

            const localClient = new ROSLIB.Topic({
                ros: ros,
                name: localJson.TopicName,
                mesageType: localJson.MessageType
            });

            localClient.subscribe((message: ROSLIB.message) => {
                setLocalMessage(message);
                console.log("message", message)
            });

            // Nettoyage lors du démontage
            return () => {
                //TODO : unsubscribe
            };
        } else {
            console.log('ROS n\'est pas encore prêt.');
        }
    }, [ros]);


    return (
        <div>
            <button
                className="bg-gray-200 w-52 text-black rounded-md px-4 py-2 hover:bg-gray-300 transition duration-300"
            >
                Topic echo {serviceKey}
            </button>

            {localMessage ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>{JSON.stringify(localMessage)}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicPub({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localClient, setLocalClient] = useState<ROSLIB.Topic>(null);

    const {ros} = useROS();
    const localJson = param;
    console.log(localJson)

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
            localClient.publish(localJson.Message);
            console.log("json.Message", localJson.Message)
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
                Topic publish {serviceKey}
            </button>
        </div>
    );
}

export function RosElementAction({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [goal, setGoal] = useState<ROSLIB.Goal>(null);
    const [localFeedBack, setLocalFeedBack] = useState<string>('');
    const [localResult, setLocalResult] = useState<string>('');

    const {ros} = useROS();
    const localJson = param;
    console.log(localJson);

    useEffect(() => {
        if (ros) {
            console.log('initiation de localClient')
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
    }, [ros]);

    function onHandleClick() {
        setLocalResult('');
        setLocalFeedBack('');
        if (goal) {
            goal.on('feedback', function (feedback: ROSLIB.feedback) {
                console.log('Feedback: ' + feedback);
                setLocalFeedBack(feedback.output);
            });

            goal.on('result', function (result: ROSLIB.result) {
                console.log('Final Result: ' + result);
                setLocalResult(result.result_message);
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
                    <p>{JSON.stringify(localFeedBack)}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}

            {localResult ? (
                <div className="bg-gray-800 text-white w-52 h-12 flex items-center justify-center rounded-md">
                    <p>{JSON.stringify(localResult)}</p>
                </div>
            ) : (
                <div className="bg-gray-800 w-52 h-9 text-white flex items-center justify-center rounded-md">
                    <p></p>
                </div>
            )}
        </div>
    );
}
