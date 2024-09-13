import HomePage from "@/app/Affichage";
import {ROSProvider} from '@/app/InstanceRos';


export default function Page() {
    return (
        <ROSProvider>
            <HomePage/>
        </ROSProvider>
    );
}