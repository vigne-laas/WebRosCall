'use client'
import { Carousel } from 'flowbite-react';
import CarouselElement from './CarouselElement';
import data from './layout.json'
import { useROS } from './InstanceRos';
import { useEffect, useRef, useState } from 'react';

export default function HomePage() {

    const pages = data.layout
    const {rosList} = useROS();
    const [rosListUsefull, setRosListUsefull] = useState<Map<string, ROSLIB.Ros>>(null);
    const isTimer = useRef(null)

    function color(boolean){
        if(boolean) return "green";
        return "red"
    }

    useEffect(() => {
        if(rosList)
            setRosListUsefull(rosList)
    }, [rosList]);

    isTimer.current = setInterval(() => {
        setRosListUsefull(rosList)
      }, 5000);

    return (
        <div className='h-screen'>
            <div className='grid grid-cols-5 h-6'>
                {rosListUsefull && Array.from(rosListUsefull.keys()).map((key:string)=>{
                    let ros = rosList.get(key);
                    let style = {
                        background:color(ros.isConnected)
                    }
                    return <div key={key} style={style}>{key}</div> })}
            </div>
            <div className="h-full w-screen">
                <Carousel slide={false}>
                    {pages && 
                    Object.entries(pages).map((page)=>(
                        <CarouselElement key={page.toString()} page={page}/>
                    ))
                    }
                </Carousel>
            </div>
        </div>
    )
        ;
}
