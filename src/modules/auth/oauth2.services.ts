import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
//import { googleClientId, googleClientSecret, redirectUrl } from '../../app.settings';

export interface IOAuthConfig {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    passReqToCallback: boolean;
}

export class OAuth2Service {

    private readonly _clientId: string = process.env.M_GOOGLE_CLIENT_ID;
    private readonly _clientSecret: string = process.env.M_GOOGLE_SECRET;
    private readonly _redirectUrl: string = process.env.GOOGLE_CALLBACK


    private _oauth2Client: OAuth2Client;

    constructor() {

        this._oauth2Client = new google.auth.OAuth2(
            this._clientId,
            this._clientSecret,
            this._redirectUrl,
        );

    }

    getConfig(): IOAuthConfig {
        return {
            clientID: this._clientId,
            clientSecret: this._clientSecret,
            callbackURL: this._redirectUrl,
            passReqToCallback: true,
        }
    }

    async verify(token: string) {
        return await this._oauth2Client.verifyIdToken({
            idToken: token,
            audience: this._clientId
        })
    }

    async getToken(code: string): Promise<GetTokenResponse>{
        return await this._oauth2Client.getToken(code);
    }
}