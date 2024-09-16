'use client'
import {useEffect, useState} from 'react';
import {RosElementAction, RosElementService, RosElementTopicEcho, RosElementTopicPub} from "@/app/RosElement";
import {ServiceValueInterface} from '@/app/interface';


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
        <div className="grid grid-cols-5 gap-4 p-5 h-full">
            {layout && (
                Object.entries(layout).map(([serviceKey, serviceValue]) => (
                    <div key={serviceKey} className='w-full h-full'>
                        {/* Vérifier le type et rendre le bon composant */}
                        {serviceValue.type === 'service' && (
                            <>
                                <RosElementService param={serviceValue} serviceKey={serviceKey} />
                            </>
                        )}

                        {serviceValue.type === 'topic_echo' && (
                            <>
                                <RosElementTopicEcho param={serviceValue} serviceKey={serviceKey} />
                            </>
                        )}

                        {serviceValue.type === 'topic_pub' && (
                            <>
                                <RosElementTopicPub param={serviceValue} serviceKey={serviceKey} />
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
