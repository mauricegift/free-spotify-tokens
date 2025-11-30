const axios = require('axios');
const fs = require('fs');

const GIFTED_CREDENTIALS = process.env.GIFTED_CREDENTIALS;
const GIFTED_ENDPOINT = process.env.GIFTED_ENDPOINT;

async function getSpotifyToken(client_id, client_secret) {
    try {
        const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
        
        const response = await axios.post(
            GIFTED_ENDPOINT,
            "grant_type=client_credentials",
            {
                headers: { 
                    Authorization: "Basic " + basic,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }
        );
        
        return {
            status: true,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
            access_token: response.data.access_token
        };
    } catch (error) {
        console.error(`Error fetching token for client ${client_id.substring(0, 10)}...:`, error.response?.data || error.message);
        return { 
            status: false, 
            msg: "Failed to retrieve Spotify credentials.",
            error: error.response?.data || error.message 
        };
    }
}

function getCredentialsFromEnv() {
    try {
        if (!GIFTED_CREDENTIALS) {
            throw new Error('GIFTED_CREDENTIALS environment variable is not set');
        }
        
        const credentials = JSON.parse(GIFTED_CREDENTIALS);
        
        if (!Array.isArray(credentials)) {
            throw new Error('Credentials data is not an array');
        }
        
        console.log(`Loaded ${credentials.length} credential sets from environment`);
        return credentials;
        
    } catch (error) {
        console.error('Error parsing credentials from environment:', error.message);
        throw new Error(`Failed to parse credentials: ${error.message}`);
    }
}

async function main() {
    try {
        console.log('Starting token update process...');
        console.log('Token endpoint:', GIFTED_ENDPOINT);
        
        const credentials = getCredentialsFromEnv();
        
        console.log(`Processing ${credentials.length} credential sets...`);
        
        const tokens = [];
        let successCount = 0;
        let failCount = 0;
        
        for (const [index, cred] of credentials.entries()) {
            if (!cred.client_id || !cred.client_secret) {
                console.log(`✗ Skipping invalid credential set at index ${index}`);
                failCount++;
                continue;
            }
            
            console.log(`[${index + 1}/${credentials.length}] Fetching token for client: ${cred.client_id.substring(0, 10)}...`);
            
            const tokenResult = await getSpotifyToken(cred.client_id, cred.client_secret);
            
            if (tokenResult.status) {
                tokens.push({
                    expires_in: tokenResult.expires_in,
                    token_type: tokenResult.token_type,
                    access_token: tokenResult.access_token
                });
                console.log(`✓ Successfully fetched token for ${cred.client_id.substring(0, 10)}...`);
                successCount++;
            } else {
                console.log(`✗ Failed to fetch token for ${cred.client_id.substring(0, 10)}...: ${tokenResult.msg}`);
                failCount++;
            }
            
            if (index < credentials.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        
        const tokensData = {
            failed_tokens: failCount,
            successful_tokens: successCount,
            last_updated: new Date().toISOString(),
            tokens: tokens,
        };
        
        fs.writeFileSync('tokens.json', JSON.stringify(tokensData, null, 2));
        console.log(`✅ Successfully generated tokens.json`);
        console.log(`📊 Summary: ${successCount} successful, ${failCount} failed out of ${credentials.length} total`);
        
    } catch (error) {
        console.error('❌ Error in main process:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}
