import {
  httpClient,
  HttpMethod,
  HttpRequest,
} from '@activepieces/pieces-common';
import {
  createPiece,
  PieceAuth,
  Property,
} from '@activepieces/pieces-framework';
import { calendarEventChanged } from './lib/triggers/calendar-event';
import { PieceCategory } from '@activepieces/shared';

export const weblingAuth = PieceAuth.CustomAuth({
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Base URL',
      required: true,
      defaultValue: 'example.webling.ch',
    }),
    apikey: PieceAuth.SecretText({
      displayName: 'API Key',
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const request: HttpRequest = {
        method: HttpMethod.GET,
        url: `https://${auth.baseUrl}/api/1/member`,
        headers: {
          apikey: auth.apikey,
        },
      };
      await httpClient.sendRequest(request);
      return {
        valid: true,
      };
    } catch (e: any) {
      return {
        valid: false,
        error: e?.message,
      };
    }
  },
});

export const webling = createPiece({
  displayName: 'Webling',
  auth: weblingAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/webling.png',
  categories: [PieceCategory.PRODUCTIVITY],
  authors: ['felifluid'],
  actions: [],
  triggers: [calendarEventChanged],
});
