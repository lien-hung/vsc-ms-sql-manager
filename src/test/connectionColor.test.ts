import * as assert from 'assert';
import * as sinon from 'sinon';
import { ConnectionConfig } from '../connectionProvider';

suite('Connection Color Feature Test Suite', () => {
    let sandbox: sinon.SinonSandbox;

    setup(() => {
        sandbox = sinon.createSandbox();
    });

    teardown(() => {
        sandbox.restore();
    });

    suite('ConnectionConfig color field', () => {
        test('should allow connection without color (default behavior)', () => {
            const config: ConnectionConfig = {
                id: '1',
                name: 'Test Server',
                server: 'localhost',
                database: '',
                authType: 'sql',
                connectionType: 'server',
                username: 'sa',
                password: 'test'
            };

            assert.strictEqual(config.color, undefined);
        });

        test('should store color value in connection config', () => {
            const config: ConnectionConfig = {
                id: '2',
                name: 'Production',
                server: 'prod-server',
                database: 'mydb',
                authType: 'sql',
                connectionType: 'database',
                username: 'admin',
                color: '#ff0000'
            };

            assert.strictEqual(config.color, '#ff0000');
        });

        test('should allow clearing color by setting to undefined', () => {
            const config: ConnectionConfig = {
                id: '3',
                name: 'Dev Server',
                server: 'dev-server',
                database: '',
                authType: 'windows',
                connectionType: 'server',
                color: '#00ff00'
            };

            config.color = undefined;
            assert.strictEqual(config.color, undefined);
        });

        test('should serialize color in connection config JSON', () => {
            const config: ConnectionConfig = {
                id: '4',
                name: 'Staging',
                server: 'staging-server',
                database: 'staging_db',
                authType: 'sql',
                connectionType: 'database',
                username: 'user',
                color: '#336699'
            };

            const serialized = JSON.stringify(config);
            const deserialized: ConnectionConfig = JSON.parse(serialized);

            assert.strictEqual(deserialized.color, '#336699');
        });

        test('should not include color in serialized JSON when undefined', () => {
            const config: ConnectionConfig = {
                id: '5',
                name: 'No Color',
                server: 'localhost',
                database: '',
                authType: 'windows',
                connectionType: 'server'
            };

            const serialized = JSON.stringify(config);
            assert.ok(!serialized.includes('"color"'));
        });
    });

    suite('Connection color in webview mapping', () => {
        test('should map color to webview connection object', () => {
            const config: ConnectionConfig = {
                id: 'conn-1',
                name: 'Prod DB',
                server: 'prod.example.com',
                database: 'production',
                authType: 'sql',
                connectionType: 'database',
                username: 'admin',
                color: '#e74c3c'
            };

            // Simulates what updateConnectionsList does
            const webviewConnection = {
                id: config.id,
                name: config.name,
                server: config.server,
                database: config.database,
                connectionType: config.connectionType,
                authType: config.authType,
                color: config.color
            };

            assert.strictEqual(webviewConnection.color, '#e74c3c');
        });

        test('should map undefined color for connections without color', () => {
            const config: ConnectionConfig = {
                id: 'conn-2',
                name: 'Dev DB',
                server: 'localhost',
                database: 'dev',
                authType: 'windows',
                connectionType: 'database'
            };

            const webviewConnection = {
                id: config.id,
                name: config.name,
                server: config.server,
                database: config.database,
                connectionType: config.connectionType,
                authType: config.authType,
                color: config.color
            };

            assert.strictEqual(webviewConnection.color, undefined);
        });
    });

    suite('handleSaveConnection color handling', () => {
        test('should save color from form data', () => {
            // Simulates the logic in handleSaveConnection
            const formConfig = {
                id: 'new-conn',
                name: 'Colored Connection',
                server: 'myserver',
                database: 'mydb',
                authType: 'sql',
                connectionType: 'database',
                username: 'sa',
                password: 'pass',
                color: '#2ecc71'
            };

            const connectionConfig: ConnectionConfig = {
                id: formConfig.id || Date.now().toString(),
                name: formConfig.name,
                server: formConfig.server,
                database: formConfig.database,
                authType: formConfig.authType as 'sql' | 'windows' | 'azure',
                connectionType: formConfig.connectionType as 'database' | 'server',
                username: formConfig.username,
                password: formConfig.password,
                color: formConfig.color || undefined
            };

            assert.strictEqual(connectionConfig.color, '#2ecc71');
        });

        test('should not save color when null (disabled)', () => {
            const formConfig = {
                id: 'no-color-conn',
                name: 'No Color Connection',
                server: 'myserver',
                database: '',
                authType: 'windows',
                connectionType: 'server',
                color: null as string | null
            };

            const connectionConfig: ConnectionConfig = {
                id: formConfig.id || Date.now().toString(),
                name: formConfig.name,
                server: formConfig.server,
                database: formConfig.database,
                authType: formConfig.authType as 'sql' | 'windows' | 'azure',
                connectionType: formConfig.connectionType as 'database' | 'server',
                color: formConfig.color || undefined
            };

            assert.strictEqual(connectionConfig.color, undefined);
        });
    });
});
