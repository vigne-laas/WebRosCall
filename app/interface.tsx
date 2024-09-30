
// Définir l'interface pour chaque type possible de serviceValue
export interface ServiceValueInterface {
    type: 'service' | 'topic_echo' | 'topic_pub' | 'action';
    ServiceName?: string;
    ros:string;
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