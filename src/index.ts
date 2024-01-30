import { MqttHandler } from './MqttHandler';

// MQTT Broker URL and Topics
const brokerUrl = 'mqtt://lorawan-01.cropwatch.io'; // Replace with your MQTT broker URL
const sourceTopic = '#'; // Replace with your source topic
const destinationTopic = 'destination/topic'; // Replace with your destination topic

// Create an instance of MqttHandler
const mqttHandler = new MqttHandler(brokerUrl, destinationTopic);

// Start listening to the source MQTT topic
mqttHandler.subscribeToTopic(sourceTopic);

console.log('Service is running...');
