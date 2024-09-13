'use client'
import ROSLIB from 'roslib';
import React, { createContext, useState, useEffect, useContext } from 'react';

const ROSContext = createContext(null);

export const useROS = () => {
    return useContext(ROSContext);
};

export const ROSProvider = ({ children }) =>  {
    const [ros, setRos] = useState<ROSLIB.Ros | null>(null);

    useEffect(() => {

        // Utiliser l'instance ROS fournie, sinon créer une nouvelle instance
        const localRos = new ROSLIB.Ros({url: 'ws://localhost:9090'});

        localRos.on('connection', () => console.log('Connexion réussie (local)'));
        localRos.on('error', (error) => console.error('Erreur de connexion:', error));
        localRos.on('close', () => console.log('Connexion fermée'));
        setRos(localRos);


        // Nettoyage lors du démontage
        return () => {
            localRos.close();
        };
    }, []);

    return (
        <ROSContext.Provider value={{ ros }}>
            {children}
        </ROSContext.Provider>
    );
}