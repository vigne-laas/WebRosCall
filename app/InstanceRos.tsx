'use client'
import ROSLIB from 'roslib';
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import data from './layout.json'

const ROSContext = createContext(null);

export const useROS = () => {
    return useContext(ROSContext);
};

// @ts-ignore
export const ROSProvider = ({ children }) =>  {
    const [rosList, setRosList] = useState<Map<string, ROSLIB.Ros> | null>(null);
    const [rosParamList, setParamRosList] = useState<Map<string, string> | null>(null);
    const rosInstanceList = useRef<Map<string, ROSLIB.Ros>>(null);

    const rosInfo = data.ros;

    const updateRosList = (key: string, value: ROSLIB.Ros) => {
        setRosList((prevRosList) => {
            const newMap = new Map(prevRosList);
            newMap.set(key, value);
            return newMap;
        });
    };

    const updateParamRosList = (key: string, value:string) => {
        setParamRosList((prevParamRosList) => {
            const newMap = new Map(prevParamRosList);
            newMap.set(key, value);
            return newMap;
        });
    };


    useEffect(() => {
        if(!rosInstanceList.current && !rosList) {
            let localRosList = new Map();
            rosInfo.map((ros)=>{
                const localRos = new ROSLIB.Ros({url: ros.url});
                localRos.on('connection', () => console.log('Connexion réussie (local)'));
                localRos.on('error', (error: ROSLIB.Message) => console.error('Erreur de connexion:', error));
                localRos.on('close', () => console.log('Connexion fermée')); 
                updateRosList(ros.instanceName,localRos)
                localRosList.set(ros.instanceName,localRos)
                updateParamRosList(ros.instanceName,ros.couleur);
            })
        rosInstanceList.current = localRosList;
        }
    }, [rosList]);

    return (
        <div>
        <ROSContext.Provider value={{rosList, rosParamList}}>
            {children}
        </ROSContext.Provider>
        </div>
    );
}