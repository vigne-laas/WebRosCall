'use client'
import {useEffect, useRef, useState} from 'react';
import { Carousel } from 'flowbite-react';
import CarouselElement from './CarouselElement';
import data from './layout.json'


export default function HomePage() {

    const pages = data.layout

    return (
        <div className="h-screen w-screen">
            <Carousel slide={false}>
                {pages && 
                Object.entries(pages).map((page)=>(
                    <CarouselElement key={page.toString()} page={page}/>
                ))
                }
            </Carousel>
        </div>
    )
        ;
}
