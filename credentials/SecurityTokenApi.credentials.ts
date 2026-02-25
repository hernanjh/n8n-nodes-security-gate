import { ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class SecurityTokenApi implements ICredentialType {
	name = 'securityTokenApi';
	displayName = 'Security Token API';
	icon = 'file:security-gate.svg';
	testedBy = ['securityGate'];
	documentationUrl = 'https://docs.n8n.io/integrations/community-nodes/';
	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			url: 'https://docs.n8n.io',
		},
	};
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'The secret token to compare against',
		},
	];
}
