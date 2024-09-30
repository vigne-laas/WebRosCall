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

    if(rosList){
        console.log(rosList)
        Array.from(rosList.entries()).map((value, key)=>(console.log("value compil",value,key)))
        Array.from(rosList.keys()).map((key)=>(console.log("key compil",key)))
    }

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
      }, 10000);

    return (
        <div className='h-screen'>
            <div className='grid grid-cols-5 h-6'>
                {rosListUsefull && Array.from(rosListUsefull.keys()).map((key:string)=>{
                    let ros = rosList.get(key);
                    console.log(ros)
                    console.log(rosList)
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
