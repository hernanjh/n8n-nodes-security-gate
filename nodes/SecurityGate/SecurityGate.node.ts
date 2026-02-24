import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class SecurityGate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Security Gate',
		name: 'securityGate',
		icon: 'file:security-gate.svg',
		group: ['transform'],
		version: 1,
		description: 'Validate an input value against a stored secure credential',
		defaults: {
			name: 'Security Gate',
		},
		inputs: ['main'],
		outputs: ['main', 'main'],
		outputNames: ['Valid', 'Invalid'],
		credentials: [
			{
				name: 'securityToken',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Value to Validate',
				name: 'valueToValidate',
				type: 'string',
				default: '={{ $json.headers["x-api-key"] }}',
				description: 'The value from the flow (e.g. Header) to be compared against the selected credential',
				required: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const validItems: INodeExecutionData[] = [];
		const invalidItems: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('securityToken');
		const securityToken = credentials.token as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const valueToValidate = this.getNodeParameter('valueToValidate', i) as string;

				if (valueToValidate === securityToken) {
					validItems.push({
						...items[i],
						pairedItem: {
							item: i,
						},
					});
				} else {
					invalidItems.push({
						...items[i],
						pairedItem: {
							item: i,
						},
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					invalidItems.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [validItems, invalidItems];
	}
}
