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
		usableAsTool: true,
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
				name: 'securityTokenApi',
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
			{
				displayName: 'Valid Response Override',
				name: 'validResponse',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'If set, this JSON/text will be returned on Output 0 instead of the original item',
			},
			{
				displayName: 'Invalid Response Override',
				name: 'invalidResponse',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'If set, this JSON/text will be returned on Output 1 instead of the original item',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const validItems: INodeExecutionData[] = [];
		const invalidItems: INodeExecutionData[] = [];

		const credentials = await this.getCredentials('securityTokenApi');
		const securityToken = credentials.token as string;

		const validResponseOverride = this.getNodeParameter('validResponse', 0) as string;
		const invalidResponseOverride = this.getNodeParameter('invalidResponse', 0) as string;

		const getResultItem = (override: string, index: number, originalItem: INodeExecutionData): INodeExecutionData => {
			if (override && override.trim() !== '') {
				try {
					return {
						json: JSON.parse(override),
						pairedItem: {
							item: index,
						},
					};
				} catch {
					return {
						json: {
							response: override,
						},
						pairedItem: {
							item: index,
						},
					};
				}
			}
			return {
				...originalItem,
				pairedItem: {
					item: index,
				},
			};
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const valueToValidate = this.getNodeParameter('valueToValidate', i) as string;

				if (valueToValidate === securityToken) {
					validItems.push(getResultItem(validResponseOverride, i, items[i]));
				} else {
					invalidItems.push(getResultItem(invalidResponseOverride, i, items[i]));
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
