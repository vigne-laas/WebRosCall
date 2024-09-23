'use client'
// @ts-ignore
import ROSLIB from 'roslib';
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';

const ROSContext = createContext(null);

export const useROS = () => {
    return useContext(ROSContext);
};

// @ts-ignore
export const ROSProvider = ({ children }) =>  {
    const [ros, setRos] = useState<ROSLIB.Ros | null>(null);
    const instanceRos = useRef<ROSLIB.Ros>(null);

    useEffect(() => {

        if(!instanceRos.current) {
            const localRos = new ROSLIB.Ros({url: 'ws://localhost:9090'});

            localRos.on('connection', () => console.log('Connexion réussie (local)'));
            localRos.on('error', (error: ROSLIB.error) => console.error('Erreur de connexion:', error));
            localRos.on('close', () => console.log('Connexion fermée'));
            setRos(localRos);
            instanceRos.current = localRos
        }
    }, []);

    return (
        <div>
        <ROSContext.Provider value={{ros}}>

            {children}
        </ROSContext.Provider>
        </div>
    );
}