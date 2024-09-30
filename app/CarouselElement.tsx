import {RosElementAction, RosElementService, RosElementTopicEcho, RosElementTopicPub} from "@/app/RosElement";

export default function CarouselElement({page}) {

    return (
        <div className="grid grid-cols-5 gap-4 p-5">
        {page && page[1].map((value, key)=>(
        <div key={key} className='w-full h-full'>
                        {/* Vérifier le type et rendre le bon composant */}
                        {value.type === 'service' && (
                            <>
                                <RosElementService param={value} serviceKey={value.name} />
                            </>
                        )}

                        {value.type === 'topic_echo' && (
                            <>
                                <RosElementTopicEcho param={value} serviceKey={value.name} />
                            </>
                        )}

                        {value.type === 'topic_pub' && (
                            <>
                                <RosElementTopicPub param={value} serviceKey={value.name} />
                            </>
                        )}

                        {value.type === 'action' && (
                            <>
                                <RosElementAction param={value} serviceKey={value.name} />
                            </>
                        )}
                    </div>
        ))}
        </div>
    )
}