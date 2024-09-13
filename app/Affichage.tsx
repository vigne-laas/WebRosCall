'use client'
import {useEffect, useState} from 'react';
import {RosElementAction, RosElementService, RosElementTopicEcho, RosElementTopicPub} from "@/app/RosElement";

export default function HomePage() {
    const [layout, setLayout] = useState(null);

    useEffect(() => {

        const fetchLayout = async () => {
            const res = await fetch('/layout.json');
            const data = await res.json();
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
                                <RosElementService json={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'topic_echo' && (
                            <>
                                <RosElementTopicEcho json={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'topic_pub' && (
                            <>
                                <RosElementTopicPub json={serviceValue} />
                            </>
                        )}

                        {serviceValue.type === 'action' && (
                            <>
                                <RosElementAction json={serviceValue} actionName={serviceKey} />
                            </>
                        )}
                    </div>
                ))
            )}
        </div>
    )
        ;
}
