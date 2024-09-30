'use client'
import {useROS} from "@/app/InstanceRos";
import {useEffect, useState} from "react";
// @ts-ignore
import ROSLIB from 'roslib';
import {ServiceValueInterface} from '@/app/interface';
import './style.css'
import { Button, ButtonGroup } from "@nextui-org/button";

function style(color:string){
    switch (color) {
        case "gris":
            return "bg-default-500"
        case "bleu":
            return "bg-primary-500"
        case "rouge":
            return "bg-danger-500"
    }
}

export function RosElementService({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localClient, setLocalClient] = useState<ROSLIB.Service>(null);
    const [localMessage, setLocalMessage] = useState<string>('');
    const [ros, setRos] = useState<ROSLIB.Ros>(null);
    const [color, setColor] = useState<string>(null);
    const localJson = param;

    const {rosList, rosParamList} = useROS();
    // console.log(localJson)

    useEffect(() => {
        if(rosList){
            setRos(rosList.get(param.ros))
            setColor(rosParamList.get(param.ros))
        }
    }, [rosList,rosParamList]);

    useEffect(() => {
        if (ros) {
            console.log('initiation de localClient')
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
    }, [ros]);

    function onHandleClick() {
        const request = new ROSLIB.ServiceRequest(localJson.Req);

        if (localClient) {
            setLocalMessage("Appel du service effectué")
            localClient.callService(request, function (result: ROSLIB.Result) {
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
        <div className="flex flex-col">
            <Button radius="none"
                onPress={onHandleClick}
                className={`serviceBouton text-2xl w-full px-4 py-2 break-words whitespace-pre-wrap h-full ${color ? style(color) : ''}`}
            >
                Call Service {serviceKey}
            </Button>

            {localMessage ? (
                <div className="serviceMessage p-4 bg-gray-700 text-white w-full h-auto flex items-center justify-center">
                    <p className='break-words whitespace-pre-wrap'>{JSON.stringify(localMessage, null, 2)}</p>
                </div>
            ) : (
                <div className="serviceMessage p-4 bg-gray-700 w-full text-white flex items-center justify-center">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicEcho({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localMessage, setLocalMessage] = useState<ROSLIB.Message>('');
    const [ros, setRos] = useState<ROSLIB.Ros>(null);
    const [color, setColor] = useState<string>(null);
    const localJson = param;

    const {rosList, rosParamList} = useROS();
    // console.log(localJson)

    useEffect(() => {
        if(rosList){
            setRos(rosList.get(param.ros))
            setColor(rosParamList.get(param.ros))
        }
    }, [rosList,rosParamList]);

    useEffect(() => {
        if (ros) {
            console.log('initiation de localClient')

            const localClient = new ROSLIB.Topic({
                ros: ros,
                name: localJson.TopicName,
                messageType: localJson.MessageType
            
            });

            localClient.subscribe((message: ROSLIB.Message) => {
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
        <div className="flex flex-col">
            <Button radius="none"
                className={`topicEchoBouton text-2xl w-full px-4 py-2 break-words whitespace-pre-wrap h-full ${color ? style(color) : ''}`}
            >
                Topic echo {serviceKey}
            </Button>

            {localMessage ? (
                <div className="topicEchoMessage p-4 bg-gray-700 text-white w-full h-auto flex items-center justify-center">
                    <p className='break-words whitespace-pre-wrap'>{JSON.stringify(localMessage, null, 2)}</p>
                </div>
            ) : (
                <div className="topicEchoMessage p-4 bg-gray-700 w-full h-12 text-white flex items-center justify-center">
                    <p></p>
                </div>
            )}
        </div>
    );
}

export function RosElementTopicPub({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [localClient, setLocalClient] = useState<ROSLIB.Topic>(null);
    const [ros, setRos] = useState<ROSLIB.Ros>(null);
    const [color, setColor] = useState<string>(null);
    const localJson = param;

    const {rosList, rosParamList} = useROS();
    // console.log(localJson)

    useEffect(() => {
        if(rosList){
            setRos(rosList.get(param.ros))
            setColor(rosParamList.get(param.ros))
        }
    }, [rosList,rosParamList]);

    useEffect(() => {
        if (ros) {
            console.log('initiation de localClient')

            setLocalClient(new ROSLIB.Topic({
                ros: ros,
                name: localJson.TopicName,
                messageType: localJson.MessageType
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
        <div className="flex flex-col">
            <Button radius="none"
                onClick={onHandleClick}
                className={`topicPublish text-2xl w-full px-4 py-2 break-words whitespace-pre-wrap h-full ${color ? style(color) : ''}`}>
                Topic publish {serviceKey}
            </Button>
        </div>
    );
}

export function RosElementAction({param, serviceKey}: { param: ServiceValueInterface, serviceKey: string }) {
    const [goal, setGoal] = useState<ROSLIB.Goal>(null);
    const [localFeedBack, setLocalFeedBack] = useState<string>('');
    const [localResult, setLocalResult] = useState<string>('');
    const [ros, setRos] = useState<ROSLIB.Ros>(null);
    const [color, setColor] = useState<string>(null);
    const localJson = param;

    const {rosList, rosParamList} = useROS();
    // console.log(localJson)

    useEffect(() => {
        if(rosList){
            setRos(rosList.get(param.ros))
            setColor(rosParamList.get(param.ros))
        }
    }, [rosList,rosParamList]);

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
        setLocalFeedBack('Action demandé');
        if (goal) {
            goal.on('feedback', function (feedback: ROSLIB.Feedback) {
                console.log('Feedback: ' + feedback);
                setLocalFeedBack(feedback.output);
            });

            goal.on('result', function (result: ROSLIB.Result) {
                console.log('Final Result: ' + result);
                setLocalResult(result.result_message);
            });
            goal.send();
        } else {
            console.log('goal n\'est pas encore prêt.');
        }
    }

    return (
        <div className="flex flex-col">
            <Button radius="none"
                onClick={onHandleClick}
                className={`actionBouton text-2xl w-full px-4 py-2 break-words whitespace-pre-wrap h-full ${color ? style(color) : ''}`}>
                Action {serviceKey}
            </Button>

            {localFeedBack ? (
                <div className="actionFeedback p-4 bg-gray-700 text-white w-full h-auto flex items-center justify-center">
                    <p className='break-words whitespace-pre-wrap'>{JSON.stringify(localFeedBack, null, 2)}</p>
                </div>
            ) : (
                <div className="actionFeedback p-4 bg-gray-700 w-full h-12 text-white flex items-center justify-center">
                    <p></p>
                </div>
            )}

            {localResult ? (
                <div className="actionResult p-4 bg-gray-700 text-white w-full h-auto flex items-center justify-center">
                    <p className='break-words whitespace-pre-wrap'>{JSON.stringify(localResult, null, 2)}</p>
                </div>
            ) : (
                <div className="actionResult p-4 bg-gray-700 w-full h-12 text-white flex items-center justify-center">
                    <p></p>
                </div>
            )}
        </div>
    );
}
