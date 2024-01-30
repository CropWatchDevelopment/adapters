"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttHandler = void 0;
const mqtt = __importStar(require("mqtt"));
const AdapterSelector_1 = require("./AdapterSelector");
const supabaseClient_1 = require("./database/supabase/supabaseClient");
class MqttHandler {
    constructor(brokerUrl, destinationTopic) {
        this.destinationTopic = destinationTopic;
        this.client = mqtt.connect(brokerUrl, {
            username: 'cropwatch-mon',
            password: 'NNSXS.YCJHLLJ5AHB6AYRVLWHFYLYIZEBU76TOAAUUTII.IKFYKZA5LIUNX535QWJDXQBBQOOS2AKBHATWBQU2MEWICB2FJV7Q',
            protocolVersion: 3,
        });
        this.adapterSelector = new AdapterSelector_1.AdapterSelector();
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker.');
        });
        this.client.on('error', (error) => {
            console.error('Error: ', error);
        });
    }
    subscribeToTopic(topic, handleAdapterProcessing = true) {
        this.client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to ${topic}`);
            }
            else {
                console.error('Subscription error:', err);
            }
        });
        this.client.on('message', (topic, message) => {
            if (handleAdapterProcessing) {
                this.processMessageWithAdapter(message);
            }
            else {
                // Handle messages without adapter processing if needed
            }
        });
    }
    processMessageWithAdapter(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonMessage;
            try {
                jsonMessage = JSON.parse(message.toString());
            }
            catch (error) {
                console.error('Error parsing message:', error);
                return;
            }
            // FIgure out what is what right here!!!
            const dev_eui = jsonMessage.end_device_ids.dev_eui;
            const { data, error } = yield supabaseClient_1.supabase.from('cw_devices').select('*, cw_device_type(*)').eq('dev_eui', dev_eui).single();
            console.log(data, error);
            if (!error) {
                const company = data.cw_device_type.manufacturer;
                const product = data.cw_device_type.model;
                const version = data.cw_device_type.decoder;
                const adapter = this.adapterSelector.selectAdapter(company, product, version);
                if (adapter) {
                    const processedMessage = adapter.modifyMessage(jsonMessage);
                    this.publishMessage(this.destinationTopic, processedMessage);
                }
                else {
                    console.warn(`No adapter found for ${company}, ${product}, version ${version}`);
                }
            }
        });
    }
    publishMessage(topic, message) {
        this.client.publish(topic, JSON.stringify(message));
    }
}
exports.MqttHandler = MqttHandler;
//# sourceMappingURL=MqttHandler.js.map