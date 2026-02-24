import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SecurityToken implements ICredentialType {
	name = 'securityToken';
	displayName = 'Security Token';
	documentationUrl = '';
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
