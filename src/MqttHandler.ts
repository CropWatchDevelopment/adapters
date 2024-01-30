import * as mqtt from 'mqtt';
import { AdapterSelector } from './AdapterSelector';
import { supabase } from './database/supabase/supabaseClient';

export class MqttHandler {
    private client: mqtt.MqttClient;
    private adapterSelector: AdapterSelector;

    constructor(brokerUrl: string, private destinationTopic: string) {
        this.client = mqtt.connect(brokerUrl, {
            username: 'cropwatch-mon',
            password: 'NNSXS.YCJHLLJ5AHB6AYRVLWHFYLYIZEBU76TOAAUUTII.IKFYKZA5LIUNX535QWJDXQBBQOOS2AKBHATWBQU2MEWICB2FJV7Q',
            protocolVersion: 3,
        });
        this.adapterSelector = new AdapterSelector();

        this.client.on('connect', () => {
            console.log('Connected to MQTT broker.');
        });

        this.client.on('error', (error) => {
            console.error('Error: ', error);
        });
    }

    public subscribeToTopic(topic: string, handleAdapterProcessing: boolean = true): void {
        this.client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to ${topic}`);
            } else {
                console.error('Subscription error:', err);
            }
        });

        this.client.on('message', (topic, message) => {
            if (handleAdapterProcessing) {
                this.processMessageWithAdapter(message);
            } else {
                // Handle messages without adapter processing if needed
            }
        });
    }

    private async processMessageWithAdapter(message: Buffer) {
        let jsonMessage;
        try {
            jsonMessage = JSON.parse(message.toString());
        } catch (error) {
            console.error('Error parsing message:', error);
            return;
        }

        // FIgure out what is what right here!!!
        const dev_eui = jsonMessage.end_device_ids.dev_eui;
        const { data, error } = await supabase.from('cw_devices').select('*, cw_device_type(*)').eq('dev_eui', dev_eui).single();

        console.log(data, error);

        if (!error) {
            const company = data.cw_device_type.manufacturer;
            const product = data.cw_device_type.model;
            const version = data.cw_device_type.decoder;
            const adapter = this.adapterSelector.selectAdapter(company, product, version);
            if (adapter) {
                const processedMessage = adapter.modifyMessage(jsonMessage);
                this.publishMessage(this.destinationTopic, processedMessage);
            } else {
                console.warn(`No adapter found for ${company}, ${product}, version ${version}`);
            }
        }
    }

    public publishMessage(topic: string, message: any): void {
        this.client.publish(topic, JSON.stringify(message));
    }
}
