'use strict';

const process = require('process');
require('@opentelemetry/api');
const opentelemetry = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

// Import the Instana OpenTelemetry Exporter
const { InstanaExporter } = require('@instana/opentelemetry-exporter');

// Instantiate the Instana Exporter.
// Make sure to provide the proper agent key and backend endpoint URL.
// You can provide the agent key and backend endpoint URL via the following environment variables:
// * INSTANA_AGENT_KEY
// * INSTANA_ENDPOINT_URL
//
// Alternatively, you can pass these values as an argument to the constructor (see bellow), although it is strongly
// recommended that such sensitive data is not hard coded in the code base.
// Eg: const instanaTraceExporter = new InstanaExporter({ agentKey: 'agent_key', endpointUrl: 'endpoint_url' });
const instanaTraceExporter = new InstanaExporter();

const nodeAutoInstrumentations = getNodeAutoInstrumentations();

const sdk = new opentelemetry.NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'CodeEngineApps-tokjp'
  }),
  // Configure OpenTelemetry to use the Instana Exporter
  traceExporter: instanaTraceExporter,
  instrumentations: [nodeAutoInstrumentations]
});

sdk
  .start()
  .then(() => console.log('Tracing initialized'))
  .catch(error => console.log('Error initializing tracing', error));

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch(error => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
