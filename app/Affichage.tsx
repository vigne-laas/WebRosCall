'use client'
import {useEffect, useState} from 'react';
import {RosElementAction, RosElementService, RosElementTopicEcho, RosElementTopicPub} from "@/app/RosElement";

// Définir l'interface pour chaque type possible de serviceValue
interface ServiceValueInterface {
    type: 'service' | 'topic_echo' | 'topic_pub' | 'action';
    ServiceName?: string;
    ServerName?: string;
    TopicName?: string;
    ServiceType?: string;
    ActionName?: string;
    GoalMessage?: JSON;
    MessageType?: string;
    Message?: JSON;
    Req?: JSON;
    // Ajouter d'autres champs en fonction de la structure du JSON
}


export default function HomePage() {
    const [layout, setLayout] = useState<Record<string, ServiceValueInterface> | null>(null);


    useEffect(() => {
        const fetchLayout = async () => {
            const res = await fetch('/layout.json');
            const data: Record<string, ServiceValueInterface> = await res.json();
            setLayout(data);
        };

        fetchLayout();
    }, []);

    return (
        <div className="grid grid-cols-5 gap-4 p-5">
            {layout && (
                Object.entries(layout).map(([serviceKey, serviceValue]) => (
                    <div key={serviceKey}>
                        {/* Vérifier le type et rendre le bon composant */}
                        {serviceValue.type === 'service' && (
                            <>
                                <RosElementService param={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'topic_echo' && (
                            <>
                                <RosElementTopicEcho param={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'topic_pub' && (
                            <>
                                <RosElementTopicPub param={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'action' && (
                            <>
                                <RosElementAction param={serviceValue} serviceKey={serviceKey} />
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
        ;
}
