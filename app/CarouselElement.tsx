import {RosElementAction, RosElementService, RosElementTopicEcho, RosElementTopicPub} from "@/app/RosElement";

export default function CarouselElement({page}) {

    const pageName = page[1].name
    const pageContent = page[1].content

    return (
        <>
        <div className="w-full text-white text-2xl text-center"> {pageName} </div>
        <div className="grid grid-cols-5 gap-4 p-5">
        {page && pageContent.map((value, key)=>(
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
        </>
    )
}